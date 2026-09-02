import React, { useEffect } from "react";
import Layout from "@theme/Layout";
import { usePluginData } from "@docusaurus/useGlobalData";
import { PnpmTheme, useThemeController } from "@pnpm/design.pnpm-theme";
import { BenchmarksPage } from "@pnpm/website.pages.benchmarks-page";
import { useDocusaurusTheme, getThemeMode } from "../utils/use-docusaurus-theme";

const TITLE = "Benchmarks of JavaScript Package Managers";
const DESCRIPTION =
  "How fast pnpm installs a project compared to npm, and how fast it installs Node.js compared to fnm and nvm.";

function ThemedBenchmarksPage() {
  // Fetched at build time by `src/plugins/benchmark-data.js`.
  const data = usePluginData("benchmark-data");
  const themeMode = useDocusaurusTheme();
  const { setThemeMode } = useThemeController();

  useEffect(() => {
    setThemeMode(themeMode);
  }, [themeMode]);

  return <BenchmarksPage data={data} />;
}

function Benchmarks() {
  const themeMode = getThemeMode();

  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <PnpmTheme initialTheme={themeMode}>
        <ThemedBenchmarksPage />
      </PnpmTheme>
    </Layout>
  );
}

export default Benchmarks;
