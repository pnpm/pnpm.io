'use strict'
import fs from 'fs'
import { promisify } from 'util'
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
    mdDesc: '## Lots of Files\n\nThe app\'s `package.json` [here](https://github.com/pnpm/pnpm.github.io/blob/main/benchmarks/fixtures/alotta-files/package.json)'
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

async function installYarnBerryLikeModule (managersDir) {
  spawn.sync('pnpm', ['exec', 'yarn', 'set', 'version', 'berry'], { cwd: managersDir, stdio: 'inherit' })
  const result = spawn.sync('pnpm', ['exec', 'yarn', '--version'], { cwd: managersDir })
  const yarnBerryVersion = result.stdout.toString().trim()

  const yarnPkgJsonPath = path.join(managersDir, 'node_modules/yarn/package.json')
  const yarnPkgJson = JSON.parse(fs.readFileSync(yarnPkgJsonPath, 'utf-8'))
  yarnPkgJson.version = yarnBerryVersion

  // Replace yarn binary with the yarn berry script
  await Promise.allSettled([
    fs.promises.writeFile(yarnPkgJsonPath, JSON.stringify(yarnPkgJson)),
    fs.promises.rename(path.join(managersDir, `.yarn/releases/yarn-${yarnBerryVersion}.cjs`), path.join(managersDir, 'node_modules/.bin/yarn')),
    fs.promises.rm(path.join(managersDir, '.yarnrc.yml')),
  ]);
}

run()
  .then(() => console.log('done'))
  .catch(err => console.error(err))

async function run () {
  const managersDir = path.join(tempy.directory(), 'managers')
  await Promise.allSettled([
    promisify(rimraf)(TMP),
    // make sure folder exists
    fs.promises.mkdir(managersDir, { recursive: true }),
    fs.promises.mkdir(BENCH_IMGS, { recursive: true }),
  ])
  spawn.sync('pnpm', ['init', '--yes'], { cwd: managersDir })
  spawn.sync('pnpm', ['add', 'yarn@latest', 'npm@latest', 'pnpm@latest'], { cwd: managersDir, stdio: 'inherit' })
  await installYarnBerryLikeModule(managersDir)
  const formattedNow = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date())
  const pms = [ 'npm', 'pnpm', 'yarn', 'yarn_pnp' ]
  const sections = []
  const svgs = []
  const opts = {
    limitRuns: LIMIT_RUNS,
    hasNodeModules: true,
    managersDir,
  }
  for (const fixture of fixtures) {
    const npmRes = min(await benchmark(cmdsMap.npm, fixture.name, opts))
    const yarnRes = min(await benchmark(cmdsMap.yarn, fixture.name, opts))
    const yarnPnPRes = min(await benchmark(cmdsMap.yarn_pnp, fixture.name, {
      ...opts,
      hasNodeModules: false,
    }))
    const pnpmRes = min(await benchmark(cmdsMap.pnpm, fixture.name, opts))
    const resArray = toArray(pms, {
      'npm': npmRes,
      'pnpm': pnpmRes,
      'yarn': yarnRes,
      'yarn_pnp': yarnPnPRes,
    })

    sections.push(stripIndents`
      ${fixture.mdDesc}

      | action  | cache | lockfile | node_modules| npm | pnpm | Yarn | Yarn PnP |
      | ---     | ---   | ---      | ---         | --- | ---  | ---  | ---      |
      | install |       |          |             | ${prettyMs(npmRes.firstInstall)} | ${prettyMs(pnpmRes.firstInstall)} | ${prettyMs(yarnRes.firstInstall)} | ${prettyMs(yarnPnPRes.firstInstall)} |
      | install | ✔     | ✔        | ✔           | ${prettyMs(npmRes.repeatInstall)} | ${prettyMs(pnpmRes.repeatInstall)} | ${prettyMs(yarnRes.repeatInstall)} | n/a |
      | install | ✔     | ✔        |             | ${prettyMs(npmRes.withWarmCacheAndLockfile)} | ${prettyMs(pnpmRes.withWarmCacheAndLockfile)} | ${prettyMs(yarnRes.withWarmCacheAndLockfile)} | ${prettyMs(yarnPnPRes.withWarmCacheAndLockfile)} |
      | install | ✔     |          |             | ${prettyMs(npmRes.withWarmCache)} | ${prettyMs(pnpmRes.withWarmCache)} | ${prettyMs(yarnRes.withWarmCache)} | ${prettyMs(yarnPnPRes.withWarmCache)} |
      | install |       | ✔        |             | ${prettyMs(npmRes.withLockfile)} | ${prettyMs(pnpmRes.withLockfile)} | ${prettyMs(yarnRes.withLockfile)} | ${prettyMs(yarnPnPRes.withLockfile)} |
      | install | ✔     |          | ✔           | ${prettyMs(npmRes.withWarmCacheAndModules)} | ${prettyMs(pnpmRes.withWarmCacheAndModules)} | ${prettyMs(yarnRes.withWarmCacheAndModules)} | n/a |
      | install |       | ✔        | ✔           | ${prettyMs(npmRes.withWarmModulesAndLockfile)} | ${prettyMs(pnpmRes.withWarmModulesAndLockfile)} | ${prettyMs(yarnRes.withWarmModulesAndLockfile)} | n/a |
      | install |       |          | ✔           | ${prettyMs(npmRes.withWarmModules)} | ${prettyMs(pnpmRes.withWarmModules)} | ${prettyMs(yarnRes.withWarmModules)} | n/a |
      | update  | n/a | n/a | n/a | ${prettyMs(npmRes.updatedDependencies)} | ${prettyMs(pnpmRes.updatedDependencies)} | ${prettyMs(yarnRes.updatedDependencies)} | ${prettyMs(yarnPnPRes.updatedDependencies)} |

      <img alt="Graph of the ${fixture.name} results" src="/img/benchmarks/${fixture.name}.svg" />
    `)

    sections.push(`## The reason pnpm is fast

Why is pnpm so crazy fast compared to other "traditional" package managers?

pnpm doesn't have blocking stages of installation. Each dependency has its own stages and the next stage starts as soon as possible.

![](/img/installation-stages-of-other-pms.png)

![](/img/installation-stages-of-pnpm.jpg)
`)

    svgs.push({
      path: path.join(BENCH_IMGS, `${fixture.name}.svg`),
      file: generateSvg(resArray, [cmdsMap.npm, cmdsMap.pnpm, cmdsMap.yarn, cmdsMap.yarn_pnp], testDescriptions, formattedNow)
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
