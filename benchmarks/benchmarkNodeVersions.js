'use strict'
import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'
import pathKey from 'path-key'
import spawn from 'cross-spawn'
import tempy from 'tempy'
import { createEnv } from './benchmarkFixture.js'

const TMP = tempy.directory()

// The install scenarios measure the primary version. The secondary one is what
// the global default is switched away from and what the project is pinned to.
export const PRIMARY_NODE_VERSION = '24'
export const SECONDARY_NODE_VERSION = '22'

// Running Node.js takes single digit milliseconds, which is the same order of
// magnitude as the noise of spawning a process, so that scenario is measured
// repeatedly and the fastest run is kept.
const RUNS_PER_MEASUREMENT = 10

// Each runner isolates its tool in `dir` so that scenarios never see the
// machine's real Node.js installations:
//   env()                     environment that points the tool at `dir`
//   prepare()                 create whatever the tool expects to exist upfront
//   install(version)          install a version and make it the global default
//   setDefault(version)       make an installed version the global default
//   dropInstalled()           remove installed runtimes, keeping the tool's cache
//   defaultVersion()          run Node.js with whatever the global default is
//   pinProject(dir, version)  pin a project directory to a version
//   runInProject()            run Node.js in a pinned project directory
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
    // The `node` on PATH is a shim that picks the runtime of the current
    // project, so running Node.js needs no extra command.
    const runInProject = () => ({ name: 'node', args: ['--version'] })
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
      // pnpm has no dedicated command for this: setting an already installed
      // version links it into the global bin directory.
      setDefault: install,
      dropInstalled: () => {
        rimraf.sync(home)
        prepare()
      },
      // Outside of a pinned project the shim runs the global default.
      defaultVersion: runInProject,
      pinProject: (projectDir, version) => {
        fs.writeFileSync(path.join(projectDir, 'package.json'), JSON.stringify({
          name: 'pinned-project',
          devEngines: { runtime: { name: 'node', version, onFail: 'download' } },
        }))
      },
      runInProject,
    }
  },
  fnm: (dir) => {
    const fnmDir = path.join(dir, 'fnm')
    // `fnm exec` resolves the version of the current project and runs the
    // command with it, which is what the `--use-on-cd` shell hook does on `cd`.
    const runInProject = () => ({ name: 'fnm', args: ['exec', '--', 'node', '--version'] })
    return {
      env: (baseEnv) => {
        const env = Object.create(baseEnv)
        env.FNM_DIR = fnmDir
        return env
      },
      prepare: () => {},
      install: (version) => ({ name: 'fnm', args: ['install', version] }),
      setDefault: (version) => ({ name: 'fnm', args: ['default', version] }),
      // fnm stores nothing besides the unpacked versions, so this leaves it
      // with a cold cache. That is the point of the scenario: fnm has to
      // download Node.js again, pnpm can link it from its store.
      dropInstalled: () => {
        rimraf.sync(path.join(fnmDir, 'node-versions'))
        rimraf.sync(path.join(fnmDir, 'aliases'))
      },
      defaultVersion: () => ({ name: 'fnm', args: ['exec', '--using=default', '--', 'node', '--version'] }),
      pinProject: (projectDir, version) => {
        fs.writeFileSync(path.join(projectDir, '.node-version'), `${version}\n`)
      },
      runInProject,
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
  // fnm keeps the version it installed first as the default, so the version to
  // switch away from is selected explicitly. Both tools are then in the same
  // state, which is what makes the timing below a switch and not a no-op.
  run(runner.setDefault(SECONDARY_NODE_VERSION), dir, env)
  const pinnedVersion = readDefaultVersion(runner, dir, env)
  assertVersion(pinnedVersion, SECONDARY_NODE_VERSION)

  console.log('# making an installed version the global default')

  const setDefault = measure(runner.setDefault(PRIMARY_NODE_VERSION), dir, env)
  assertVersion(readDefaultVersion(runner, dir, env), PRIMARY_NODE_VERSION)

  console.log(`# running Node.js in a project pinned to ${pinnedVersion}`)

  const projectDir = path.join(dir, 'project')
  fs.mkdirSync(projectDir, { recursive: true })
  runner.pinProject(projectDir, pinnedVersion)
  // The first run materializes the pinned runtime, the benchmark measures the
  // repeated runs that a project does afterwards.
  const runsPinnedVersion = capture(runner.runInProject(), projectDir, env).trim()
  assertVersion(runsPinnedVersion, SECONDARY_NODE_VERSION)
  const runInProject = measure(runner.runInProject(), projectDir, env, RUNS_PER_MEASUREMENT)

  rimraf.sync(dir)
  return {
    cleanInstall,
    warmStoreInstall,
    setDefault,
    runInProject,
  }
}

function readDefaultVersion (runner, cwd, env) {
  return capture(runner.defaultVersion(), cwd, env).trim().replace(/^v/, '')
}

// Guards against measuring some other Node.js that happens to be on PATH, and
// against a scenario silently degrading into a no-op.
function assertVersion (actual, expectedMajor) {
  if (!/^v?\d+\./.test(actual) || actual.replace(/^v/, '').split('.')[0] !== expectedMajor) {
    throw new Error(`Expected Node.js ${expectedMajor} to be used, got "${actual}"`)
  }
}

function measure (cmd, cwd, env, runs = 1) {
  let best = Infinity
  for (let i = 0; i < runs; i++) {
    // Some of these scenarios take single digit milliseconds, which the
    // resolution of Date.now() would round beyond recognition.
    const startTime = process.hrtime.bigint()
    run(cmd, cwd, env)
    best = Math.min(best, Number(process.hrtime.bigint() - startTime) / 1e6)
  }
  return Math.round(best * 100) / 100
}

function run (cmd, cwd, env) {
  console.log(`> ${cmd.name} ${cmd.args.join(' ')}`)
  const result = spawn.sync(cmd.name, cmd.args, { env, cwd, stdio: 'inherit' })
  if (result.status !== 0) {
    throw new Error(`${cmd.name} failed with status code ${result.status}`)
  }
}

function capture (cmd, cwd, env) {
  const result = spawn.sync(cmd.name, cmd.args, { env, cwd })
  if (result.status !== 0) {
    throw new Error(`${cmd.name} failed with status code ${result.status}. ${result.stderr?.toString()}`)
  }
  return result.stdout.toString()
}
