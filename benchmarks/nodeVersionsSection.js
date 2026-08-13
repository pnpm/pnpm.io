'use strict'
import crypto from 'crypto'
import commonTags from 'common-tags'
import prettyMs from 'pretty-ms'
import nodeManagersMap from './nodeManagersMap.js'
import recordBenchmark from './recordBenchmark.js'
import benchmarkNodeVersions, { PRIMARY_NODE_VERSION, SECONDARY_NODE_VERSION } from './benchmarkNodeVersions.js'
import generateSvg from './generateSvg.js'

const { stripIndents } = commonTags

const managers = ['pnpm12', 'fnm']

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
 * Benchmarks pnpm against fnm on installing and switching Node.js versions and
 * returns the markdown section and the chart to write next to it.
 */
export default async function nodeVersionsSection ({ managersDirs, formattedNow, limitRuns, svgName }) {
  const results = {}
  for (const key of managers) {
    results[key] = min(await recordBenchmark(nodeManagersMap[key], 'node-versions', {
      limitRuns,
      managersDir: managersDirs[key],
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

    pnpm installs and switches Node.js versions itself, so a separate version manager is not needed. This section compares [\`pnpm runtime set node\`](/cli/runtime) with [fnm](https://github.com/Schniz/fnm).

    | scenario | ${headerLegends} |
    | ---      | ${headerSep} |
    ${rows}

    <img alt="Graph comparing pnpm and fnm on installing Node.js" src="/img/benchmarks/${svgName}.svg?v=${svgHash}" />

    A few things to keep in mind when reading these numbers:

    - pnpm keeps Node.js in its content-addressable store, so installing a version that was installed before is a relink with no download. fnm has no download cache, so it fetches Node.js again.
    - pnpm doesn't extract the \`npm\`, \`npx\`, and \`corepack\` binaries bundled with Node.js, so on a clean install it downloads and writes fewer files than fnm.
    - Changing the global default is not the same operation in both tools. pnpm links the runtime into its global bin directory, fnm flips a symlink that only takes effect in shells evaluating \`fnm env\`.
    - Per-project switching costs no command at all in pnpm: the \`node\` on your PATH is a shim that reads the [\`devEngines.runtime\`](/package_json#devenginesruntime) of the project and runs the matching version. With fnm, a \`.node-version\` file is picked up by its \`--use-on-cd\` shell hook, which is what the \`fnm exec\` in this row measures.
    - Both tools have to materialize the pinned version the first time a project asks for it: pnpm links it from its store, fnm downloads it. The row above measures the repeated runs after that.
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
