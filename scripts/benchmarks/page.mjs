// Turns the numbers https://github.com/pnpm/benchmarks publishes into the page
// at /benchmarks and the charts it carries. Everything a reader sees is decided
// here or in `columns.mjs`; the manifest this reads is only measurements.

import crypto from 'node:crypto'
import generateSvg from './generate-svg.mjs'
import generateStackedSvg from './generate-stacked-svg.mjs'
import prettyMs from './pretty-ms.mjs'
import {
  packageManagerColumns,
  mainChartBars,
  nodeVersionManagerColumns,
  installScenarios,
  nodeVersionScenarios,
  fixtureHeadings,
} from './columns.mjs'

/**
 * Renders the page and its charts.
 *
 * Returns the markdown and every chart it refers to, rather than writing
 * anything: what the files are called and where they go is the caller's.
 */
export default function renderBenchmarksPage (manifest) {
  assertManifest(manifest)
  const measuredAt = formatMeasuredAt(manifest.measuredAt)
  const chart = chartWriter(measuredAt, manifest.node)

  const sections = []
  for (const fixture of manifest.fixtures) {
    sections.push(...fixtureSections(fixture, chart))
  }
  sections.push(nodeVersionsSection(manifest.nodeVersions, chart))

  const markdown = [
    introduction(manifest, measuredAt),
    scenarioKey(manifest.fixtures[0]),
    ...sections,
  ].join('\n\n') + '\n'

  return { markdown, charts: chart.written }
}

/**
 * Collects the charts as they are drawn and hands back the `?v=` URL for each.
 *
 * The hash is of the chart's own bytes, so a page and the chart it points at
 * can never disagree: redraw the chart and the URL in the markdown moves with
 * it, which is what stops a browser (or a CDN) serving last week's picture
 * under this week's page.
 */
function chartWriter (measuredAt, nodeVersion) {
  const written = []
  return {
    written,
    measuredAt,
    nodeVersion,
    add (name, svg) {
      written.push({ name, svg })
      const hash = crypto.createHash('sha256').update(svg).digest('hex').slice(0, 8)
      return `/img/benchmarks/${name}.svg?v=${hash}`
    },
  }
}

function introduction (manifest, measuredAt) {
  const { roundTripMs, bandwidthMbps } = manifest.network
  return `# Benchmarks of JavaScript Package Managers

**Last benchmarked at**: _${measuredAt}_ (_weekly_ updated).

This benchmark compares the performance of npm and pnpm. Every package manager installs through the same [pnpr](/pnpr) registry (v${manifest.pnpr}) across an emulated ${roundTripMs}ms round trip at ${bandwidthMbps} Mbit/s, so they all face one registry over one reproducible network instead of whatever link the benchmark machine happens to have. pnpm 12 is measured twice: once on its own, and once resolving its dependency graph [on the server](/pnpr/install-acceleration) instead of walking it itself. The page also compares how fast pnpm, fnm, and nvm install and switch Node.js versions.

About the setup:

- **Every manager crosses the same link.** The round trip is applied to all of them, and to pnpm's resolution requests as well, so no client gets a cheaper connection than another. The bandwidth cap is the link's, shared across all of a manager's connections — opening more connections in parallel spreads the latency, as on a real network, but cannot multiply the ${bandwidthMbps} Mbit/s.
- **pnpr's cache is warmed before anything is timed** — with the fixture's dependency graph and with the one the update row installs — so no manager pays to pull either into the registry on behalf of the ones measured after it.
- **Server-side resolution pays off when there is a graph to resolve.** Resolving one means walking it level by level, and each level costs a round trip, so the cost is roughly the depth of the graph times the latency. pnpr does that walk next to the registry — its own metadata access stays on loopback, the co-located shape the [pnpm monorepo's integrated benchmark](https://github.com/pnpm/pnpm) measures — and answers with the whole resolved lockfile at once, which is why the rows without a lockfile, and the row that changes dependencies, are the ones where it pulls ahead of plain pnpm.
- **The lockfile is trusted, so both managers are asked for the same work.** pnpm verifies a lockfile against the registry before installing it — a supply-chain pass that costs a packument per package, and one npm doesn't perform. The rows with a lockfile run every pnpm column with [\`trustLockfile\`](/settings#trustlockfile), so what they compare is the install rather than a safety check only one participant was asked for. It is on by default outside this benchmark, and pnpm's own resolution still applies its release-age policy on the rows that resolve.
- **With an up-to-date lockfile there is nothing to resolve.** pnpm doesn't ask the server then, so those rows measure the same install in both pnpm 12 columns.
- **The update row starts from a warm cache.** The rows before it delete the cache twice, and how much of it a manager has rebuilt by the time update runs is an accident of row ordering — restoring a warm \`node_modules\` without touching the registry leaves the cache cold, while re-downloading the whole graph on the same row refills it. A developer who bumps versions has the cache their installs left, so before the update is timed, every manager re-fetches the base graph once, untimed.
- Tarballs are still fetched by the client, in parallel and directly, on every row.`
}

/**
 * The lines under the table that map each scenario onto something a reader
 * does, in the order the table puts the rows in.
 */
function scenarioKey (fixture) {
  const items = orderScenarios(fixture)
    .map((test) => `- ${installScenarios[test].explanation}`)
    .join('\n')
  return `Each row's label lists which of \`cache\`, \`trusted lockfile\`, and \`node_modules\` are warm/present before install runs. Quick mapping to the real world (ordered from slowest to fastest scenario):

${items}`
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

function fixtureSections (fixture, chart) {
  const heading = fixtureHeadings[fixture.name]
  if (!heading) {
    throw new Error(
      `The manifest carries a fixture named ${fixture.name}, which \`columns.mjs\` has no heading for. ` +
      'Add one there, or the page would introduce it with nothing.'
    )
  }
  const tests = orderScenarios(fixture)
  const measured = (key) => fixture.packageManagers[key]

  const mainTable = installTable(packageManagerColumns, tests, measured)
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
    chart.measuredAt,
    chart.nodeVersion,
  )
  const mainSrc = chart.add(fixture.name, mainSvg)

  // pnpm against pnpm. Only the two releases belong here: `pnpm_pnpr` is the
  // same pnpm as one of them, and putting it in this table would compare a
  // registry feature against a release.
  const pnpmColumns = packageManagerColumns.filter(({ key }) => key === 'pnpm11' || key === 'pnpm12')
  const pnpmTests = orderScenarios(fixture, 'pnpm11')
  const pnpmTable = installTable(pnpmColumns, pnpmTests, measured)
  const pnpmSvg = generateStackedSvg(
    pnpmTests.map((test) => ({
      label: installScenarios[test].label,
      v11: toSeconds(measured('pnpm11').results[test]),
      v12: toSeconds(measured('pnpm12').results[test]),
    })),
    chart.measuredAt,
    chart.nodeVersion,
  )
  const pnpmSrc = chart.add(`${fixture.name}-pnpm`, pnpmSvg)

  return [
    `## ${heading.title}

${heading.intro}

${mainTable}

<img alt="Graph of the ${fixture.name} results" src="${mainSrc}" />`,
    `### ${pnpmColumns.map((column) => column.legend).join(' vs ')}

pnpm v12 will use a new installation engine for fetching and linking written in Rust. See [pacquet](https://github.com/pnpm/pacquet).

${pnpmTable}

<img alt="Graph comparing pnpm versions on the ${fixture.name} fixture" src="${pnpmSrc}" />`,
  ]
}

function installTable (columns, tests, measured) {
  const legends = columns.map((column) => column.mdLegend ?? column.legend).join(' | ')
  const separator = columns.map(() => '---').join(' | ')
  const rows = tests.map((test) => {
    const { action, cache, lockfile, nodeModules } = installScenarios[test]
    const values = columns.map((column) => prettyMs(measured(column.key).results[test])).join(' | ')
    return `| ${action} | ${cache} | ${lockfile} | ${nodeModules} | ${values} |`
  }).join('\n')
  return `| action  | cache | trusted lockfile | node_modules| ${legends} |
| ---     | ---   | ---      | ---         | ${separator} |
${rows}`
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

function nodeVersionsSection (nodeVersions, chart) {
  const { managers } = nodeVersions
  const columns = nodeVersionManagerColumns
  const legends = columns.map((column) => column.mdLegend ?? column.legend).join(' | ')
  const separator = columns.map(() => '---').join(' | ')
  const rows = Object.entries(nodeVersionScenarios).map(([test, scenario]) => {
    const values = columns.map((column) => prettyMs(managers[column.key].results[test])).join(' | ')
    return `| ${scenario.describe(nodeVersions)} | ${values} |`
  }).join('\n')

  const charted = Object.entries(nodeVersionScenarios).filter(([, scenario]) => scenario.chartLabel)
  const bars = columns.map((column) => ({ ...column, version: managers[column.key].version }))
  const svg = generateSvg(
    charted.map(([test]) => bars.map((bar) => toSeconds(managers[bar.key].results[test]))),
    bars,
    charted.map(([, scenario]) => scenario.chartLabel),
    chart.measuredAt,
    chart.nodeVersion,
  )
  const src = chart.add('node-versions', svg)

  return `## Node.js Version Management

pnpm installs and switches Node.js versions itself, so a separate version manager is not needed. This section compares [\`pnpm runtime set node\`](/cli/runtime) with fnm and nvm.

| scenario | ${legends} |
| ---      | ${separator} |
${rows}

<img alt="Graph comparing Node.js version managers on installing Node.js" src="${src}" />

A few things to keep in mind when reading these numbers:

- pnpm keeps Node.js in its content-addressable store and nvm keeps the downloaded tarballs in \`$NVM_DIR/.cache\`, so for both of them installing a version that was installed before needs no download. fnm has no download cache and fetches Node.js again.
- pnpm doesn't extract the \`npm\`, \`npx\`, and \`corepack\` binaries bundled with Node.js, so on a clean install it downloads and writes fewer files than the other two.
- Per-project switching costs no command at all in pnpm: the \`node\` on your PATH is a shim that reads the [\`devEngines.runtime\`](/package_json#devenginesruntime) of the project and runs the matching version. fnm and nvm read a \`.node-version\` or \`.nvmrc\` file through a shell hook that fires on \`cd\`, which is what \`fnm exec\` and \`nvm use\` measure in that row. Loading nvm into the shell in the first place is not counted at all here, and it costs more than everything in that row.
- All three have to materialize the pinned version the first time a project asks for it: pnpm links it from its store, fnm downloads it, nvm unpacks it. The row measures the repeated runs after that.`
}

/** Charts are drawn in seconds, to one decimal. */
function toSeconds (milliseconds) {
  return Math.round(milliseconds / 100) / 10
}

/**
 * Formatted in UTC rather than in whatever zone the machine rendering the page
 * happens to sit in, so re-rendering the same manifest twice produces the same
 * page.
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
 * formats as `NaN` in a table cell and renders as a `NaN`-wide bar, which is an
 * SVG that draws nothing and a page that publishes a hole. Failing the render
 * is the only way that becomes visible.
 */
function assertManifest (manifest) {
  for (const field of ['measuredAt', 'node', 'pnpr', 'network', 'fixtures', 'nodeVersions']) {
    if (manifest?.[field] == null) {
      throw new Error(`The benchmark manifest carries no \`${field}\`.`)
    }
  }
  for (const fixture of manifest.fixtures) {
    for (const { key } of packageManagerColumns) {
      const results = fixture.packageManagers?.[key]?.results
      if (!results) {
        throw new Error(
          `The benchmark manifest has no results for ${key} on the ${fixture.name} fixture. ` +
          'Either the benchmark stopped measuring it, or the column outlived the measurement — ' +
          'drop it from `columns.mjs`.'
        )
      }
      assertTimings(results, Object.keys(installScenarios), `${key} on the ${fixture.name} fixture`)
    }
  }
  for (const { key } of nodeVersionManagerColumns) {
    const results = manifest.nodeVersions.managers?.[key]?.results
    if (!results) {
      throw new Error(`The benchmark manifest has no Node.js version management results for ${key}.`)
    }
    assertTimings(results, Object.keys(nodeVersionScenarios), `${key} in the Node.js section`)
  }
}

/** Every scenario the page draws has to be a duration, and durations are finite and not negative. */
function assertTimings (results, scenarios, subject) {
  for (const scenario of scenarios) {
    const value = results[scenario]
    if (!Number.isFinite(value) || value < 0) {
      throw new Error(
        `The benchmark manifest reports \`${scenario}\` for ${subject} as ${JSON.stringify(value)}, ` +
        'which is not a duration the page can draw.'
      )
    }
  }
}
