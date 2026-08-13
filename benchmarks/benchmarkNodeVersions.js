'use strict'
import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'
import pathKey from 'path-key'
import spawn from 'cross-spawn'
import tempy from 'tempy'
import { createEnv } from './benchmarkFixture.js'

const TMP = tempy.directory()

// Every scenario measures the primary version. The secondary one is only
// installed (unmeasured) so that the switch scenario has another version to
// switch away from.
export const PRIMARY_NODE_VERSION = '24'
const SECONDARY_NODE_VERSION = '22'

// Each runner isolates its tool in `dir` so that scenarios never see the
// machine's real Node.js installations:
//   env()             environment that points the tool at `dir`
//   prepare()         create whatever the tool expects to exist upfront
//   install(version)  install a Node.js version and make it the active one
//   activate(version) make an already installed version the active one
//   dropInstalled()   remove the installed runtimes, keeping the tool's cache
const runners = {
  pnpm12: (dir) => {
    // pnpm keeps the linked runtime under PNPM_HOME and the fetched files in
    // its content-addressable store, which lives outside of PNPM_HOME here so
    // that dropping the installed runtime leaves the store warm.
    const home = path.join(dir, 'home')
    const store = path.join(dir, 'store')
    const install = (version) => ({
      name: 'pnpm',
      args: ['runtime', 'set', 'node', version, '--global', `--store-dir=${store}`],
    })
    // pnpm refuses to install a global runtime when its global bin directory
    // is not in PATH, so the directory is created and exported upfront.
    const prepare = () => fs.mkdirSync(path.join(home, 'bin'), { recursive: true })
    return {
      env: (baseEnv) => {
        const pathEnv = pathKey()
        const env = Object.create(baseEnv)
        env.PNPM_HOME = home
        env[pathEnv] = [path.join(home, 'bin'), baseEnv[pathEnv]].join(path.delimiter)
        return env
      },
      prepare,
      install,
      // pnpm has no dedicated command for switching: setting an already
      // installed version links it into the global bin directory.
      activate: install,
      dropInstalled: () => {
        rimraf.sync(home)
        prepare()
      },
    }
  },
  fnm: (dir) => {
    const fnmDir = path.join(dir, 'fnm')
    return {
      env: (baseEnv) => {
        const env = Object.create(baseEnv)
        env.FNM_DIR = fnmDir
        return env
      },
      prepare: () => {},
      install: (version) => ({ name: 'fnm', args: ['install', version] }),
      activate: (version) => ({ name: 'fnm', args: ['default', version] }),
      // fnm stores nothing besides the unpacked versions, so this leaves it
      // with a cold cache. That is the point of the scenario: fnm has to
      // download Node.js again, pnpm can link it from its store.
      dropInstalled: () => {
        rimraf.sync(path.join(fnmDir, 'node-versions'))
        rimraf.sync(path.join(fnmDir, 'aliases'))
      },
    }
  },
}

export default async function benchmarkNodeVersions (pm, opts) {
  const dir = path.join(TMP, pm.scenario)
  rimraf.sync(dir)
  fs.mkdirSync(dir, { recursive: true })

  const runner = runners[pm.scenario](dir)
  const env = runner.env(createEnv(opts.managersDir))
  runner.prepare()

  console.log('# clean install of Node.js')

  const cleanInstall = measure(runner.install(PRIMARY_NODE_VERSION), dir, env)

  runner.dropInstalled()

  console.log('# install of Node.js with a warm store')

  const warmStoreInstall = measure(runner.install(PRIMARY_NODE_VERSION), dir, env)

  console.log(`# installing Node.js ${SECONDARY_NODE_VERSION} to switch away from`)

  run(runner.install(SECONDARY_NODE_VERSION), dir, env)

  console.log('# switching to an already installed version')

  const switchVersion = measure(runner.activate(PRIMARY_NODE_VERSION), dir, env)

  rimraf.sync(dir)
  return {
    cleanInstall,
    warmStoreInstall,
    switchVersion,
  }
}

function measure (cmd, cwd, env) {
  const startTime = Date.now()
  run(cmd, cwd, env)
  return Date.now() - startTime
}

function run (cmd, cwd, env) {
  console.log(`> ${cmd.name} ${cmd.args.join(' ')}`)
  const result = spawn.sync(cmd.name, cmd.args, { env, cwd, stdio: 'inherit' })
  if (result.status !== 0) {
    throw new Error(`${cmd.name} failed with status code ${result.status}`)
  }
}
