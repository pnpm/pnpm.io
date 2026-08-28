// The contracts the renderer has to hold that reading it doesn't reveal.
//
// Run with `pnpm test`. Node's own test runner, no dependencies — the sync runs
// on a bare Node.js in CI, and a test that needed an install would be testing a
// setup the real thing never has.

import test from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import renderBenchmarksPage from './page.mjs'
import prettyMs from './pretty-ms.mjs'
import {
  packageManagerColumns,
  nodeVersionManagerColumns,
  installScenarios,
  nodeVersionScenarios,
  fixtureHeadings,
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
      name: Object.keys(fixtureHeadings)[0],
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

test('rendering the same manifest twice produces the same bytes', () => {
  // The sync commits what it renders. Anything non-deterministic in here — a
  // date read from the clock, a set iterated in hash order — would show up as a
  // diff every week that no measurement is behind.
  const first = renderBenchmarksPage(manifest())
  const second = renderBenchmarksPage(manifest())
  assert.equal(first.markdown, second.markdown)
  assert.deepEqual(first.charts, second.charts)
})

test('the page is dated from the manifest, not from the clock', () => {
  const { markdown } = renderBenchmarksPage(manifest())
  assert.match(markdown, /\*\*Last benchmarked at\*\*: _Aug 23, 2026/)
})

test("each chart's ?v= hash is the hash of that chart", () => {
  // What keeps a page from pointing at a cached copy of a chart it no longer
  // matches.
  const { markdown, charts } = renderBenchmarksPage(manifest())
  assert.ok(charts.length > 0)
  for (const { name, svg } of charts) {
    const hash = crypto.createHash('sha256').update(svg).digest('hex').slice(0, 8)
    assert.ok(
      markdown.includes(`/img/benchmarks/${name}.svg?v=${hash}`),
      `${name}.svg is not referenced at its own hash`,
    )
  }
})

test('every configured column reaches the page', () => {
  const { markdown } = renderBenchmarksPage(manifest())
  for (const column of packageManagerColumns) {
    assert.ok(markdown.includes(column.mdLegend ?? column.legend), `${column.key} is missing`)
  }
})

test('a manifest missing a column is refused', () => {
  const broken = manifest()
  delete broken.fixtures[0].packageManagers[packageManagerColumns.at(-1).key]
  assert.throws(() => renderBenchmarksPage(broken), /has no results for/)
})

test('a scenario that is not a duration is refused', () => {
  // The failure this exists for is silent: an absent timing formats as `NaN` in
  // a table cell and draws a `NaN`-wide bar, publishing a hole rather than an
  // error.
  for (const value of [undefined, null, NaN, -1, 'fast']) {
    const broken = manifest()
    broken.fixtures[0].packageManagers[packageManagerColumns[0].key]
      .results[Object.keys(installScenarios)[0]] = value
    assert.throws(
      () => renderBenchmarksPage(broken),
      /is not a duration the page can draw/,
      `${JSON.stringify(value)} was accepted as a timing`,
    )
  }
})

test('a Node.js version manager missing a scenario is refused', () => {
  const broken = manifest()
  delete broken.nodeVersions.managers[nodeVersionManagerColumns[0].key]
    .results[Object.keys(nodeVersionScenarios)[0]]
  assert.throws(() => renderBenchmarksPage(broken), /is not a duration the page can draw/)
})

test('durations format the way pretty-ms formatted them', () => {
  // `pretty-ms.mjs` stands in for the dependency the page used to carry, and
  // the numbers it prints are the published result. Truncation is the part
  // worth pinning: 1051ms is a second, not 1.1 seconds.
  assert.equal(prettyMs(15), '15ms')
  assert.equal(prettyMs(964), '964ms')
  assert.equal(prettyMs(1051), '1s')
  assert.equal(prettyMs(2400), '2.4s')
  assert.equal(prettyMs(11547), '11.5s')
  assert.equal(prettyMs(45939), '45.9s')
  assert.equal(prettyMs(60000), '1m')
  assert.equal(prettyMs(62400), '1m 2.4s')
})
