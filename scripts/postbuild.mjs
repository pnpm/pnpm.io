// Finishes the static site that `vite build` leaves in build/.
//
// The docs plugin (@pnpm/website.docs.docs-builder) pre-renders every docs page
// and blog post as its own HTML file. This script covers the rest of what the
// Docusaurus build used to produce:
//
// - HTML files for the homepage and /benchmarks of every locale, with their
//   content rendered on the server, and a 404 page;
// - absolute canonical and hreflang links on every page;
// - the `docsearch:*` meta tags and the <article> element that the Algolia
//   crawler behind the search box reads (see the Docusaurus template of the
//   DocSearch crawler);
// - a description taken from the first paragraph of pages without one;
// - sitemap.xml for every locale, and the blog's RSS and Atom feeds.

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { build as viteBuild } from 'vite'
import react from '@vitejs/plugin-react'
import { fallbackBenchmarkData } from '@pnpm/website.benchmarks.benchmark-data'
import { localizePath, parseBlogPath, parseDocsPath } from '@pnpm/website.docs.docs-model'
import { BENCHMARK_DATA_CACHE } from './vite-benchmark-data.mjs'

const SITE_URL = 'https://pnpm.io'
const OUT_DIR = path.resolve('build')
const SSR_DIR = path.resolve('node_modules/.cache/pnpm-prerender')
const DEFAULT_DESCRIPTION = 'Fast, disk space efficient package manager'
// Entries in the feeds, as many as Docusaurus put there.
const FEED_SIZE = 20

const manifest = readJson(path.join(OUT_DIR, 'docs-data/manifest.json'))
const locales = manifest.locales.map(({ code }) => code)
const template = readFileSync(path.join(OUT_DIR, 'index.html'), 'utf8')
if (template.includes('rel="canonical"')) {
  throw new Error('build/ has been post-processed already; run `pnpm build` to build the site again.')
}

await prerenderAppPages()
const routes = listRoutes()
for (const route of routes) {
  const file = htmlFile(route)
  writeFileSync(file, finishHead(route, readFileSync(file, 'utf8')))
}
writeSitemaps(routes)
writeFeeds()
console.log(`[postbuild] finished ${routes.length} pages`)

async function prerenderAppPages () {
  await viteBuild({
    configFile: false,
    logLevel: 'warn',
    plugins: [react()],
    // Bundle every dependency: the components import their styles.
    ssr: { noExternal: true },
    build: {
      ssr: path.resolve('scripts/prerender/entry-server.tsx'),
      outDir: SSR_DIR,
      emptyOutDir: true,
      rollupOptions: { output: { entryFileNames: 'entry-server.mjs' } },
    },
  })
  const { render } = await import(pathToFileURL(path.join(SSR_DIR, 'entry-server.mjs')).href)
  rmSync(SSR_DIR, { recursive: true, force: true })

  const benchmarkData = existsSync(BENCHMARK_DATA_CACHE) ? readJson(BENCHMARK_DATA_CACHE) : fallbackBenchmarkData
  for (const locale of locales) {
    const home = localizePath('/', locale, manifest.locales)
    const messages = readJson(path.join(OUT_DIR, 'docs-data', locale, 'site.json')).code
    writePage(home, {
      locale,
      title: `${DEFAULT_DESCRIPTION} | pnpm`,
      description: DEFAULT_DESCRIPTION,
      body: render(home, { page: 'home', basePath: home === '/' ? '' : home, messages }),
    })
    const benchmarks = localizePath('/benchmarks', locale, manifest.locales)
    writePage(benchmarks, {
      locale,
      title: 'Benchmarks of JavaScript Package Managers | pnpm',
      description: 'How fast pnpm installs a project compared to npm, and how fast it installs Node.js compared to fnm and nvm.',
      body: render(benchmarks, { page: 'benchmarks', data: benchmarkData }),
    })
  }
  // Served by Vercel for every URL that has no file; the app shows its own
  // "Page not found" once it starts.
  writeFileSync(path.join(OUT_DIR, '404.html'), withMeta(template, { locale: 'en', title: 'Page Not Found | pnpm' }))
}

function writePage (route, page) {
  const file = htmlFile(route)
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, withMeta(template, page).replace('<div id="root"></div>', `<div id="root">${page.body}</div>`))
}

function withMeta (html, { locale, title, description }) {
  html = html
    .replace(/<html lang="[^"]*"/, `<html lang="${locale}"`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
  html = setMeta(html, 'property="og:title"', title)
  html = setMeta(html, 'name="twitter:title"', title)
  return description ? setDescription(html, description) : html
}

function setDescription (html, description) {
  for (const attr of ['name="description"', 'property="og:description"', 'name="twitter:description"']) {
    html = setMeta(html, attr, description)
  }
  return html
}

function setMeta (html, attr, content) {
  return html.replace(new RegExp(`(<meta ${attr} content=")[^"]*`), `$1${escapeHtml(content)}`)
}

// Every page of the site, as the path it is served at.
function listRoutes () {
  const routes = []
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      const sub = path.join(dir, entry.name)
      if (dir === OUT_DIR && ['assets', 'docs-data', 'img'].includes(entry.name)) continue
      if (existsSync(path.join(sub, 'index.html'))) routes.push(`/${path.relative(OUT_DIR, sub).split(path.sep).join('/')}`)
      walk(sub)
    }
  }
  walk(OUT_DIR)
  return ['/', ...routes.sort()]
}

function htmlFile (route) {
  return path.join(OUT_DIR, route, 'index.html')
}

function finishHead (route, html) {
  const { locale, kind, search } = describeRoute(route)
  const head = []
  head.push(`<link rel="canonical" href="${SITE_URL}${route}" />`)
  head.push(`<meta property="og:url" content="${SITE_URL}${route}" />`)
  // The docs plugin writes relative hreflang links; search engines want them absolute.
  html = html.replace(/<link rel="alternate" hreflang="[^"]*" href="[^"]*" \/>/g, '')
  for (const other of locales) {
    const href = localizePath(route, other, manifest.locales)
    if (existsSync(htmlFile(href))) head.push(`<link rel="alternate" hreflang="${other}" href="${SITE_URL}${href}" />`)
  }
  head.push(`<link rel="alternate" hreflang="x-default" href="${SITE_URL}${localizePath(route, manifest.defaultLocale, manifest.locales)}" />`)
  for (const [name, content] of Object.entries(search)) {
    head.push(`<meta name="docsearch:${name}" content="${escapeHtml(content)}" />`)
  }
  if ((kind === 'docs' || kind === 'blog-post') && html.includes(`<meta name="description" content="${DEFAULT_DESCRIPTION}"`)) {
    const summary = firstParagraph(html)
    if (summary) html = setDescription(html, summary)
  }
  if (locale !== manifest.defaultLocale) {
    // The feeds of a locale are published next to its blog.
    html = html.replace(/href="\/blog\/(rss|atom)\.xml"/g, `href="/${locale}/blog/$1.xml"`)
  }
  return html
    .replace('</head>', `${head.join('\n    ')}\n  </head>`)
    .replace('<main class="docs-prerendered">', '<main class="docs-prerendered"><article>')
    .replace(/<\/main><\/div>(\s*<\/body>)/, '</article></main></div>$1')
}

// Which part of the site a page belongs to, with the facets that the search box
// filters on: the same values Docusaurus wrote into its pages.
function describeRoute (route) {
  const blog = parseBlogPath(route, manifest)
  if (blog) {
    return {
      locale: blog.locale,
      kind: blog.view.type === 'post' ? 'blog-post' : 'blog-list',
      search: { language: blog.locale, docusaurus_tag: blog.view.type === 'post' ? 'default' : 'blog_posts_list' },
    }
  }
  const { locale, version, docId } = parseDocsPath(route, manifest)
  const withoutLocale = localizePath(route, manifest.defaultLocale, manifest.locales)
  if (withoutLocale === '/' || withoutLocale === '/benchmarks' || !docId) {
    return { locale, kind: 'page', search: { language: locale, docusaurus_tag: 'default' } }
  }
  const section = manifest.sections?.find(({ name }) => name === version)
  return {
    locale,
    kind: 'docs',
    search: section
      ? { language: locale, version: 'current', docusaurus_tag: `docs-${section.name}-current` }
      : { language: locale, version, docusaurus_tag: `docs-default-${version}` },
  }
}

// Docusaurus described a page without a `description` by its first paragraph.
function firstParagraph (html) {
  const content = html.split('<main class="docs-prerendered">')[1] ?? ''
  for (const [, paragraph] of content.matchAll(/<p>([\s\S]*?)<\/p>/g)) {
    const text = decodeEntities(stripTags(paragraph)).replace(/\s+/g, ' ').trim()
    if (text) return text.length > 300 ? `${text.slice(0, 297).replace(/\s+\S*$/, '')}...` : text
  }
  return undefined
}

// The result is escaped again wherever it is written, this only has to make
// plain text of the paragraph.
function stripTags (html) {
  let text = html
  let previous
  do {
    previous = text
    text = text.replace(/<[^>]*>/g, '')
  } while (text !== previous)
  return text
}

function writeSitemaps (routes) {
  for (const locale of locales) {
    const own = routes.filter((route) => describeRoute(route).locale === locale)
    const urls = own
      .map((route) => `<url><loc>${SITE_URL}${route}</loc><changefreq>weekly</changefreq><priority>0.5</priority></url>`)
      .join('')
    const file = path.join(OUT_DIR, localizePath('/', locale, manifest.locales), 'sitemap.xml')
    writeFileSync(file, `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>\n`)
  }
}

function writeFeeds () {
  for (const locale of locales) {
    const blogDir = path.join(OUT_DIR, 'docs-data', locale, 'blog')
    const index = readJson(path.join(blogDir, 'index.json'))
    const blogUrl = `${SITE_URL}${localizePath('/blog', locale, manifest.locales)}`
    const posts = index.posts.slice(0, FEED_SIZE).map((summary) => {
      const post = readJson(path.join(blogDir, 'posts', `${summary.slug}.json`))
      return {
        title: post.title,
        url: `${blogUrl}/${post.slug}`,
        date: new Date(`${post.date}T00:00:00Z`),
        summary: post.description ?? firstParagraph(`<main class="docs-prerendered">${post.excerptHtml}`) ?? '',
        html: absoluteUrls(post.html),
        authors: post.authors,
      }
    })
    const updated = posts[0]?.date ?? new Date()
    const title = index.labels.title === 'Blog' ? 'pnpm Blog' : `pnpm ${index.labels.title}`
    const rss = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeHtml(title)}</title>
    <link>${blogUrl}</link>
    <description>${escapeHtml(title)}</description>
    <lastBuildDate>${updated.toUTCString()}</lastBuildDate>
    <docs>https://validator.w3.org/feed/docs/rss2.html</docs>
    <language>${locale}</language>
${posts.map((post) => `    <item>
      <title>${cdata(post.title)}</title>
      <link>${post.url}</link>
      <guid>${post.url}</guid>
      <pubDate>${post.date.toUTCString()}</pubDate>
      <description>${cdata(post.summary)}</description>
      <content:encoded>${cdata(post.html)}</content:encoded>
${post.authors.map((author) => `      <dc:creator>${escapeHtml(author.name)}</dc:creator>`).join('\n')}
    </item>`).join('\n')}
  </channel>
</rss>
`
    const atom = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${blogUrl}</id>
  <title>${escapeHtml(title)}</title>
  <updated>${updated.toISOString()}</updated>
  <link rel="alternate" href="${blogUrl}"/>
  <subtitle>${escapeHtml(title)}</subtitle>
  <icon>${SITE_URL}/img/favicon.png</icon>
${posts.map((post) => `  <entry>
    <title type="html">${cdata(post.title)}</title>
    <id>${post.url}</id>
    <link href="${post.url}"/>
    <updated>${post.date.toISOString()}</updated>
    <summary type="html">${cdata(post.summary)}</summary>
    <content type="html">${cdata(post.html)}</content>
${post.authors.map((author) => `    <author><name>${escapeHtml(author.name)}</name>${author.url ? `<uri>${escapeHtml(author.url)}</uri>` : ''}</author>`).join('\n')}
  </entry>`).join('\n')}
</feed>
`
    const dir = path.join(OUT_DIR, localizePath('/blog', locale, manifest.locales))
    writeFileSync(path.join(dir, 'rss.xml'), rss)
    writeFileSync(path.join(dir, 'atom.xml'), atom)
  }
}

function absoluteUrls (html) {
  return html.replace(/(href|src)="\/(?!\/)/g, `$1="${SITE_URL}/`)
}

function cdata (text) {
  return `<![CDATA[${text.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`
}

function escapeHtml (text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function decodeEntities (text) {
  return text
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&amp;/g, '&')
}

function readJson (file) {
  return JSON.parse(readFileSync(file, 'utf8'))
}
