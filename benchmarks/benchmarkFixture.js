'use strict'
import path from 'path'
import pathKey from 'path-key'
import spawn from "cross-spawn"
import fsx from 'fs-extra'
import { promises as fs } from 'fs'
import getFolderSizeCB from 'get-folder-size'
import rimraf from 'rimraf'
import { promisify } from 'util'
import { fileURLToPath } from 'url'

const DIRNAME = path.dirname(fileURLToPath(import.meta.url))
const getFolderSize = promisify(getFolderSizeCB)

const FIXTURES_DIR = path.join(DIRNAME, 'fixtures')
const TMP = path.join(DIRNAME, '.tmp')

const lockfileNameByPM = {
  npm: 'package-lock.json',
  pnpm: 'pnpm-lock.yaml',
  yarn: 'yarn.lock'
}

const env = createEnv()

function createEnv () {
  const pathEnv = pathKey()
  const env = Object.create(process.env)
  env[pathEnv] = [
    path.join(DIRNAME, 'managers/node_modules/.bin'),
    path.dirname(process.execPath),
    process.env[pathEnv]
  ].join(path.delimiter)
  return env
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
  const cwd = path.join(TMP, pm.scenario, fixture)
  fsx.copySync(path.join(FIXTURES_DIR, fixture), cwd)
  const modules = opts.hasNodeModules ? path.join(cwd, 'node_modules') : null

  console.log(`# first install`)

  const firstInstall = measureInstall(pm, cwd)

  let repeatInstall
  if (modules) {
    console.log(`# repeat install`)

    repeatInstall = measureInstall(pm, cwd)

    rimraf.sync(modules)
  } else {
    repeatInstall = 0
  }

  console.log(`# with warm cache and lockfile`)

  const withWarmCacheAndLockfile = measureInstall(pm, cwd)

  if (modules) {
    rimraf.sync(modules)
  }

  const lockfileName = lockfileNameByPM[pm.name]
  rimraf.sync(path.join(cwd, lockfileName))

  console.log('# with warm cache')

  const withWarmCache = measureInstall(pm, cwd)

  if (modules) {
    rimraf.sync(modules)
  }
  rimraf.sync(path.join(cwd, 'cache'))

  console.log('# with lockfile')

  const withLockfile = measureInstall(pm, cwd)

  rimraf.sync(path.join(cwd, lockfileName))

  let withWarmCacheAndModules
  let withWarmModulesAndLockfile
  let withWarmModules
  let size
  if (modules) {
    console.log('# with warm cache and modules')

    withWarmCacheAndModules = measureInstall(pm, cwd)

    rimraf.sync(path.join(cwd, 'cache'))

    console.log('# with warm modules and lockfile')

    withWarmModulesAndLockfile = measureInstall(pm, cwd)

    rimraf.sync(path.join(cwd, 'cache'))
    rimraf.sync(path.join(cwd, lockfileName))

    console.log('# with warm modules')

    withWarmModules = measureInstall(pm, cwd)

    size = await getFolderSize(modules)
  } else {
    withWarmCacheAndModules =
      withWarmModulesAndLockfile =
      withWarmModules = 0
    size = await getFolderSize(path.join(cwd, 'cache'))
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
  const updatedDependencies = measureInstall(pm, cwd)

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

function measureInstall (cmd, cwd) {
  const startTime = Date.now()

  console.log(`> ${cmd.name} ${cmd.args.join(' ')}`)
  const result = spawn.sync(cmd.name, cmd.args, { env, cwd, stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`${cmd.name} failed with status code ${result.status}`)
  }

  const endTime = Date.now()

  return endTime - startTime
}
