'use strict'
import crypto from 'crypto'
import commonTags from 'common-tags'
import prettyMs from 'pretty-ms'
import nodeManagersMap from './nodeManagersMap.js'
import recordBenchmark from './recordBenchmark.js'
import benchmarkNodeVersions, { PRIMARY_NODE_VERSION, SECONDARY_NODE_VERSION, readManagerVersion } from './benchmarkNodeVersions.js'
import generateSvg from './generateSvg.js'

const { stripIndents } = commonTags

const managers = ['pnpm12', 'fnm', 'nvm']

const tests = [
  'cleanInstall',
  'warmStoreInstall',
  'setDefault',
  'runInProject',
]

// Only the installs are charted. The other scenarios are milliseconds, so they
// would render as invisible bars. The table below the chart reports them all.
const chartTests = ['cleanInstall', 'warmStoreInstall']

const testDescriptions = {
  cleanInstall:     `install Node.js ${PRIMARY_NODE_VERSION} with nothing cached`,
  warmStoreInstall: `install Node.js ${PRIMARY_NODE_VERSION} that was installed before`,
  setDefault:       'make an installed version the global default',
  runInProject:     `run \`node\` in a project pinned to Node.js ${SECONDARY_NODE_VERSION}`,
}

const chartLabels = {
  cleanInstall:     ['install', 'clean'],
  warmStoreInstall: ['install', 'warm store'],
}

/**
 * Benchmarks pnpm against the other Node.js version managers on installing and
 * switching Node.js versions and returns the markdown section and the chart.
 */
export default async function nodeVersionsSection ({ managersDirs, formattedNow, limitRuns, svgName }) {
  const results = {}
  for (const key of managers) {
    results[key] = min(await recordBenchmark(nodeManagersMap[key], 'node-versions', {
      limitRuns,
      managersDir: managersDirs[key],
      getVersion: readManagerVersion,
      benchmarkFn: (pm, _fixture, opts) => benchmarkNodeVersions(pm, opts),
    }))
  }

  const headerLegends = managers.map((key) => nodeManagersMap[key].mdLegend ?? nodeManagersMap[key].legend).join(' | ')
  const headerSep = managers.map(() => '---').join(' | ')
  const rows = tests.map((test) => {
    const values = managers.map((key) => prettyMs(results[key][test])).join(' | ')
    return `| ${testDescriptions[test]} | ${values} |`
  }).join('\n')

  const bars = managers.map((key) => ({ ...nodeManagersMap[key], key }))
  const resArray = chartTests.map((test) => bars.map((bar) => Math.round(results[bar.key][test] / 100) / 10))
  const svg = generateSvg(resArray, bars, chartTests.map((test) => chartLabels[test]), formattedNow)
  const svgHash = hashContent(svg)

  const section = stripIndents`
    ## Node.js Version Management

    pnpm installs and switches Node.js versions itself, so a separate version manager is not needed. This section compares [\`pnpm runtime set node\`](/cli/runtime) with fnm and nvm.

    | scenario | ${headerLegends} |
    | ---      | ${headerSep} |
    ${rows}

    <img alt="Graph comparing Node.js version managers on installing Node.js" src="/img/benchmarks/${svgName}.svg?v=${svgHash}" />

    A few things to keep in mind when reading these numbers:

    - pnpm keeps Node.js in its content-addressable store and nvm keeps the downloaded tarballs in \`$NVM_DIR/.cache\`, so for both of them installing a version that was installed before needs no download. fnm has no download cache and fetches Node.js again.
    - pnpm doesn't extract the \`npm\`, \`npx\`, and \`corepack\` binaries bundled with Node.js, so on a clean install it downloads and writes fewer files than the other two.
    - Changing the global default is a different operation in each tool. pnpm links the runtime into its global bin directory, fnm flips a symlink, nvm writes an alias file. The last two only take effect in shells that loaded them — \`eval "$(fnm env)"\` for fnm, \`source nvm.sh\` for nvm.
    - Per-project switching costs no command at all in pnpm: the \`node\` on your PATH is a shim that reads the [\`devEngines.runtime\`](/package_json#devenginesruntime) of the project and runs the matching version. fnm and nvm read a \`.node-version\` or \`.nvmrc\` file through a shell hook that fires on \`cd\`, which is what \`fnm exec\` and \`nvm use\` measure in that row. Loading nvm into the shell in the first place is not counted at all here, and it costs more than everything in that row.
    - All three have to materialize the pinned version the first time a project asks for it: pnpm links it from its store, fnm downloads it, nvm unpacks it. The row measures the repeated runs after that.
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
