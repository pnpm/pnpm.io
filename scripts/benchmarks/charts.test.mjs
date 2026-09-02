// The contracts the chart renderer has to hold that reading it doesn't reveal.
//
// Run with `pnpm test`. Node's own test runner, no dependencies — the sync runs
// on a bare Node.js in CI, and a test that needed an install would be testing a
// setup the real thing never has.

import test from 'node:test'
import assert from 'node:assert/strict'
import renderBenchmarkCharts from './charts.mjs'
import {
  packageManagerColumns,
  mainChartBars,
  nodeVersionManagerColumns,
  installScenarios,
  nodeVersionScenarios,
  chartedFixtures,
} from './columns.mjs'

/**
 * A manifest shaped like the one pnpm/benchmarks publishes, built from the
 * columns actually configured — so adding a column can't leave the tests
 * exercising a shape the renderer no longer sees.
 */
function manifest () {
  const timings = (scenarios) => Object.fromEntries(
    Object.keys(scenarios).map((scenario, i) => [scenario, (i + 1) * 1000]),
  )
  return {
    measuredAt: '2026-08-23T03:38:00.000Z',
    node: 'v24.19.0',
    pnpr: '0.1.0-alpha.7',
    network: { roundTripMs: 50, bandwidthMbps: 200 },
    fixtures: [{
      name: chartedFixtures[0],
      packageManagers: Object.fromEntries(packageManagerColumns.map(({ key }, i) => [
        key,
        { version: `1.2.${i}`, results: timings(installScenarios) },
      ])),
    }],
    nodeVersions: {
      primary: '24',
      secondary: '22',
      managers: Object.fromEntries(nodeVersionManagerColumns.map(({ key }, i) => [
        key,
        { version: `3.4.${i}`, results: timings(nodeVersionScenarios) },
      ])),
    },
  }
}

test('drawing the same manifest twice produces the same bytes', () => {
  // The sync commits what it draws. Anything non-deterministic in here — a
  // date read from the clock, a set iterated in hash order — would show up as a
  // diff every week that no measurement is behind.
  assert.deepEqual(renderBenchmarkCharts(manifest()), renderBenchmarkCharts(manifest()))
})

test('the charts are dated from the manifest, not from the clock', () => {
  for (const { name, svg } of renderBenchmarkCharts(manifest())) {
    assert.match(svg, /Aug 23, 2026/, `${name}.svg is not dated from the manifest`)
  }
})

test('the charts the README embeds are still drawn', () => {
  // https://github.com/pnpm/pnpm/blob/main/README.md shows
  // https://pnpm.io/img/benchmarks/alotta-files.svg. Renaming that chart would
  // break the README without any failure here.
  const names = renderBenchmarkCharts(manifest()).map(({ name }) => name)
  assert.ok(names.includes('alotta-files'), `alotta-files.svg is not drawn; drawn: ${names.join(', ')}`)
})

test('every configured bar reaches its chart', () => {
  const charts = new Map(renderBenchmarkCharts(manifest()).map(({ name, svg }) => [name, svg]))
  const main = charts.get(chartedFixtures[0])
  for (const bar of mainChartBars) {
    const column = packageManagerColumns.find(({ key }) => key === (bar.primaryKey ?? bar.key))
    assert.ok(main.includes(column.legend), `${column.key} is missing from the main chart`)
  }
  const node = charts.get('node-versions')
  for (const column of nodeVersionManagerColumns) {
    assert.ok(node.includes(column.legend), `${column.key} is missing from the Node.js chart`)
  }
})

test('a manifest missing a column is refused', () => {
  const broken = manifest()
  delete broken.fixtures[0].packageManagers[packageManagerColumns.at(-1).key]
  assert.throws(() => renderBenchmarkCharts(broken), /has no results for/)
})

test('a manifest missing a charted fixture is refused', () => {
  const broken = manifest()
  broken.fixtures[0].name = 'something-else'
  assert.throws(() => renderBenchmarkCharts(broken), /has no fixture named/)
})

test('a scenario that is not a duration is refused', () => {
  // The failure this exists for is silent: an absent timing draws a `NaN`-wide
  // bar, publishing a hole rather than an error.
  for (const value of [undefined, null, NaN, -1, 'fast']) {
    const broken = manifest()
    broken.fixtures[0].packageManagers[packageManagerColumns[0].key]
      .results[Object.keys(installScenarios)[0]] = value
    assert.throws(
      () => renderBenchmarkCharts(broken),
      /is not a duration the charts can draw/,
      `${JSON.stringify(value)} was accepted as a timing`,
    )
  }
})

test('a Node.js version manager missing a scenario is refused', () => {
  const broken = manifest()
  delete broken.nodeVersions.managers[nodeVersionManagerColumns[0].key]
    .results[Object.keys(nodeVersionScenarios)[0]]
  assert.throws(() => renderBenchmarkCharts(broken), /is not a duration the charts can draw/)
})
