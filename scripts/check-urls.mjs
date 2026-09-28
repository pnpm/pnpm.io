// Checks that the built site in build/ still serves every URL of the site it
// replaces, either as a file or through a redirect or rewrite of vercel.json.
//
//   node scripts/check-urls.mjs
//       Checks the URLs of scripts/docusaurus-urls.txt, the pages of the
//       Docusaurus site, in every locale of locales.json.
//   node scripts/check-urls.mjs https://pnpm.io/sitemap.xml https://pnpm.io/zh/sitemap.xml
//       Checks the URLs listed by these sitemaps (URLs or local files).
//
// Exits with 1 and lists the URLs that are missing.

import { existsSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { pathToRegexp } from 'path-to-regexp'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = path.join(ROOT, 'build')

if (!existsSync(path.join(OUT_DIR, 'index.html'))) {
  console.error('There is no site in build/ to check. Run `pnpm build` first.')
  process.exit(1)
}

const sitemaps = process.argv.slice(2)
const urls = sitemaps.length > 0 ? await urlsFromSitemaps(sitemaps) : urlsFromSnapshot()

const vercel = JSON.parse(readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'))
const routing = [...vercel.redirects, ...vercel.rewrites].map(({ source }) => ({ source, regexp: pathToRegexp(source) }))

const missing = []
let redirected = 0
for (const url of urls) {
  if (isBuilt(url)) continue
  if (routing.some(({ regexp }) => regexp.test(url))) {
    redirected++
    continue
  }
  missing.push(url)
}

console.log(`Checked ${urls.length} URLs: ${urls.length - redirected - missing.length} served from build/, ${redirected} redirected or rewritten by vercel.json.`)
if (missing.length > 0) {
  console.error(`\n${missing.length} URLs are missing:\n${missing.map((url) => `  ${url}`).join('\n')}`)
  process.exit(1)
}

function urlsFromSnapshot () {
  const locales = JSON.parse(readFileSync(path.join(ROOT, 'locales.json'), 'utf8')).map(({ locale }) => locale)
  const paths = readFileSync(path.join(ROOT, 'scripts/docusaurus-urls.txt'), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
  // The first locale is the default one, served without a prefix.
  return locales.flatMap((locale, i) => paths.map((url) => (i === 0 ? url : `/${locale}${url === '/' ? '' : url}`)))
}

async function urlsFromSitemaps (sources) {
  const urls = []
  for (const source of sources) {
    const xml = /^https?:/.test(source) ? await (await fetch(source)).text() : readFileSync(source, 'utf8')
    for (const [, loc] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.push(new URL(loc).pathname)
  }
  return urls
}

function isBuilt (url) {
  const file = path.join(OUT_DIR, decodeURIComponent(url))
  if (!file.startsWith(OUT_DIR)) return false
  if (existsSync(path.join(file, 'index.html'))) return true
  return existsSync(file) && statSync(file).isFile()
}
