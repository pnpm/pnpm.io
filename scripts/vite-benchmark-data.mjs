// The numbers behind /benchmarks, fetched once per build so the page is static
// and no visitor asks GitHub for anything.
//
// The benchmarks page of @pnpm/website.pnpm-website renders the snapshot that
// @pnpm/website.benchmarks.benchmark-data bundles, a few weeks old at best. This
// plugin swaps that snapshot for the latest results of pnpm/benchmarks while
// building. A failed fetch (an offline build, the API's unauthenticated rate
// limit) keeps the bundled snapshot, so a network hiccup makes the page a bit
// stale instead of failing the build. Set GITHUB_TOKEN to raise the rate limit.

import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fetchBenchmarkData } from '@pnpm/website.benchmarks.benchmark-data'

// Also read by scripts/postbuild.mjs, which pre-renders /benchmarks with the
// same numbers the app shows.
export const BENCHMARK_DATA_CACHE = path.resolve('node_modules/.cache/pnpm-benchmark-data.json')

const SNAPSHOT_MODULE = /[\\/]website\.benchmarks\.benchmark-data[\\/]dist[\\/]fallback-benchmark-data\.js$/

export function benchmarkDataPlugin () {
  let data
  return {
    name: 'pnpm-benchmark-data',
    apply: 'build',
    async buildStart () {
      try {
        data = await fetchBenchmarkData()
        mkdirSync(path.dirname(BENCHMARK_DATA_CACHE), { recursive: true })
        writeFileSync(BENCHMARK_DATA_CACHE, JSON.stringify(data))
        console.log(`[benchmark-data] using the results generated at ${data.generatedAt}`)
      } catch (err) {
        rmSync(BENCHMARK_DATA_CACHE, { force: true })
        console.warn(`[benchmark-data] Couldn't fetch the benchmark results (${err.message}). Rendering the bundled snapshot instead.`)
      }
    },
    load (id) {
      if (data == null || !SNAPSHOT_MODULE.test(id)) return null
      return `export const fallbackBenchmarkData = ${JSON.stringify(data)};\n`
    },
  }
}
