'use strict'
import spawn from "cross-spawn"
import benchmark, { createEnv } from './benchmarkFixture.js'
import path from 'path'
import writeYamlFile from 'write-yaml-file'
import { loadYamlFile } from 'load-yaml-file'
import { fileURLToPath } from 'url'

const DIRNAME = path.dirname(fileURLToPath(import.meta.url))
const RESULTS = path.join(DIRNAME, 'results')

export default async function (pm, fixture, opts) {
  opts = opts || {}
  const limitRuns = opts.limitRuns || Infinity

  pm.version = getPMVersion(pm.name, opts)
  const resultsFile = path.join(RESULTS, pm.scenario, pm.version, `${fixture}.yaml`)
  const prevResults = await safeLoadYamlFile(resultsFile) || []

  if (prevResults.length >= limitRuns) return prevResults

  const newResults = await benchmark(pm, fixture, {
    hasNodeModules: opts.hasNodeModules,
    managersDir: opts.managersDir,
  })
  const results = [...prevResults, newResults]
  await writeYamlFile(resultsFile, results)
  return results
}

function getPMVersion (pmName, opts) {
  const { status, stdout, stderr } = spawn.sync(pmName, ['--version'], {
    cwd: opts.managersDir,
    env: createEnv(opts.managersDir),
  })
  if (status !== 0) {
    throw new Error(`Couldn't detect version of ${pmName}. ${stderr?.toString()}`)
  }
  return stdout.toString()
}

async function safeLoadYamlFile (filename) {
  try {
    return await loadYamlFile(filename)
  } catch (err) {
    if (err.code !== 'ENOENT') throw err
    return null
  }
}
