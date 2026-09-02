// Turns the numbers https://github.com/pnpm/benchmarks publishes into the
// charts served under /img/benchmarks/. Everything a reader sees is decided
// here or in `columns.mjs`; the manifest this reads is only measurements.
//
// The page at /benchmarks no longer uses these charts. They are still drawn
// because the README of https://github.com/pnpm/pnpm embeds
// https://pnpm.io/img/benchmarks/alotta-files.svg.

import generateSvg from './generate-svg.mjs'
import generateStackedSvg from './generate-stacked-svg.mjs'
import {
  packageManagerColumns,
  mainChartBars,
  nodeVersionManagerColumns,
  installScenarios,
  nodeVersionScenarios,
  chartedFixtures,
} from './columns.mjs'

/**
 * Draws every chart, as `{ name, svg }` pairs.
 *
 * Returns the charts rather than writing them: what the files are called and
 * where they go is the caller's.
 */
export default function renderBenchmarkCharts (manifest) {
  assertManifest(manifest)
  const run = { measuredAt: formatMeasuredAt(manifest.measuredAt), nodeVersion: manifest.node }

  const charts = []
  for (const fixture of manifest.fixtures) {
    if (!chartedFixtures.includes(fixture.name)) continue
    charts.push(...fixtureCharts(fixture, run))
  }
  charts.push(nodeVersionsChart(manifest.nodeVersions, run))
  return charts
}

/**
 * The scenarios slowest first, measured by the first column — the reference
 * every other column is read against. `update` is a different kind of action,
 * so it is pinned at the end rather than sorted among the installs.
 */
function orderScenarios (fixture, byKey = packageManagerColumns[0].key) {
  const measured = fixture.packageManagers[byKey].results
  const installs = Object.keys(installScenarios)
    .filter((test) => test !== 'updatedDependencies')
    .sort((a, b) => (measured[b] ?? 0) - (measured[a] ?? 0))
  return [...installs, 'updatedDependencies']
}

function fixtureCharts (fixture, run) {
  const measured = (key) => fixture.packageManagers[key]

  const tests = orderScenarios(fixture)
  const bars = mainChartBars.map((bar) => resolveBar(bar, measured))
  const mainResults = tests.map((test) => bars.map((bar) => (bar.stacked
    ? {
        primary: toSeconds(measured(bar.primaryKey).results[test]),
        secondary: toSeconds(measured(bar.secondaryKey).results[test]),
      }
    : toSeconds(measured(bar.key).results[test]))))
  const mainSvg = generateSvg(
    mainResults,
    bars,
    tests.map((test) => installScenarios[test].label),
    run.measuredAt,
    run.nodeVersion,
  )

  // pnpm against pnpm: the two releases, stacked so the difference is the
  // extra time the older one takes.
  const pnpmTests = orderScenarios(fixture, 'pnpm11')
  const pnpmSvg = generateStackedSvg(
    pnpmTests.map((test) => ({
      label: installScenarios[test].label,
      v11: toSeconds(measured('pnpm11').results[test]),
      v12: toSeconds(measured('pnpm12').results[test]),
    })),
    run.measuredAt,
    run.nodeVersion,
  )

  return [
    { name: fixture.name, svg: mainSvg },
    { name: `${fixture.name}-pnpm`, svg: pnpmSvg },
  ]
}

/** Fills a chart bar in with the colours and the version it is drawn with. */
function resolveBar (bar, measured) {
  const column = (key) => {
    const found = packageManagerColumns.find((candidate) => candidate.key === key)
    if (!found) {
      throw new Error(`The main chart draws ${key}, which is not one of the columns in \`columns.mjs\`.`)
    }
    return found
  }
  if (!bar.stacked) {
    return { ...column(bar.key), key: bar.key, version: measured(bar.key).version }
  }
  const primary = column(bar.primaryKey)
  return {
    ...bar,
    color: primary.color,
    legend: primary.legend,
    displayVersion: primary.displayVersion,
    version: measured(bar.primaryKey).version,
  }
}

function nodeVersionsChart ({ managers }, run) {
  const tests = Object.keys(nodeVersionScenarios)
  const bars = nodeVersionManagerColumns.map((column) => ({ ...column, version: managers[column.key].version }))
  const svg = generateSvg(
    tests.map((test) => bars.map((bar) => toSeconds(managers[bar.key].results[test]))),
    bars,
    tests.map((test) => nodeVersionScenarios[test].label),
    run.measuredAt,
    run.nodeVersion,
  )
  return { name: 'node-versions', svg }
}

/** Charts are drawn in seconds, to one decimal. */
function toSeconds (milliseconds) {
  return Math.round(milliseconds / 100) / 10
}

/**
 * Formatted in UTC rather than in whatever zone the machine drawing the charts
 * happens to sit in, so re-drawing the same manifest twice produces the same
 * bytes.
 */
function formatMeasuredAt (iso) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(new Date(iso))
}

/**
 * The manifest crosses a repository boundary, so what it is missing is worth
 * saying plainly — and worth catching before anything is written rather than
 * after.
 *
 * Every scenario is checked down to the number, not just to the object holding
 * it. A missing or unmeasurable timing is not an error anywhere downstream: it
 * renders as a `NaN`-wide bar, which is an SVG that draws nothing and a chart
 * that publishes a hole. Failing the render is the only way that becomes
 * visible.
 */
function assertManifest (manifest) {
  for (const field of ['measuredAt', 'node', 'fixtures', 'nodeVersions']) {
    if (manifest?.[field] == null) {
      throw new Error(`The benchmark manifest carries no \`${field}\`.`)
    }
  }
  for (const name of chartedFixtures) {
    const fixture = manifest.fixtures.find((candidate) => candidate.name === name)
    if (!fixture) {
      throw new Error(
        `The benchmark manifest has no fixture named ${name}. ` +
        'Either the benchmark stopped measuring it, or the chart outlived the measurement — ' +
        'drop it from `columns.mjs`.'
      )
    }
    for (const { key } of packageManagerColumns) {
      const results = fixture.packageManagers?.[key]?.results
      if (!results) {
        throw new Error(
          `The benchmark manifest has no results for ${key} on the ${name} fixture. ` +
          'Either the benchmark stopped measuring it, or the column outlived the measurement — ' +
          'drop it from `columns.mjs`.'
        )
      }
      assertTimings(results, Object.keys(installScenarios), `${key} on the ${name} fixture`)
    }
  }
  for (const { key } of nodeVersionManagerColumns) {
    const results = manifest.nodeVersions.managers?.[key]?.results
    if (!results) {
      throw new Error(`The benchmark manifest has no Node.js version management results for ${key}.`)
    }
    assertTimings(results, Object.keys(nodeVersionScenarios), `${key} in the Node.js chart`)
  }
}

/** Every scenario the charts draw has to be a duration, and durations are finite and not negative. */
function assertTimings (results, scenarios, subject) {
  for (const scenario of scenarios) {
    const value = results[scenario]
    if (!Number.isFinite(value) || value < 0) {
      throw new Error(
        `The benchmark manifest reports \`${scenario}\` for ${subject} as ${JSON.stringify(value)}, ` +
        'which is not a duration the charts can draw.'
      )
    }
  }
}
