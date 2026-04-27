'use strict'
import fs from 'fs'
import rimraf from 'rimraf'
import commonTags from 'common-tags'
import prettyMs from 'pretty-ms'
import tempy from 'tempy'
import cmdsMap from './commandsMap.js'
import benchmark from './recordBenchmark.js'
import generateSvg from './generateSvg.js'
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
  'repeatInstall',
  'withWarmCacheAndLockfile',
  'withWarmCache',
  'withLockfile',
  'withWarmCacheAndModules',
  'withWarmModulesAndLockfile',
  'withWarmModules',
  'updatedDependencies'
]

const testDescriptions = [
  [ // firstInstall
    'clean install'
  ],
  [ // repeatInstall
    'with cache',
    'with lockfile',
    'with node_modules'
  ],
  [ // withWarmCacheAndLockfile
    'with cache',
    'with lockfile'
  ],
  [ // withWarmCache
    'with cache'
  ],
  [ // withLockfile
    'with lockfile'
  ],
  [ // withWarmCacheAndModules
    'with cache',
    'with node_modules'
  ],
  [ // withWarmModulesAndLockfile
    'with node_modules',
    'with lockfile'
  ],
  [ // withWarmModules
    'with node_modules'
  ],
  [ // updatedDependencies
    'update'
  ]
]

const toArray = (pms, resultsObj) => {
  /**
   * Make array of all similar installs grouped together:
   * [
   *   [ npm.firstInstall, yarn.firstInstall, pnpm.firstInstall ],
   *   [ npm.repeatInstall, yarn.repeatInstall, pnpm.repeatInstall ],
   *   ...
   * ]
   */
  return tests
    .map((test) => pms
      .map((pm) => resultsObj[pm][test])
      .map((time) => Math.round(time / 100) / 10) // round to `x.x` seconds
    )
}

run()
  .then(() => console.log('done'))
  .catch(err => console.error(err))

async function run () {
  const tmpDir = tempy.directory()
  const managersDirs = {}
  for (const pm of ['npm', 'pnpm11', 'pnpm12', 'yarn']) {
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
  spawn.sync('pnpm', ['add', 'pnpm@next-11'], { cwd: managersDirs.pnpm11, stdio: 'inherit' })
  spawn.sync('pnpm', ['add', 'pacquet@latest'], { cwd: managersDirs.pnpm12, stdio: 'inherit' })
  spawn.sync('yarn', ['set', 'version', 'stable'], { cwd: managersDirs.yarn, stdio: 'inherit' })
  const formattedNow = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date())
  const pmConfigs = [
    { key: 'npm', managersDir: managersDirs.npm },
    { key: 'pnpm11', managersDir: managersDirs.pnpm11 },
    {
      key: 'pnpm12',
      managersDir: managersDirs.pnpm12,
      hasNodeModules: false,
      supportedTests: ['withWarmCacheAndLockfile', 'withLockfile'],
      prepPm: cmdsMap.pnpm11,
      prepManagersDir: managersDirs.pnpm11,
    },
    { key: 'yarn', managersDir: managersDirs.yarn },
    { key: 'yarn_pnp', managersDir: managersDirs.yarn, hasNodeModules: false },
  ]
  const pms = pmConfigs.map(({ key }) => key)
  const tableRows = [
    { test: 'firstInstall',              action: 'install', cache: ' ',   lockfile: ' ',   nodeModules: ' '   },
    { test: 'repeatInstall',             action: 'install', cache: '✔',   lockfile: '✔',   nodeModules: '✔',   needsNodeModules: true },
    { test: 'withWarmCacheAndLockfile',   action: 'install', cache: '✔',   lockfile: '✔',   nodeModules: ' '   },
    { test: 'withWarmCache',             action: 'install', cache: '✔',   lockfile: ' ',   nodeModules: ' '   },
    { test: 'withLockfile',              action: 'install', cache: ' ',   lockfile: '✔',   nodeModules: ' '   },
    { test: 'withWarmCacheAndModules',   action: 'install', cache: '✔',   lockfile: ' ',   nodeModules: '✔',   needsNodeModules: true },
    { test: 'withWarmModulesAndLockfile', action: 'install', cache: ' ',   lockfile: '✔',   nodeModules: '✔',   needsNodeModules: true },
    { test: 'withWarmModules',           action: 'install', cache: ' ',   lockfile: ' ',   nodeModules: '✔',   needsNodeModules: true },
    { test: 'updatedDependencies',       action: 'update',  cache: 'n/a', lockfile: 'n/a', nodeModules: 'n/a' },
  ]
  const sections = []
  const svgs = []
  for (const fixture of fixtures) {
    const results = {}
    for (const { key, managersDir, hasNodeModules, supportedTests, prepPm, prepManagersDir } of pmConfigs) {
      results[key] = min(await benchmark(cmdsMap[key], fixture.name, {
        limitRuns: LIMIT_RUNS,
        hasNodeModules: hasNodeModules ?? true,
        managersDir,
        supportedTests,
        prepPm,
        prepManagersDir,
      }))
    }
    const resArray = toArray(pms, results)

    const headerLegends = pms.map(pm => cmdsMap[pm].mdLegend ?? cmdsMap[pm].legend).join(' | ')
    const headerSep = pms.map(() => '---').join(' | ')
    const rows = tableRows.map(({ test, action, cache, lockfile, nodeModules, needsNodeModules }) => {
      const values = pmConfigs.map(({ key, hasNodeModules: pmHasNodeModules, supportedTests }) => {
        if (supportedTests && !supportedTests.includes(test)) return 'n/a'
        if (needsNodeModules && pmHasNodeModules === false) return 'n/a'
        return prettyMs(results[key][test])
      }).join(' | ')
      return `| ${action} | ${cache} | ${lockfile} | ${nodeModules} | ${values} |`
    }).join('\n')

    sections.push(stripIndents`
      ${fixture.mdDesc}

      | action  | cache | lockfile | node_modules| ${headerLegends} |
      | ---     | ---   | ---      | ---         | ${headerSep} |
      ${rows}

      <img alt="Graph of the ${fixture.name} results" src="/img/benchmarks/${fixture.name}.svg" />
    `)

    svgs.push({
      path: path.join(BENCH_IMGS, `${fixture.name}.svg`),
      file: generateSvg(resArray, pms.map(pm => cmdsMap[pm]), testDescriptions, formattedNow)
    })

    // pnpm-only comparison: include only scenarios that every selected pnpm version supports.
    const pnpmConfigs = pmConfigs.filter(({ key }) => key.startsWith('pnpm'))
    const pnpmKeys = pnpmConfigs.map(({ key }) => key)
    const sharedTestIndexes = tests
      .map((test, i) => ({ test, i }))
      .filter(({ test }) => pnpmConfigs.every(({ supportedTests }) => !supportedTests || supportedTests.includes(test)))
      .filter(({ test }) => {
        const row = tableRows.find((r) => r.test === test)
        if (!row?.needsNodeModules) return true
        return pnpmConfigs.every(({ hasNodeModules }) => hasNodeModules !== false)
      })
      .map(({ i }) => i)

    const pnpmTests = sharedTestIndexes.map((i) => tests[i])
    const pnpmTestDescriptions = sharedTestIndexes.map((i) => testDescriptions[i])
    const pnpmResArray = pnpmTests.map((test) =>
      pnpmKeys
        .map((key) => results[key][test])
        .map((time) => Math.round(time / 100) / 10)
    )
    const pnpmHeaderLegends = pnpmKeys.map((key) => cmdsMap[key].mdLegend ?? cmdsMap[key].legend).join(' | ')
    const pnpmHeaderSep = pnpmKeys.map(() => '---').join(' | ')
    const pnpmRows = pnpmTests.map((test) => {
      const row = tableRows.find((r) => r.test === test)
      const values = pnpmKeys.map((key) => prettyMs(results[key][test])).join(' | ')
      return `| ${row.action} | ${row.cache} | ${row.lockfile} | ${row.nodeModules} | ${values} |`
    }).join('\n')

    const pnpmTitle = pnpmConfigs.map(({ key }) => cmdsMap[key].legend).join(' vs ')
    sections.push(stripIndents`
      ### ${pnpmTitle}

      pnpm v12 will use a new installation engine for fetching and linking written in Rust. See [pacquet](https://github.com/pnpm/pacquet).

      | action  | cache | lockfile | node_modules| ${pnpmHeaderLegends} |
      | ---     | ---   | ---      | ---         | ${pnpmHeaderSep} |
      ${pnpmRows}

      <img alt="Graph comparing pnpm versions on the ${fixture.name} fixture" src="/img/benchmarks/${fixture.name}-pnpm.svg" />
    `)

    svgs.push({
      path: path.join(BENCH_IMGS, `${fixture.name}-pnpm.svg`),
      file: generateSvg(pnpmResArray, pnpmConfigs.map(({ key }) => cmdsMap[key]), pnpmTestDescriptions, formattedNow)
    })
  }

  const introduction = stripIndents`
  # Benchmarks of JavaScript Package Managers

  **Last benchmarked at**: _${formattedNow}_ (_daily_ updated).

  This benchmark compares the performance of npm, pnpm, Yarn Classic, and Yarn PnP (check [Yarn's benchmarks](https://yarnpkg.com/benchmarks) for any other Yarn modes that are not included here).
  `

  const explanation = stripIndents`
  Here's a quick explanation of how these tests could apply to the real world:

  - \`clean install\`: How long it takes to run a totally fresh install: no lockfile present, no packages in the cache, no \`node_modules\` folder.
  - \`with cache\`, \`with lockfile\`, \`with node_modules\`: After the first install is done, the install command is run again.
  - \`with cache\`, \`with lockfile\`: When a repo is fetched by a developer and installation is first run.
  - \`with cache\`: Same as the one above, but the package manager doesn't have a lockfile to work from.
  - \`with lockfile\`: When an installation runs on a CI server.
  - \`with cache\`, \`with node_modules\`: The lockfile is deleted and the install command is run again.
  - \`with node_modules\`, \`with lockfile\`: The package cache is deleted and the install command is run again.
  - \`with node_modules\`: The package cache and the lockfile is deleted and the install command is run again.
  - \`update\`: Updating your dependencies by changing the version in the \`package.json\` and running the install command again.
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
