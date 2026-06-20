'use strict'
import crypto from 'crypto'
import fs from 'fs'
import rimraf from 'rimraf'
import commonTags from 'common-tags'
import prettyMs from 'pretty-ms'
import tempy from 'tempy'
import cmdsMap from './commandsMap.js'
import benchmark from './recordBenchmark.js'
import generateSvg from './generateSvg.js'
import generateStackedSvg from './generateStackedSvg.js'
import spawn from "cross-spawn"
import path from 'path'
import { fileURLToPath } from 'url'

const DIRNAME = path.dirname(fileURLToPath(import.meta.url))
const TMP = path.join(DIRNAME, '.tmp')
const BENCH_IMGS = path.join(DIRNAME, '../static/img/benchmarks')

const { stripIndents } = commonTags
const LIMIT_RUNS = 30

const fixtures = [
  /*{
    name: 'react-app',
    mdDesc: '## React App\n\nThe app\'s `package.json` [here](./fixtures/react-app/package.json)'
  },
  {
    name: 'ember-quickstart',
    mdDesc: '## Ember App\n\nThe app\'s `package.json` [here](./fixtures/ember-quickstart/package.json)'
  },
  {
    name: 'angular-quickstart',
    mdDesc: '## Angular App\n\nThe app\'s `package.json` [here](./fixtures/angular-quickstart/package.json)'
  },
  {
    name: 'medium-size-app',
    mdDesc: '## Medium Size App\n\nThe app\'s `package.json` [here](./fixtures/medium-size-app/package.json)'
  },*/
  {
    name: 'alotta-files',
    mdDesc: '## Lots of Files\n\nThe app\'s `package.json` [here](https://github.com/pnpm/pnpm.io/blob/main/benchmarks/fixtures/alotta-files/package.json)'
  }
]

const tests = [
  'firstInstall',
  'withWarmModules',
  'withLockfile',
  'withWarmCacheAndModules',
  'withWarmCache',
  'withWarmCacheAndLockfile',
  'withWarmModulesAndLockfile',
  'repeatInstall',
  'updatedDependencies'
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

const explanationByTest = {
  firstInstall:               '`clean`: a brand-new clone — nothing cached, no lockfile, no `node_modules`.',
  withWarmModules:            '`node_modules`: the cache and lockfile are deleted and install is run again.',
  withLockfile:               '`lockfile`: a CI server doing its first install.',
  withWarmCacheAndModules:    '`cache+node_modules`: the lockfile is deleted and install is run again.',
  withWarmCache:              '`cache`: a developer reinstalling without a lockfile.',
  withWarmCacheAndLockfile:   '`cache+lockfile`: a developer reinstalling a known project.',
  withWarmModulesAndLockfile: '`lockfile+node_modules`: the cache is deleted and install is run again.',
  repeatInstall:              '`cache+lockfile+node_modules`: re-running install when nothing has changed.',
  updatedDependencies:        '`update`: dependency versions are bumped in `package.json` and install is run again.',
}

// Sort tests by descending time on the first PM (npm) — slowest first.
// `updatedDependencies` is a different kind of action, so it gets pinned at the end.
const sortTestsBySlowest = (testKeys, resultsObj, pmKeys) => {
  const update = testKeys.filter(t => t === 'updatedDependencies')
  const installs = testKeys.filter(t => t !== 'updatedDependencies')
  const primary = pmKeys[0]
  const timeFor = (t) => resultsObj[primary][t] || 0
  installs.sort((a, b) => timeFor(b) - timeFor(a))
  return [...installs, ...update]
}

const toArray = (testList, pms, resultsObj) => testList
  .map((test) => pms
    .map((pm) => resultsObj[pm][test])
    .map((time) => Math.round(time / 100) / 10) // round to `x.x` seconds
  )

run()
  .then(() => console.log('done'))
  .catch(err => console.error(err))

async function run () {
  const tmpDir = tempy.directory()
  const managersDirs = {}
  for (const pm of ['npm', 'pnpm11', 'pnpm12', 'bun', 'yarn']) {
    managersDirs[pm] = path.join(tmpDir, pm)
  }
  await Promise.allSettled([
    rimraf(TMP),
    ...Object.values(managersDirs).map(dir => fs.promises.mkdir(dir, { recursive: true })),
    fs.promises.mkdir(BENCH_IMGS, { recursive: true }),
  ])
  for (const dir of Object.values(managersDirs)) {
    fs.writeFileSync(path.join(dir, 'package.json'), '{}', 'utf8')
  }
  spawn.sync('pnpm', ['add', 'npm@latest'], { cwd: managersDirs.npm, stdio: 'inherit' })
  spawn.sync('pnpm', ['add', 'pnpm@latest'], { cwd: managersDirs.pnpm11, stdio: 'inherit' })
  spawn.sync('pnpm', ['add', 'pacquet@latest'], { cwd: managersDirs.pnpm12, stdio: 'inherit' })
  spawn.sync('yarn', ['set', 'version', 'stable'], { cwd: managersDirs.yarn, stdio: 'inherit' })
  const formattedNow = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date())
  const pmConfigs = [
    { key: 'npm', managersDir: managersDirs.npm },
    { key: 'pnpm11', managersDir: managersDirs.pnpm11 },
    { key: 'pnpm12', managersDir: managersDirs.pnpm12 },
    { key: 'bun', managersDir: managersDirs.bun },
    { key: 'yarn', managersDir: managersDirs.yarn },
    { key: 'yarn_pnp', managersDir: managersDirs.yarn, hasNodeModules: false },
  ]
  const pms = pmConfigs.map(({ key }) => key)
  const tableRows = [
    { test: 'firstInstall',               action: 'install', cache: ' ',   lockfile: ' ',   nodeModules: ' '   },
    { test: 'withWarmModules',            action: 'install', cache: ' ',   lockfile: ' ',   nodeModules: '✔',   needsNodeModules: true },
    { test: 'withLockfile',               action: 'install', cache: ' ',   lockfile: '✔',   nodeModules: ' '   },
    { test: 'withWarmCacheAndModules',    action: 'install', cache: '✔',   lockfile: ' ',   nodeModules: '✔',   needsNodeModules: true },
    { test: 'withWarmCache',              action: 'install', cache: '✔',   lockfile: ' ',   nodeModules: ' '   },
    { test: 'withWarmCacheAndLockfile',   action: 'install', cache: '✔',   lockfile: '✔',   nodeModules: ' '   },
    { test: 'withWarmModulesAndLockfile', action: 'install', cache: ' ',   lockfile: '✔',   nodeModules: '✔',   needsNodeModules: true },
    { test: 'repeatInstall',              action: 'install', cache: '✔',   lockfile: '✔',   nodeModules: '✔',   needsNodeModules: true },
    { test: 'updatedDependencies',        action: 'update',  cache: 'n/a', lockfile: 'n/a', nodeModules: 'n/a' },
  ]
  const sections = []
  const svgs = []
  let sortedTests = tests
  for (const fixture of fixtures) {
    const results = {}
    for (const { key, managersDir, hasNodeModules } of pmConfigs) {
      results[key] = min(await benchmark(cmdsMap[key], fixture.name, {
        limitRuns: LIMIT_RUNS,
        hasNodeModules: hasNodeModules ?? true,
        managersDir,
      }))
    }
    sortedTests = sortTestsBySlowest(tests, results, pms)
    const sortedDescriptions = sortedTests.map(t => testDescriptions[t])
    const sortedTableRows = sortedTests.map(t => tableRows.find(r => r.test === t))

    const headerLegends = pms.map(pm => cmdsMap[pm].mdLegend ?? cmdsMap[pm].legend).join(' | ')
    const headerSep = pms.map(() => '---').join(' | ')
    const rows = sortedTableRows.map(({ test, action, cache, lockfile, nodeModules, needsNodeModules }) => {
      const values = pmConfigs.map(({ key, hasNodeModules: pmHasNodeModules }) => {
        if (needsNodeModules && pmHasNodeModules === false) return 'n/a'
        return prettyMs(results[key][test])
      }).join(' | ')
      return `| ${action} | ${cache} | ${lockfile} | ${nodeModules} | ${values} |`
    }).join('\n')

    // Main chart: pnpm 11 and pnpm 12 are merged into a single stacked bar so
    // pnpm 12's speedup over pnpm 11 is visible at a glance.
    const mainBars = [
      { ...cmdsMap.npm, key: 'npm' },
      {
        stacked: true,
        color: cmdsMap.pnpm12.color,
        legend: cmdsMap.pnpm12.legend,
        displayVersion: cmdsMap.pnpm12.displayVersion,
        extraColor: '#cccccc',
        extraLegend: 'pnpm 11 extra',
        primaryKey: 'pnpm12',
        secondaryKey: 'pnpm11',
      },
      { ...cmdsMap.bun, key: 'bun' },
      { ...cmdsMap.yarn, key: 'yarn' },
      { ...cmdsMap.yarn_pnp, key: 'yarn_pnp' },
    ]
    const resArray = sortedTests.map(test => mainBars.map(bar => bar.stacked
      ? {
          primary: Math.round(results[bar.primaryKey][test] / 100) / 10,
          secondary: Math.round(results[bar.secondaryKey][test] / 100) / 10,
        }
      : Math.round(results[bar.key][test] / 100) / 10
    ))
    const mainSvg = generateSvg(resArray, mainBars, sortedDescriptions, formattedNow)
    const mainSvgHash = hashContent(mainSvg)
    sections.push(stripIndents`
      ${fixture.mdDesc}

      | action  | cache | lockfile | node_modules| ${headerLegends} |
      | ---     | ---   | ---      | ---         | ${headerSep} |
      ${rows}

      <img alt="Graph of the ${fixture.name} results" src="/img/benchmarks/${fixture.name}.svg?v=${mainSvgHash}" />
    `)

    svgs.push({
      path: path.join(BENCH_IMGS, `${fixture.name}.svg`),
      file: mainSvg
    })

    // pnpm-only comparison: include only scenarios that every selected pnpm version supports.
    // Sorted independently of the main chart, keyed by pnpm 11 (the first pnpm config).
    const pnpmConfigs = pmConfigs.filter(({ key }) => key.startsWith('pnpm'))
    const pnpmKeys = pnpmConfigs.map(({ key }) => key)
    const pnpmSortedTests = sortTestsBySlowest(tests, results, pnpmKeys)
      .filter((test) => {
        const row = tableRows.find((r) => r.test === test)
        if (!row?.needsNodeModules) return true
        return pnpmConfigs.every(({ hasNodeModules }) => hasNodeModules !== false)
      })
    const pnpmTestDescriptions = pnpmSortedTests.map(t => testDescriptions[t])
    const pnpmHeaderLegends = pnpmKeys.map((key) => cmdsMap[key].mdLegend ?? cmdsMap[key].legend).join(' | ')
    const pnpmHeaderSep = pnpmKeys.map(() => '---').join(' | ')
    const pnpmRows = pnpmSortedTests.map((test) => {
      const row = tableRows.find((r) => r.test === test)
      const values = pnpmKeys.map((key) => prettyMs(results[key][test])).join(' | ')
      return `| ${row.action} | ${row.cache} | ${row.lockfile} | ${row.nodeModules} | ${values} |`
    }).join('\n')

    const pnpmTitle = pnpmConfigs.map(({ key }) => cmdsMap[key].legend).join(' vs ')
    const stackedResults = pnpmSortedTests.map((test, i) => ({
      label: pnpmTestDescriptions[i],
      v11: Math.round(results.pnpm11[test] / 100) / 10,
      v12: Math.round(results.pnpm12[test] / 100) / 10,
    }))
    const pnpmSvg = generateStackedSvg(stackedResults, formattedNow)
    const pnpmSvgHash = hashContent(pnpmSvg)
    sections.push(stripIndents`
      ### ${pnpmTitle}

      pnpm v12 will use a new installation engine for fetching and linking written in Rust. See [pacquet](https://github.com/pnpm/pacquet).

      | action  | cache | lockfile | node_modules| ${pnpmHeaderLegends} |
      | ---     | ---   | ---      | ---         | ${pnpmHeaderSep} |
      ${pnpmRows}

      <img alt="Graph comparing pnpm versions on the ${fixture.name} fixture" src="/img/benchmarks/${fixture.name}-pnpm.svg?v=${pnpmSvgHash}" />
    `)

    svgs.push({
      path: path.join(BENCH_IMGS, `${fixture.name}-pnpm.svg`),
      file: pnpmSvg
    })
  }

  const introduction = stripIndents`
  # Benchmarks of JavaScript Package Managers

  **Last benchmarked at**: _${formattedNow}_ (_daily_ updated).

  This benchmark compares the performance of npm, pnpm, Bun, Yarn Classic, and Yarn PnP (check [Yarn's benchmarks](https://yarnpkg.com/benchmarks) for any other Yarn modes that are not included here).
  `

  const explanationItems = sortedTests.map(t => `- ${explanationByTest[t]}`).join('\n  ')
  const explanation = stripIndents`
  Each row's label lists which of \`cache\`, \`lockfile\`, and \`node_modules\` are warm/present before install runs. Quick mapping to the real world (ordered from slowest to fastest scenario):

  ${explanationItems}
`

  await Promise.all(
    [
      ...svgs.map((file) => fs.promises.writeFile(file.path, file.file, 'utf-8')),
      fs.promises.writeFile(path.join(DIRNAME, '../src/pages/benchmarks.md'), stripIndents`
        ${introduction}

        ${explanation}

        ${sections.join('\n\n')}`, 'utf8')
    ]
  )
}

function average (benchmarkResults) {
  const results = {}
  tests.forEach(test => {
    results[test] = benchmarkResults.map(res => res[test]).reduce(sum, 0) / benchmarkResults.length
  })
  return results
}

function min (benchmarkResults) {
  const results = {}
  tests.forEach(test => {
    results[test] = Math.min.apply(Math, benchmarkResults.map(res => res[test]))
  })
  return results
}

function sum (a, b) {
  return a + b
}

function hashContent (content) {
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 8)
}
