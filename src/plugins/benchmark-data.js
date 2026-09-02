// Fetches the numbers the page at /benchmarks renders, once per build, so the
// page is static HTML like the rest of the site and no visitor asks GitHub for
// anything.
//
// The numbers live in https://github.com/pnpm/benchmarks. Fetching them and
// shaping them for the page is `@pnpm/website.benchmarks.benchmark-data`, the
// package the page component is written against, so what this plugin hands
// over is exactly what the component expects. When GitHub can't be reached —
// an offline build, the API's unauthenticated rate limit — the snapshot bundled
// with that package is rendered instead: a network hiccup then makes the page
// a few weeks stale rather than failing the build.

module.exports = function benchmarkDataPlugin () {
  return {
    name: 'benchmark-data',
    async loadContent () {
      const { fetchBenchmarkData, fallbackBenchmarkData } =
        await import('@pnpm/website.benchmarks.benchmark-data');
      try {
        return await fetchBenchmarkData();
      } catch (err) {
        console.warn(
          `[benchmark-data] Couldn't fetch the benchmark results (${err.message}). ` +
          `Rendering the bundled snapshot from ${fallbackBenchmarkData.generatedAt} instead.`
        );
        return fallbackBenchmarkData;
      }
    },
    async contentLoaded ({ content, actions }) {
      actions.setGlobalData(content);
    },
  };
};
