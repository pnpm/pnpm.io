import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { readDocsVersions } from './docs-sources.mjs'
import { writeTranslations } from './write-translations.mjs'

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

test('writes the English site strings where crowdin.yaml uploads them from', async (t) => {
  const target = mkdtempSync(path.join(os.tmpdir(), 'pnpm-io-translations-'))
  t.after(() => rmSync(target, { recursive: true, force: true }))
  await writeTranslations(site, target)

  const read = (file) => JSON.parse(readFileSync(path.join(target, file), 'utf8'))
  const message = (file, key) => read(file)[key]?.message

  assert.equal(message('docusaurus-theme-classic/navbar.json', 'item.label.Docs'), 'Docs')
  assert.equal(message('docusaurus-theme-classic/navbar.json', 'item.label.Sponsor'), 'Sponsor')
  assert.equal(message('docusaurus-theme-classic/footer.json', 'link.title.Community'), 'Community')
  assert.equal(message('docusaurus-theme-classic/footer.json', 'link.item.label.Help Us Translate'), 'Help Us Translate')

  // Every homepage string is its own key.
  const homepage = readFileSync(path.join(site, 'src', 'homepage', 'content.tsx'), 'utf8')
  const texts = [...homepage.matchAll(/\bt\('((?:[^'\\]|\\.)*)'\)/g)].map(([, text]) => text)
  assert.ok(texts.length > 0)
  for (const text of texts) assert.equal(message('code.json', text), text)
  assert.equal(message('code.json', 'theme.CodeBlock.copy'), 'Copy')
  assert.equal(message('code.json', 'theme.SearchBar.label'), 'Search')

  const [latest, ...older] = readDocsVersions(site)
  for (const file of ['current.json', `version-${latest}.json`, ...older.map((version) => `version-${version}.json`)]) {
    assert.equal(message(`docusaurus-plugin-content-docs/${file}`, 'sidebar.docs.category.Usage'), 'Usage', file)
  }
  // The pnpr docs are not translated.
  assert.ok(!readdirSync(target).some((dir) => dir.startsWith('docusaurus-plugin-content-docs-')))
})
