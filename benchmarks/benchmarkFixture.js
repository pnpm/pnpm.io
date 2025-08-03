'use strict'
import path from 'path'
import pathKey from 'path-key'
import spawn from "cross-spawn"
import fsx from 'fs-extra'
import { promises as fs } from 'fs'
import getFolderSize from 'get-folder-size'
import rimraf from 'rimraf'
import { fileURLToPath } from 'url'
import tempy from 'tempy'

const DIRNAME = path.dirname(fileURLToPath(import.meta.url))

const FIXTURES_DIR = path.join(DIRNAME, 'fixtures')
const TMP = tempy.directory()

const lockfileNameByPM = {
  npm: 'package-lock.json',
  pnpm: 'pnpm-lock.yaml',
  yarn: 'yarn.lock'
}

export function createEnv (managersDir) {
  const pathEnv = pathKey()
  const env = Object.create(process.env)
  env[pathEnv] = [
    path.join(managersDir, 'node_modules/.bin'),
    path.dirname(process.execPath),
    process.env[pathEnv]
  ].join(path.delimiter)
  return env
}

function cleanLockfile (pm, cwd, env) {
  const lockfileName = lockfileNameByPM[pm.name]
  rimraf.sync(path.join(cwd, lockfileName))
  if (pm.name === 'yarn') {
    // This ensures yarn berry to install under a nested folder
    spawnSyncOrThrow({ name: 'nodetouch', args: [lockfileName] }, { env, cwd, stdio: "inherit" })
  }
}

async function updateDependenciesInPackageJson (cwd) {
  const packageJsonPath = path.join(cwd, 'package.json')
  const buf = await fs.readFile(packageJsonPath)
  const originalAsString = buf.toString()
  const parsed = JSON.parse(originalAsString)

  parsed.dependencies = {
    ...parsed.dependencies,
    "babel-core": "^6.4.0",
    "babel-eslint": "^6.1.2",
    "babel-loader": "^6.2.1",
    "babel-plugin-lodash": "^3.2.11",
    "babel-plugin-module-resolver": "^2.2.0",
    "babel-plugin-transform-decorators-legacy": "^1.3.4",
    "babel-plugin-transform-runtime": "^6.4.3",
    "babel-polyfill": "^6.23.0",
    "babel-preset-es2015": "^6.3.13",
    "babel-preset-react": "^6.3.13",
    "babel-preset-react-hmre": "^1.0.1",
    "babel-preset-stage-1": "^6.3.13",
    "babel-runtime": "^6.3.19",
    "clean-webpack-plugin": "^0.1.16",
    "core-decorators": "^0.12.3",
    "css-loader": "^0.23.1",
    "css-mqpacker": "^4.0.0",
    "react": "^15.4.1",
    "react-addons-css-transition-group": "^15.3.0",
    "react-addons-shallow-compare": "^15.3.0",
    "react-dnd": "^2.1.4",
    "react-dnd-html5-backend": "^2.1.2",
    "react-dom": "^15.4.1",
    "react-draft-wysiwyg": "^1.6.5",
    "react-dropzone": "^3.5.3",
    "react-grid-layout": "^0.12.6",
    "react-highcharts": "^11.5.0",
    "react-hot-loader": "v3.0.0-beta.6",
    "react-input-calendar": "^0.3.14",
    "react-lazyload": "^2.2.5",
    "react-measure": "^1.4.6",
    "react-mixin": "^3.0.3",
    "react-responsive": "^1.2.5",
    "react-responsive-tabs": "^0.5.3",
    "react-router": "^4.0.0",
    "react-router-dom": "^4.0.0",
    "react-select-plus": "^1.0.0-rc",
    "react-skylight": "^0.3.0",
    "react-sortablejs": "^1.2.1",
    "react-tappable": "^0.8.4",
    "react-tooltip": "3.11.2",
    "react-virtualized": "^7.19.4",
    "react-waypoint": "^5.2.0",
  }

  const modifiedAsString = JSON.stringify(parsed)
  await fs.writeFile(packageJsonPath, modifiedAsString)

  // return the original file so that we can replace it when done
  return originalAsString
}

export default async function benchmark (pm, fixture, opts) {
  const env = createEnv(opts.managersDir)
  const cwd = path.join(TMP, pm.scenario, fixture)
  fsx.copySync(path.join(FIXTURES_DIR, fixture), cwd)
  const modules = opts.hasNodeModules ? path.join(cwd, 'node_modules') : null

  cleanLockfile(pm, cwd, env)

  if (pm.name === 'yarn') {
    // Disable global mirror that speeds up yarn berry install
    let yarnRc =
      'enableImmutableInstalls: false\n'
    + 'enableMirror: false\n'
    + `cacheFolder: ${path.join(cwd, 'cache')}\n`
    + 'enableScripts: false\n'
    /**
     * @see https://yarnpkg.com/configuration/yarnrc#nodeLinker
     */
    switch (pm.scenario) {
      case 'yarn':
        yarnRc += 'nodeLinker: node-modules\n'
                + 'nmMode: hardlinks-local\n'
                + 'compressionLevel: 0\n'
                + 'nodeLinker: pnpm\n'
        break
      case 'yarn_pnp':
        yarnRc += 'nodeLinker: pnp\n'
        break
    }
    await fs.writeFile(path.join(cwd, '.yarnrc.yml'), yarnRc)
  }

  console.log(`# first install`)

  const firstInstall = measureInstall(pm, cwd, env)

  let repeatInstall
  if (modules) {
    console.log(`# repeat install`)

    repeatInstall = measureInstall(pm, cwd, env)

    rimraf.sync(modules)
  } else {
    repeatInstall = 0
  }

  console.log(`# with warm cache and lockfile`)

  const withWarmCacheAndLockfile = measureInstall(pm, cwd, env)

  if (modules) {
    rimraf.sync(modules)
  }

  cleanLockfile(pm, cwd)

  console.log('# with warm cache')

  const withWarmCache = measureInstall(pm, cwd, env)

  if (modules) {
    rimraf.sync(modules)
  }
  rimraf.sync(path.join(cwd, 'cache'))

  console.log('# with lockfile')

  const withLockfile = measureInstall(pm, cwd, env)

  cleanLockfile(pm, cwd)

  let withWarmCacheAndModules
  let withWarmModulesAndLockfile
  let withWarmModules
  let size
  if (modules) {
    console.log('# with warm cache and modules')

    withWarmCacheAndModules = measureInstall(pm, cwd, env)

    rimraf.sync(path.join(cwd, 'cache'))

    console.log('# with warm modules and lockfile')

    withWarmModulesAndLockfile = measureInstall(pm, cwd, env)

    rimraf.sync(path.join(cwd, 'cache'))
    cleanLockfile(pm, cwd)

    console.log('# with warm modules')

    withWarmModules = measureInstall(pm, cwd, env)

    size = await getFolderSize(modules).size
  } else {
    withWarmCacheAndModules =
      withWarmModulesAndLockfile =
      withWarmModules = 0
    size = await getFolderSize(path.join(cwd, 'cache')).size
  }

  console.log('# with updated dependencies')

  // update all dependency versions to '*' and install again
  const originalPackageJson = await updateDependenciesInPackageJson(cwd)
  if (pm.name === 'pnpm') {
    // This is needed to fix pnpm execution on CI
    pm = {
      ...pm,
      args: [...pm.args, '--no-frozen-lockfile'],
    }
  }
  const updatedDependencies = measureInstall(pm, cwd, env)

  // revert `package.json` back to its original state, just in case
  await fs.writeFile(path.join(cwd, 'package.json'), originalPackageJson)

  rimraf.sync(cwd)
  return {
    firstInstall,
    repeatInstall,
    withWarmCacheAndLockfile,
    withWarmCache,
    withLockfile,
    withWarmCacheAndModules,
    withWarmModulesAndLockfile,
    withWarmModules,
    updatedDependencies,
    size
  }
}

function measureInstall (cmd, cwd, env) {
  const startTime = Date.now()

  console.log(`> ${cmd.name} ${cmd.args.join(' ')}`)
  spawnSyncOrThrow(cmd, { env, cwd, stdio: "inherit" });

  const endTime = Date.now()

  return endTime - startTime
}

function spawnSyncOrThrow (cmd, opts) {
  const result = spawn.sync(cmd.name, cmd.args, opts);
  if (result.status !== 0) {
    throw new Error(`${cmd.name} failed with status code ${result.status}`)
  }
  return result;
}
