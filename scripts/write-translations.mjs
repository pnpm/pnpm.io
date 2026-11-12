// Writes the English strings of the site chrome to i18n/en/, where crowdin.yaml
// uploads them from: the navbar, the footer, the homepage, the sidebar
// categories of every docs version, and the theme strings the docs, the blog
// and the search read. Docusaurus' `write-translations` used to write these
// files; the keys and the layout are the ones it used, so the translations
// already on Crowdin still apply, and they are where the build reads the
// translations from (see readSiteMessages and DocsSite in
// @pnpm/website.docs.docs-builder).
//
// The pnpr docs are not translated, so their sidebar is left out.

import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { buildSidebar } from '@pnpm/website.docs.docs-builder'
import { readDocsVersions } from './docs-sources.mjs'

// Strings the site reads from code.json, with their English text. The keys are
// Docusaurus' theme keys.
const THEME_MESSAGES = {
  'theme.navbar.mobileLanguageDropdown.label': 'Languages',
  'theme.CodeBlock.copy': 'Copy',
  'theme.CodeBlock.copied': 'Copied',
  'theme.CodeBlock.copyButtonAriaLabel': 'Copy code to clipboard',
  'theme.admonition.note': 'note',
  'theme.admonition.tip': 'tip',
  'theme.admonition.info': 'info',
  'theme.admonition.important': 'important',
  'theme.admonition.caution': 'caution',
  'theme.admonition.warning': 'warning',
  'theme.admonition.danger': 'danger',
  'theme.blog.post.readingTime.plurals': 'One min read|{readingTime} min read',
  'theme.blog.post.readMore': 'Read more',
  'theme.blog.paginator.newerEntries': 'Newer entries',
  'theme.blog.paginator.olderEntries': 'Older entries',
  'theme.blog.post.paginator.newerPost': 'Newer post',
  'theme.blog.post.paginator.olderPost': 'Older post',
  'theme.tags.tagsPageTitle': 'Tags',
  'theme.tags.tagsListLabel': 'Tags:',
  'theme.blog.archive.title': 'Archive',
  'theme.SearchBar.label': 'Search',
  'theme.SearchModal.placeholder': 'Search docs',
  'theme.SearchModal.searchBox.resetButtonTitle': 'Clear the query',
  'theme.SearchModal.searchBox.cancelButtonText': 'Cancel',
  'theme.SearchModal.startScreen.recentSearchesTitle': 'Recent',
  'theme.SearchModal.startScreen.noRecentSearchesText': 'No recent searches',
  'theme.SearchModal.startScreen.saveRecentSearchButtonTitle': 'Save this search',
  'theme.SearchModal.startScreen.removeRecentSearchButtonTitle': 'Remove this search from history',
  'theme.SearchModal.startScreen.favoriteSearchesTitle': 'Favorite',
  'theme.SearchModal.startScreen.removeFavoriteSearchButtonTitle': 'Remove this search from favorites',
  'theme.SearchModal.errorScreen.titleText': 'Unable to fetch results',
  'theme.SearchModal.errorScreen.helpText': 'You might want to check your network connection.',
  'theme.SearchModal.footer.selectText': 'to select',
  'theme.SearchModal.footer.selectKeyAriaLabel': 'Enter key',
  'theme.SearchModal.footer.navigateText': 'to navigate',
  'theme.SearchModal.footer.navigateUpKeyAriaLabel': 'Arrow up',
  'theme.SearchModal.footer.navigateDownKeyAriaLabel': 'Arrow down',
  'theme.SearchModal.footer.closeText': 'to close',
  'theme.SearchModal.footer.closeKeyAriaLabel': 'Escape key',
  'theme.SearchModal.footer.searchByText': 'Search by',
  'theme.SearchModal.noResultsScreen.noResultsText': 'No results for',
  'theme.SearchModal.noResultsScreen.suggestedQueryText': 'Try searching for',
  'theme.SearchModal.noResultsScreen.reportMissingResultsText': 'Believe this query should return results?',
  'theme.SearchModal.noResultsScreen.reportMissingResultsLinkText': 'Let us know.',
}

const BLOG_OPTIONS = {
  title: 'Blog',
  'sidebar.title': 'All posts',
}

/** Calls `fn` with a translate function and collects the keys and English texts it is asked for. */
function record (fn) {
  const messages = {}
  fn((group, key, fallback) => {
    messages[group] ??= {}
    // The first label asked for a key wins: the language menu asks for the
    // footer's "Help Us Translate" with a different casing.
    messages[group][key] ??= fallback
    return fallback
  })
  return messages
}

/** The navbar and footer labels, collected by building the navigation of every part of the site. */
async function navigationMessages () {
  const navigation = await import('@pnpm/website.pnpm-website/dist/site-navigation.js')
  const messages = record((translate) => {
    for (const pathname of ['/', '/motivation', '/pnpr/introduction', '/blog', '/benchmarks']) {
      navigation.headerLinks('en', translate, pathname)
    }
    navigation.sponsorAction(translate)
    navigation.footerSections('en', translate)
    navigation.languageMenu('/', 'en', [], translate)
  })
  if (!messages.navbar || !messages.footer) throw new Error('Found no navbar or footer labels in @pnpm/website.pnpm-website')
  return messages
}

/** The keys of code.json that the search asks for, which all need an English text in THEME_MESSAGES. */
async function checkSearchKeys (site) {
  const websiteDir = path.dirname(createRequire(path.join(site, 'package.json')).resolve('@pnpm/website.pnpm-website/package.json'))
  const searchDir = path.dirname(createRequire(path.join(websiteDir, 'package.json')).resolve('@pnpm/website.ui.docs-search/package.json'))
  const { searchTranslations } = await import(pathToFileURL(path.join(searchDir, 'dist', 'search-translations.js')).href)
  const keys = []
  searchTranslations((key) => { keys.push(key) })
  const missing = keys.filter((key) => !(key in THEME_MESSAGES))
  if (missing.length > 0) throw new Error(`No English text for the search strings: ${missing.join(', ')}`)
}

/**
 * The homepage strings: the texts passed to `t()` in src/homepage/content.tsx,
 * which are their own keys, as with Docusaurus' <Translate>.
 */
function homepageMessages (site) {
  const source = readFileSync(path.join(site, 'src', 'homepage', 'content.tsx'), 'utf8')
  const texts = [...source.matchAll(/\bt\('((?:[^'\\]|\\.)*)'\)/g)].map(([, text]) => text.replace(/\\(.)/g, '$1'))
  if (texts.length === 0) throw new Error('Found no homepage strings in src/homepage/content.tsx')
  return Object.fromEntries(texts.map((text) => [text, text]))
}

/** The sidebar category labels of a docs version. */
function sidebarMessages (sidebarsPath) {
  const messages = {}
  buildSidebar(JSON.parse(readFileSync(sidebarsPath, 'utf8')), {
    docLabel: () => '',
    translate: (key, fallback) => {
      messages[key] = fallback
      return fallback
    },
  })
  return messages
}

function writeMessages (file, messages) {
  mkdirSync(path.dirname(file), { recursive: true })
  const json = Object.fromEntries(Object.entries(messages).map(([key, message]) => [key, { message }]))
  writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`)
}

export async function writeTranslations (site) {
  const target = path.join(site, 'i18n', 'en')
  const navigation = await navigationMessages()
  await checkSearchKeys(site)
  const files = {
    'code.json': { ...THEME_MESSAGES, ...homepageMessages(site) },
    'docusaurus-theme-classic/navbar.json': navigation.navbar,
    'docusaurus-theme-classic/footer.json': navigation.footer,
    'docusaurus-plugin-content-blog/options.json': BLOG_OPTIONS,
  }
  const [latest, ...older] = readDocsVersions(site)
  // The latest version is translated from both docs/ and its versioned copy (see copy-docs.mjs).
  const latestSidebar = sidebarMessages(path.join(site, 'sidebars.json'))
  files['docusaurus-plugin-content-docs/current.json'] = latestSidebar
  files[`docusaurus-plugin-content-docs/version-${latest}.json`] = latestSidebar
  for (const version of older) {
    files[`docusaurus-plugin-content-docs/version-${version}.json`] = sidebarMessages(path.join(site, 'versioned_sidebars', `version-${version}-sidebars.json`))
  }
  rmSync(target, { recursive: true, force: true })
  for (const [file, messages] of Object.entries(files)) {
    writeMessages(path.join(target, file), messages)
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await writeTranslations(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'))
}
