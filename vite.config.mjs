import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { pnpmDocsPlugin } from '@pnpm/website.docs.docs-builder'
import { DOCS_LOCALES } from '@pnpm/website.docs.docs-model'
import { benchmarkDataPlugin } from './scripts/vite-benchmark-data.mjs'

const root = path.dirname(fileURLToPath(import.meta.url))
const fromRoot = (...segments) => path.join(root, ...segments)

// Latest first. The latest version is edited in docs/ and served without a
// version prefix (/motivation); older ones live in versioned_docs/ and are
// served under their name (/11.x/motivation).
const [latestVersion, ...olderVersions] = JSON.parse(readFileSync(fromRoot('versions.json'), 'utf8'))

// The same shapes the @pnpm/website.docs.versions.* packages export, pointed at
// this repository instead of the copies inside those packages: this repository
// is where the docs are edited, where Crowdin reads its sources from and where
// "Edit this page" links lead.
const versions = [
  {
    name: latestVersion,
    label: latestVersion,
    docsDir: fromRoot('docs'),
    sidebarsPath: fromRoot('sidebars.json'),
    repoPath: 'docs',
  },
  ...olderVersions.map((name) => ({
    name,
    label: name,
    docsDir: fromRoot('versioned_docs', `version-${name}`),
    sidebarsPath: fromRoot('versioned_sidebars', `version-${name}-sidebars.json`),
    repoPath: `versioned_docs/version-${name}`,
  })),
]

const pnprDocs = {
  name: 'pnpr',
  label: 'Registry (pnpr)',
  docsDir: fromRoot('pnpr-docs'),
  sidebarsPath: fromRoot('sidebars-pnpr.json'),
  sidebarId: 'pnpr',
  repoPath: 'pnpr-docs',
  section: {
    pluginId: 'pnpr',
    routeBasePath: 'pnpr',
    homeDocId: 'introduction',
  },
}

// locales.json lists the published locales and the name Crowdin gives each of
// them; the first one is the language of the sources.
const locales = JSON.parse(readFileSync(fromRoot('locales.json'), 'utf8')).map(({ locale, crowdinLanguage }) => ({
  nativeName: locale,
  ...DOCS_LOCALES.find(({ code }) => code === locale),
  code: locale,
  crowdinLanguage,
}))

const blog = {
  postsDir: fromRoot('blog'),
  authorsPath: fromRoot('blog', 'authors.yml'),
  repoPath: 'blog',
}

export default {
  // Everything in static/ is served from the web root, as Docusaurus did:
  // /img/... in the Markdown, /pnpm.js, the old /r/... redirect pages.
  publicDir: 'static',
  resolve: {
    alias: [
      // The homepage with the content of this repository; see src/homepage/index.tsx.
      { find: /^@pnpm\/website\.pages\.homepage$/, replacement: fromRoot('src/homepage/index.tsx') },
    ],
  },
  build: {
    // vercel.json serves this directory.
    outDir: 'build',
  },
  plugins: [
    react(),
    benchmarkDataPlugin(),
    pnpmDocsPlugin({
      versions,
      sections: [pnprDocs],
      blog,
      locales,
      // The layout `crowdin download` used, so crowdin.yaml still describes it.
      i18nDir: fromRoot('i18n'),
    }),
  ],
}
