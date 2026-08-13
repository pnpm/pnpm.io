'use strict'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import commonTags from 'common-tags'
import prettyMs from 'pretty-ms'
import { fileURLToPath } from 'url'
import cmdsMap from './commandsMap.js'
import recordBenchmark from './recordBenchmark.js'
import generateSvg from './generateSvg.js'
import { startLatencyProxy, mbpsToBytesPerSec } from './latencyProxy.js'
import {
  installPnpr,
  pnprVersion,
  startPnpr,
  mintToken,
  populateCache,
  verifyResolverIsUsed,
} from './pnprServer.js'

const { stripIndents } = commonTags
const DIRNAME = path.dirname(fileURLToPath(import.meta.url))

// The emulated link, matching the pnpm monorepo's own pnpr benchmark. The
// client-to-server latency is deliberately the same as the client-to-registry
// latency: a faster link to pnpr would flatter it for free, so whatever it
// wins has to come from making fewer round trips rather than cheaper ones.
const ROUND_TRIP_MS = 50
const BANDWIDTH_MBPS = 200

const PNPR_PORT = 7677

// Results are recorded under their own fixture name. The numbers here are
// measured against a different registry over an emulated link, so they must
// never be pooled with the main section's runs of the same fixture.
const FIXTURE = 'alotta-files'
const RESULTS_FIXTURE = 'alotta-files-pnpr'

const tests = [
  'firstInstall',
  'withWarmModules',
  'withLockfile',
  'withWarmCacheAndModules',
  'withWarmCache',
  'withWarmCacheAndLockfile',
  'withWarmModulesAndLockfile',
  'repeatInstall',
  'updatedDependencies',
]

const testDescriptions = {
  firstInstall:               ['clean'],
  withWarmModules:            ['node_modules'],
  withLockfile:               ['lockfile'],
  withWarmCacheAndModules:    ['cache', 'node_modules'],
  withWarmCache:              ['cache'],
  withWarmCacheAndLockfile:   ['cache', 'lockfile'],
  withWarmModulesAndLockfile: ['lockfile', 'node_modules'],
  repeatInstall:              ['cache', 'lockfile', 'node_modules'],
  updatedDependencies:        ['update'],
}

const tableRows = {
  firstInstall:               { action: 'install', cache: ' ',   lockfile: ' ',   nodeModules: ' '   },
  withWarmModules:            { action: 'install', cache: ' ',   lockfile: ' ',   nodeModules: '✔', needsNodeModules: true },
  withLockfile:               { action: 'install', cache: ' ',   lockfile: '✔',   nodeModules: ' '   },
  withWarmCacheAndModules:    { action: 'install', cache: '✔',   lockfile: ' ',   nodeModules: '✔', needsNodeModules: true },
  withWarmCache:              { action: 'install', cache: '✔',   lockfile: ' ',   nodeModules: ' '   },
  withWarmCacheAndLockfile:   { action: 'install', cache: '✔',   lockfile: '✔',   nodeModules: ' '   },
  withWarmModulesAndLockfile: { action: 'install', cache: ' ',   lockfile: '✔',   nodeModules: '✔', needsNodeModules: true },
  repeatInstall:              { action: 'install', cache: '✔',   lockfile: '✔',   nodeModules: '✔', needsNodeModules: true },
  updatedDependencies:        { action: 'update',  cache: 'n/a', lockfile: 'n/a', nodeModules: 'n/a' },
}

/**
 * Sends a package manager to a different registry than the one it defaults to.
 * The flag is what counts: npm, pnpm, and Bun each carry a `--registry` of
 * their own that would otherwise win over the `.npmrc` written next to the
 * fixture. Yarn takes no such flag and refuses to run when given one, so it is
 * left alone and configured through `.yarnrc.yml` instead.
 */
const withRegistry = (pm, registry) => pm.name === 'yarn'
  ? pm
  : {
      ...pm,
      args: [...pm.args.filter((arg) => !arg.startsWith('--registry=')), `--registry=${registry}`],
    }

/**
 * Benchmarks every package manager against a pnpr registry over an emulated
 * network link, and pnpm a second time with resolution offloaded to that same
 * server. Returns the markdown section and the chart.
 */
export default async function pnprSection ({ managersDirs, formattedNow, limitRuns, svgName }) {
  installPnpr(managersDirs.pnpr)
  const version = pnprVersion(managersDirs.pnpr)

  const dir = path.join(managersDirs.pnpr, 'server')
  const proxies = []
  let server
  try {
    // The links come up first: pnpr has to be told the address clients will
    // really use, so the tarball URLs it serves point across the emulated link
    // instead of around it.
    fs.mkdirSync(dir, { recursive: true })
    const registryLink = await startLatencyProxy({
      upstreamPort: PNPR_PORT,
      roundTripMs: ROUND_TRIP_MS,
      rateLimit: mbpsToBytesPerSec(BANDWIDTH_MBPS),
      logPath: path.join(dir, 'registry-link.log'),
    })
    proxies.push(registryLink)
    const registry = `http://127.0.0.1:${registryLink.port}`

    // Resolution requests cross a link of their own, at the same round trip.
    // Only latency is emulated here: the resolve exchange is small, so what it
    // costs is round trips rather than throughput.
    const resolverLink = await startLatencyProxy({
      upstreamPort: PNPR_PORT,
      roundTripMs: ROUND_TRIP_MS,
      logPath: path.join(dir, 'resolver-link.log'),
    })
    proxies.push(resolverLink)
    const pnprServer = `http://127.0.0.1:${resolverLink.port}`

    server = await startPnpr({
      managersDir: managersDirs.pnpr,
      dir,
      port: PNPR_PORT,
      publicUrl: registry,
      // Logging every request is what lets the check below see whether pnpm
      // really resolved on the server. It goes to a file, and every manager
      // faces the same server, so it costs all of them the same.
      logLevel: 'info',
    })
    const authToken = await mintToken(server.url)

    // Warm pnpr's cache before anything is timed. Otherwise whichever manager
    // ran first would pay to pull every package from npmjs into pnpr, and the
    // rest would be measured against a registry it had warmed for them.
    const fixtureDir = path.join(DIRNAME, 'fixtures', FIXTURE)
    populateCache({
      pm: withRegistry(cmdsMap.pnpm11, registry),
      managersDir: managersDirs.pnpm11,
      dir,
      registry,
      fixtureDir,
    })

    verifyResolverIsUsed({
      pm: withRegistry(cmdsMap.pnpm11, registry),
      managersDir: managersDirs.pnpm11,
      dir,
      registry,
      authToken,
      pnprServer,
      fixtureDir,
      serverLog: server.log,
    })

    const pmConfigs = [
      { key: 'npm', managersDir: managersDirs.npm },
      { key: 'pnpm11', managersDir: managersDirs.pnpm11 },
      { key: 'pnpm12', managersDir: managersDirs.pnpm12 },
      { key: 'yarn', managersDir: managersDirs.yarn },
      { key: 'yarn_pnp', managersDir: managersDirs.yarn, hasNodeModules: false },
      { key: 'bun', managersDir: managersDirs.bun },
      // The same pnpm as the row above, resolving on the server instead of
      // walking the graph itself, so the difference is pnpr and nothing else.
      { key: 'pnpm_pnpr', managersDir: managersDirs.pnpm11, pnprServer, authToken },
    ]

    const results = {}
    for (const { key, managersDir, hasNodeModules, ...rest } of pmConfigs) {
      // The registry has to be forced on the command line as well as in the
      // config: npm, pnpm, and Bun each carry a `--registry` of their own, and
      // it would win over the `.npmrc` written next to the fixture.
      results[key] = min(await recordBenchmark(withRegistry(cmdsMap[key], registry), FIXTURE, {
        limitRuns,
        resultsName: RESULTS_FIXTURE,
        hasNodeModules: hasNodeModules ?? true,
        managersDir,
        registry,
        ...rest,
      }))
    }

    return buildSection({ results, pmConfigs, version, formattedNow, svgName })
  } finally {
    for (const proxy of proxies) proxy.close()
    server?.stop()
  }
}

function buildSection ({ results, pmConfigs, version, formattedNow, svgName }) {
  const keys = pmConfigs.map(({ key }) => key)
  const headerLegends = keys.map((key) => cmdsMap[key].mdLegend ?? cmdsMap[key].legend).join(' | ')
  const headerSep = keys.map(() => '---').join(' | ')

  // Slowest first, keyed by npm, with the update row pinned to the end.
  const sorted = [...tests.filter((t) => t !== 'updatedDependencies')]
    .sort((a, b) => (results.npm[b] || 0) - (results.npm[a] || 0))
    .concat('updatedDependencies')

  const rows = sorted.map((test) => {
    const row = tableRows[test]
    const values = pmConfigs.map(({ key, hasNodeModules }) => {
      if (row.needsNodeModules && hasNodeModules === false) return 'n/a'
      return prettyMs(results[key][test])
    }).join(' | ')
    return `| ${row.action} | ${row.cache} | ${row.lockfile} | ${row.nodeModules} | ${values} |`
  }).join('\n')

  const bars = pmConfigs.map(({ key }) => ({ ...cmdsMap[key], key, version }))
  const resArray = sorted.map((test) => bars.map((bar) => Math.round(results[bar.key][test] / 100) / 10))
  const svg = generateSvg(resArray, bars, sorted.map((t) => testDescriptions[t]), formattedNow)
  const svgHash = hashContent(svg)

  const section = stripIndents`
    ## Installing Through a Registry Server

    The section above installs from the public npm registry over whatever link the benchmark machine happens to have. This one puts every package manager behind the same [pnpr](/pnpr) registry across an emulated ${ROUND_TRIP_MS}ms round trip at ${BANDWIDTH_MBPS} Mbit/s, and adds a row for pnpm resolving its dependency graph [on the server](/pnpr/install-acceleration) instead of walking it itself.

    | action  | cache | lockfile | node_modules| ${headerLegends} |
    | ---     | ---   | ---      | ---         | ${headerSep} |
    ${rows}

    <img alt="Graph comparing package managers installing through a pnpr registry" src="/img/benchmarks/${svgName}.svg?v=${svgHash}" />

    How to read these numbers:

    - **They are not comparable to the section above.** A different registry and an emulated network make these runs slower across the board. What they compare is the package managers against each other under one shared, reproducible network, not against their own numbers elsewhere on this page.
    - **Every manager crosses the same link.** The registry round trip is applied to all of them, and to pnpm's resolution requests as well, so no client gets a cheaper connection than another.
    - **pnpr's cache is warmed before anything is timed**, so no manager pays to pull the fixture into the registry on behalf of the ones measured after it.
    - **Server-side resolution pays off when there is a graph to resolve.** Resolving one means walking it level by level, and each level costs a round trip, so the cost is roughly the depth of the graph times the latency. pnpr does that walk next to the registry and answers with the whole resolved lockfile at once, which is why the rows without a lockfile — and the row that changes dependencies — are the ones where it pulls ahead of plain pnpm.
    - **It costs a round trip when there is not.** pnpm asks the server on every install, including the ones where the lockfile is already up to date and there is nothing to work out. The server answers a question it has been asked before from its cache, in a few milliseconds — what the client pays for is the round trip and having the resolved lockfile streamed back, which plain pnpm never pays because it never asks. That is why the rows with a lockfile can come out behind plain pnpm rather than level with it.
    - Tarballs are still fetched by the client, in parallel and directly, on every row.
  `

  return { section, svg }
}

function min (benchmarkResults) {
  const results = {}
  for (const test of tests) {
    results[test] = Math.min(...benchmarkResults.map((res) => res[test]))
  }
  return results
}

function hashContent (content) {
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 8)
}
