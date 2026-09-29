// Checks that the built site in build/ still serves every URL of the site it
// replaces, either as a file or through a redirect or rewrite of vercel.json
// that leads to one. Redirects are applied the way Vercel applies them: the
// first one that matches wins, even over a file of the same path.
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
import { compile, match } from 'path-to-regexp'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = path.join(ROOT, 'build')

if (!existsSync(path.join(OUT_DIR, 'index.html'))) {
  console.error('There is no site in build/ to check. Run `pnpm build` first.')
  process.exit(1)
}

const sitemaps = process.argv.slice(2)
const urls = sitemaps.length > 0 ? await urlsFromSitemaps(sitemaps) : urlsFromSnapshot()

const vercel = JSON.parse(readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'))
const redirects = vercel.redirects.map(rule)
const rewrites = vercel.rewrites.map(rule)

const missing = []
let redirected = 0
for (const url of urls) {
  const served = serve(url)
  if (served === 'missing') missing.push(url)
  else if (served === 'routed') redirected++
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

function rule ({ source, destination }) {
  return { matches: match(source, { decode: decodeURIComponent }), destination }
}

// Whether a URL is served from a file, reaches one through vercel.json
// ('routed'), or neither. A redirect to another site counts as served.
function serve (url, hops = 0) {
  if (hops > 10) return 'missing'
  const target = applyRule(redirects, url) ?? (isBuilt(url) ? undefined : applyRule(rewrites, url))
  if (target === undefined) return isBuilt(url) ? 'file' : 'missing'
  if (/^https?:/.test(target)) return 'routed'
  return serve(target, hops + 1) === 'missing' ? 'missing' : 'routed'
}

function applyRule (rules, url) {
  for (const { matches, destination } of rules) {
    const result = matches(url)
    if (!result) continue
    if (/^https?:/.test(destination)) return destination
    return compile(destination, { encode: encodeURIComponent })(result.params) || '/'
  }
  return undefined
}

function isBuilt (url) {
  const file = path.join(OUT_DIR, decodeURIComponent(url))
  if (!file.startsWith(OUT_DIR)) return false
  if (existsSync(path.join(file, 'index.html'))) return true
  return existsSync(file) && statSync(file).isFile()
}
