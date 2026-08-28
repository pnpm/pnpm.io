// What the benchmark page shows, and what it calls things.
//
// https://github.com/pnpm/benchmarks measures every tool and publishes the
// numbers in `benchmarks.json`; nothing there decides what a reader is shown.
// This file does. Adding or dropping a column is an edit here — and no
// benchmark has to be re-run to change what the page says.
//
// The manifest carries more than this page draws, on purpose: Yarn and Bun are
// measured for comparisons of our own and deliberately left off the site, so
// numbers for a tool that isn't listed here are expected rather than a column
// someone forgot to add.
//
// `key` is the name the manifest files a tool's results under. `legend` labels
// it in the charts, `mdLegend` (when it differs) in the tables, where it can be
// a link. `color` is the bar; `displayVersion` overrides the measured version
// under a chart legend, for a tool whose real version is an unhelpfully long
// prerelease string.

/** The columns of the install table, in the order they appear. */
export const packageManagerColumns = [
  {
    key: 'npm',
    legend: 'npm',
    color: '#cd3731',
  },
  {
    key: 'pnpm11',
    legend: 'pnpm',
    color: '#fbae00',
  },
  {
    key: 'pnpm12',
    legend: 'pnpm 🦀',
    mdLegend: '[pnpm 🦀](/blog/releases/12.0)',
    color: '#fbae00',
    displayVersion: '12',
    mascot: '🦀',
  },
  {
    // The same pnpm 12 as the column before it, resolving its dependency graph
    // on the registry instead of walking it itself.
    key: 'pnpm_pnpr',
    legend: 'pnpm + pnpr',
    mdLegend: '[pnpm + pnpr](/pnpr/install-acceleration)',
    color: '#2fa84f',
    displayVersion: '12',
  },
]

/**
 * The bars of the main chart.
 *
 * Not one per table column: pnpm 11 and pnpm 12 are merged into a single
 * stacked bar so that pnpm 12's speedup over pnpm 11 is visible at a glance,
 * and `pnpm_pnpr` is left out — it is the same pnpm as one of those bars, so a
 * bar of its own would read as another package manager rather than as a
 * setting. The table keeps it.
 */
export const mainChartBars = [
  { key: 'npm' },
  {
    stacked: true,
    primaryKey: 'pnpm12',
    secondaryKey: 'pnpm11',
    extraColor: '#cccccc',
    extraLegend: 'pnpm 11 extra',
  },
]

/** The columns of the Node.js version management table. */
export const nodeVersionManagerColumns = [
  {
    key: 'pnpm12',
    legend: 'pnpm',
    mdLegend: 'pnpm 12',
    color: '#fbae00',
    displayVersion: '12',
  },
  {
    key: 'fnm',
    legend: 'fnm',
    color: '#6f42c1',
  },
  {
    key: 'nvm',
    legend: 'nvm',
    color: '#5fa04e',
  },
]

/**
 * The install scenarios, keyed by the name the manifest reports them under.
 *
 * `cache`, `lockfile` and `nodeModules` are the table's own columns: which of
 * them are warm or present before install runs. `label` is what the chart
 * writes next to the bar group, one array entry per line. `explanation` is the
 * line under the table that maps the scenario onto something a reader does.
 *
 * The rows are ordered by the page, slowest first; the order here is only the
 * order they are declared in.
 */
export const installScenarios = {
  firstInstall: {
    action: 'install',
    cache: ' ',
    lockfile: ' ',
    nodeModules: ' ',
    label: ['clean'],
    explanation: '`clean`: a brand-new clone — nothing cached, no lockfile, no `node_modules`.',
  },
  withWarmModules: {
    action: 'install',
    cache: ' ',
    lockfile: ' ',
    nodeModules: '✔',
    label: ['node_modules'],
    explanation: '`node_modules`: the cache and lockfile are deleted and install is run again.',
  },
  withLockfile: {
    action: 'install',
    cache: ' ',
    lockfile: '✔',
    nodeModules: ' ',
    label: ['trusted lockfile'],
    explanation: '`trusted lockfile`: a CI server doing its first install.',
  },
  withWarmCacheAndModules: {
    action: 'install',
    cache: '✔',
    lockfile: ' ',
    nodeModules: '✔',
    label: ['cache', 'node_modules'],
    explanation: '`cache+node_modules`: the lockfile is deleted and install is run again.',
  },
  withWarmCache: {
    action: 'install',
    cache: '✔',
    lockfile: ' ',
    nodeModules: ' ',
    label: ['cache'],
    explanation: '`cache`: a developer reinstalling without a lockfile.',
  },
  withWarmCacheAndLockfile: {
    action: 'install',
    cache: '✔',
    lockfile: '✔',
    nodeModules: ' ',
    label: ['cache', 'trusted lockfile'],
    explanation: '`cache+trusted lockfile`: a developer reinstalling a known project.',
  },
  withWarmModulesAndLockfile: {
    action: 'install',
    cache: ' ',
    lockfile: '✔',
    nodeModules: '✔',
    label: ['trusted lockfile', 'node_modules'],
    explanation: '`trusted lockfile+node_modules`: the cache is deleted and install is run again.',
  },
  repeatInstall: {
    action: 'install',
    cache: '✔',
    lockfile: '✔',
    nodeModules: '✔',
    label: ['cache', 'trusted lockfile', 'node_modules'],
    explanation: '`cache+trusted lockfile+node_modules`: re-running install when nothing has changed.',
  },
  updatedDependencies: {
    action: 'update',
    cache: 'n/a',
    lockfile: 'n/a',
    nodeModules: 'n/a',
    label: ['update'],
    explanation: '`update`: dependency versions are bumped in `package.json` and install is run again, from a warm cache.',
  },
}

/**
 * The Node.js version management scenarios. `chartLabel` is absent for the one
 * that isn't charted: running Node.js takes milliseconds, so it would render as
 * an invisible bar. The table below the chart reports it.
 *
 * `describe` is given the Node.js versions the run pinned, so the table says
 * which ones were installed without this file having to know.
 */
export const nodeVersionScenarios = {
  cleanInstall: {
    describe: ({ primary }) => `install Node.js ${primary} with nothing cached`,
    chartLabel: ['install', 'clean'],
  },
  warmStoreInstall: {
    describe: ({ primary }) => `install Node.js ${primary} that was installed before`,
    chartLabel: ['install', 'warm store'],
  },
  runInProject: {
    describe: ({ secondary }) => `run \`node\` in a project pinned to Node.js ${secondary}`,
  },
}

/** The fixtures the page draws, and how it introduces each. */
export const fixtureHeadings = {
  'alotta-files': {
    title: 'Lots of Files',
    intro: "The app's [`alotta-files` package.json](https://github.com/pnpm/benchmarks/blob/main/fixtures/alotta-files/package.json)",
  },
}
