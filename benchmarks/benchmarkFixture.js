'use strict'
import path from 'path'
import pathKey from 'path-key'
import spawn from "cross-spawn"
import fsx from 'fs-extra'
import { promises as fs } from 'fs'
import getFolderSize from 'get-folder-size'
import rimraf from 'rimraf'
import { fileURLToPath } from 'url'

const DIRNAME = path.dirname(fileURLToPath(import.meta.url))

const FIXTURES_DIR = path.join(DIRNAME, 'fixtures')
const TMP = path.join(DIRNAME, '.tmp')

const lockfileNameByPM = {
  npm: 'package-lock.json',
  pnpm: 'pnpm-lock.yaml',
  yarn: 'yarn.lock',
  bun: 'bun.lockb',
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
  const lockfileName = lockfileNameByPM[pm.name.includes('bun') ? 'bun' : pm.name]
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

  // set all dependency versions to '*'
  Object.keys(parsed).forEach((key) => {
    if (key.toLowerCase().includes('dependencies')) {
      Object.keys(parsed[key]).forEach((dependency) => {
        parsed[key][dependency] = '*'
      })
    }
  })

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
