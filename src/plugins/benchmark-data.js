// The numbers behind /benchmarks, fetched once per build so the page is static
// HTML and no visitor asks GitHub for anything. A failed fetch — an offline
// build, the API's unauthenticated rate limit — renders the snapshot bundled
// with the data package, so a network hiccup makes the page a few weeks stale
// rather than failing the build.

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
