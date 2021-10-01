'use strict'
import benchmark from './benchmarkFixture.js'
import path from 'path'
import writeYamlFile from 'write-yaml-file'
import loadYamlFile from 'load-yaml-file'
import { fileURLToPath } from 'url'
import loadJsonFile from 'load-json-file'

const DIRNAME = path.dirname(fileURLToPath(import.meta.url))
const RESULTS = path.join(DIRNAME, 'results')

export default async function (pm, fixture, opts) {
  opts = opts || {}
  const limitRuns = opts.limitRuns || Infinity

  const { version: pmVersion } = await loadJsonFile(path.join(opts.managersDir, 'node_modules', pm.name, 'package.json'))
  const resultsFile = path.join(RESULTS, pm.scenario, pmVersion, `${fixture}.yaml`)
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

async function safeLoadYamlFile (filename) {
  try {
    return await loadYamlFile(filename)
  } catch (err) {
    if (err.code !== 'ENOENT') throw err
    return null
  }
}
