// What the benchmark charts draw, and what they call things.
//
// https://github.com/pnpm/benchmarks measures every tool and publishes the
// numbers in `benchmarks.json`; nothing there decides what a reader is shown.
// This file does. Adding or dropping a bar is an edit here — and no benchmark
// has to be re-run to change what the charts say.
//
// The manifest carries more than the charts draw, on purpose: Yarn and Bun are
// measured for comparisons of our own and deliberately left off the site, so
// numbers for a tool that isn't listed here are expected rather than a bar
// someone forgot to add.
//
// `key` is the name the manifest files a tool's results under. `legend` labels
// it in the charts, `color` is the bar, and `displayVersion` overrides the
// measured version under a chart legend, for a tool whose real version is an
// unhelpfully long prerelease string.

/** The package managers the charts are drawn from, in the order they appear. */
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
    color: '#fbae00',
    displayVersion: '12',
    mascot: '🦀',
  },
]

/**
 * The bars of the main chart.
 *
 * Not one per package manager: pnpm 11 and pnpm 12 are merged into a single
 * stacked bar so that pnpm 12's speedup over pnpm 11 is visible at a glance.
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

/** The bars of the Node.js version management chart. */
export const nodeVersionManagerColumns = [
  {
    key: 'pnpm12',
    legend: 'pnpm',
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
 * `label` is what the chart writes next to the bar group, one array entry per
 * line.
 *
 * The bar groups are ordered by the chart, slowest first; the order here is
 * only the order they are declared in.
 */
export const installScenarios = {
  firstInstall: { label: ['clean'] },
  withWarmModules: { label: ['node_modules'] },
  withLockfile: { label: ['trusted lockfile'] },
  withWarmCacheAndModules: { label: ['cache', 'node_modules'] },
  withWarmCache: { label: ['cache'] },
  withWarmCacheAndLockfile: { label: ['cache', 'trusted lockfile'] },
  withWarmModulesAndLockfile: { label: ['trusted lockfile', 'node_modules'] },
  repeatInstall: { label: ['cache', 'trusted lockfile', 'node_modules'] },
  updatedDependencies: { label: ['update'] },
}

/**
 * The Node.js version management scenarios that are charted. The manifest
 * also measures running `node` in a project pinned to a version; that takes
 * milliseconds and would render as an invisible bar, so it is left out.
 */
export const nodeVersionScenarios = {
  cleanInstall: { label: ['install', 'clean'] },
  warmStoreInstall: { label: ['install', 'warm store'] },
}

/** The fixtures the charts are drawn for, by the name the manifest gives them. */
export const chartedFixtures = ['alotta-files']
