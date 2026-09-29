import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { syncDocs } from './sync-docs.mjs'
import { docsSourcePaths } from './docs-sources.mjs'

function fixture (t) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'pnpm-docs-sync-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  const source = path.join(root, 'source')
  const site = path.join(root, 'site')
  mkdirSync(site)
  writeFileSync(path.join(site, 'versions.json'), '["12.x","11.x","10.x"]')
  for (const [line, docsPath] of Object.entries(docsSourcePaths)) {
    const dir = path.join(source, docsPath)
    mkdirSync(path.join(dir, 'static/img'), { recursive: true })
    writeFileSync(path.join(dir, 'index.md'), `# ${line}\n![image](/img/test.svg)\n`)
    writeFileSync(path.join(dir, 'static/img/test.svg'), '<svg/>')
    writeFileSync(path.join(dir, 'sidebars.json'), '{"docs":["index"]}')
  }
  const git = (...args) => execFileSync('git', args, { cwd: source, encoding: 'utf8' }).trim()
  git('init', '--quiet')
  git('config', 'user.email', 'test@example.com')
  git('config', 'user.name', 'Test')
  git('add', '.')
  git('commit', '--quiet', '-m', 'docs: initial sources')
  const releaseCommit = git('rev-parse', 'HEAD')
  return { source, site, line: '12.x', version: '12.8.2', releaseCommit, docsCommit: releaseCommit, git }
}

test('syncs only the released version, deletes removed pages, and scopes assets', t => {
  const f = fixture(t)
  mkdirSync(path.join(f.site, 'docs'))
  writeFileSync(path.join(f.site, 'docs/removed.md'), 'old')
  mkdirSync(path.join(f.site, 'blog'))
  writeFileSync(path.join(f.site, 'blog/post.md'), 'blog')
  syncDocs(f)
  assert.equal(existsSync(path.join(f.site, 'docs/removed.md')), false)
  assert.match(readFileSync(path.join(f.site, 'docs/index.md'), 'utf8'), /\/docs-assets\/12.x\/img\/test.svg/)
  assert.equal(readFileSync(path.join(f.site, 'static/docs-assets/12.x/img/test.svg'), 'utf8'), '<svg/>')
  assert.equal(readFileSync(path.join(f.site, 'blog/post.md'), 'utf8'), 'blog')
  assert.equal(existsSync(path.join(f.site, 'pnpr-docs')), false)
  assert.equal(syncDocs(f), false)
})

test('older releases cannot replace newer documentation', t => {
  const f = fixture(t)
  syncDocs(f)
  assert.equal(syncDocs({ ...f, version: '12.8.1' }), false)
  assert.equal(JSON.parse(readFileSync(path.join(f.site, 'docs-sync.json')))[f.line].version, '12.8.2')
})

test('corrections survive rerunning the original release', t => {
  const f = fixture(t)
  syncDocs(f)
  writeFileSync(path.join(f.source, 'pnpm/docs/index.md'), 'corrected')
  f.git('commit', '--quiet', '-am', 'docs: correction')
  const correction = f.git('rev-parse', 'HEAD')
  assert.equal(syncDocs({ ...f, docsCommit: correction }), true)
  assert.equal(syncDocs(f), false)
  assert.equal(readFileSync(path.join(f.site, 'docs/index.md'), 'utf8'), 'corrected')
})

test('preview imports product docs without changing older versions, blog or release state', t => {
  const f = fixture(t)
  for (const dir of ['versioned_docs/version-10.x', 'versioned_docs_archived/version-9.x', 'blog']) {
    mkdirSync(path.join(f.site, dir), { recursive: true })
    writeFileSync(path.join(f.site, dir, 'index.md'), dir)
  }
  for (const line of Object.keys(docsSourcePaths)) syncDocs({ ...f, line, preview: true })
  assert.equal(existsSync(path.join(f.site, 'versioned_docs/version-11.x/index.md')), true)
  for (const dir of ['versioned_docs/version-10.x', 'versioned_docs_archived/version-9.x', 'blog']) {
    assert.equal(readFileSync(path.join(f.site, dir, 'index.md'), 'utf8'), dir)
  }
  assert.equal(existsSync(path.join(f.site, 'docs-sync.json')), false)
  assert.equal(existsSync(path.join(f.site, 'pnpr-docs/index.md')), true)
  assert.equal(existsSync(path.join(f.site, 'docs/sidebars.json')), false)
  assert.equal(existsSync(path.join(f.site, 'docs/static')), false)
})

test('rejects mismatched versions, prereleases, unknown lines and symlinks before copying', t => {
  const f = fixture(t)
  for (const change of [{ line: '../blog' }, { line: '10.x' }, { line: '9.x' }, { version: '11.0.0' }, { version: '12.9.0-beta.1' }, { line: '13.x', version: '13.0.0' }, { docsCommit: 'main' }]) {
    assert.throws(() => syncDocs({ ...f, ...change }))
  }
  symlinkSync(path.join(f.site, 'versions.json'), path.join(f.source, 'pnpm/docs/leak.md'))
  assert.throws(() => syncDocs(f), /regular files/)
  assert.equal(existsSync(path.join(f.site, 'docs')), false)
})


test('asset rewriting preserves external URLs and filenames with a shared prefix', t => {
  const f = fixture(t)
  writeFileSync(path.join(f.source, 'pnpm/docs/index.md'), [
    '![local](/img/test.svg?size=small)',
    '![remote](https://example.com/img/test.svg)',
    '![other](/img/test.svg.png)',
    '<img src="/img/test.svg" />',
  ].join('\n'))
  syncDocs(f)
  const rendered = readFileSync(path.join(f.site, 'docs/index.md'), 'utf8')
  assert.match(rendered, /\/docs-assets\/12.x\/img\/test.svg\?size=small/)
  assert.ok(rendered.includes('https://example.com/img/test.svg'))
  assert.ok(rendered.includes('(/img/test.svg.png)'))
  assert.ok(rendered.includes('src="/docs-assets/12.x/img/test.svg"'))
})


test('v11 releases update the versioned copy without changing v12', t => {
  const f = fixture(t)
  syncDocs(f)
  const current = readFileSync(path.join(f.site, 'docs/index.md'), 'utf8')
  syncDocs({ ...f, line: '11.x', version: '11.28.3' })
  assert.match(readFileSync(path.join(f.site, 'versioned_docs/version-11.x/index.md'), 'utf8'), /# 11.x/)
  assert.equal(readFileSync(path.join(f.site, 'docs/index.md'), 'utf8'), current)
})


test('pnpr alpha releases update only the registry docs and preserve semver ordering', t => {
  const f = { ...fixture(t), line: 'pnpr', version: '0.1.0-alpha.15' }
  syncDocs(f)
  assert.equal(existsSync(path.join(f.site, 'docs')), false)
  assert.equal(existsSync(path.join(f.site, 'pnpr-docs/index.md')), true)
  assert.equal(existsSync(path.join(f.site, 'sidebars-pnpr.json')), true)
  assert.equal(syncDocs({ ...f, version: '0.1.0-alpha.9' }), false)
})
