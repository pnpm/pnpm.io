import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { renderReleasePage, writeReleasePage } from './release-pages.mjs'

const CHANGELOG = `## 12.9.0

pnpm 12.9.0 adds \`pnpm foo\`.

### Minor Changes

- \`pnpm foo\` prints foo [#1](https://github.com/pnpm/pnpm/issues/1).

### Patch Changes

#### Installing packages

- Fixed a crash.

  \`\`\`sh
  ## not a heading
  \`\`\`
`

function fixture (t, files) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'pnpm-release-pages-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  const source = path.join(root, 'source')
  const site = path.join(root, 'site')
  mkdirSync(path.join(source, '.changeset/changelogs'), { recursive: true })
  for (const [name, content] of Object.entries(files)) {
    writeFileSync(path.join(source, '.changeset/changelogs', name), content)
  }
  const env = { ...process.env, GIT_COMMITTER_DATE: '2026-10-01T12:00:00Z' }
  const git = (...args) => execFileSync('git', args, { cwd: source, encoding: 'utf8', env }).trim()
  git('init', '--quiet')
  git('config', 'commit.gpgsign', 'false')
  git('config', 'user.email', 'test@example.com')
  git('config', 'user.name', 'Test')
  git('add', '.')
  git('commit', '--quiet', '--allow-empty', '-m', 'chore(release): 12.9.0')
  return { source, site, releaseCommit: git('rev-parse', 'HEAD') }
}

test('renders a changelog section as a blog post', () => {
  assert.equal(renderReleasePage({ changelog: CHANGELOG, version: '12.9.0', date: '2026-10-01' }), `---
title: pnpm 12.9.0
authors: zkochan
tags: [release]
date: 2026-10-01
---

pnpm 12.9.0 adds \`pnpm foo\`.

<!-- truncate -->

## Minor Changes

- \`pnpm foo\` prints foo [#1](https://github.com/pnpm/pnpm/issues/1).

## Patch Changes

### Installing packages

- Fixed a crash.

  \`\`\`sh
  ## not a heading
  \`\`\`
`)
})

test('only a matching marker closes a code fence', () => {
  const changelog = '## 12.9.1\n\n````md\n~~~\n```\n### Example\n````\n\n### Patch Changes\n'
  const page = renderReleasePage({ changelog, version: '12.9.1', date: '2026-10-01' })
  assert.match(page, /```\n### Example\n````\n\n<!-- truncate -->\n\n## Patch Changes\n$/)
})

test('a section without a lead paragraph has an empty excerpt', () => {
  const page = renderReleasePage({ changelog: '## 12.9.1\n\n### Patch Changes\n\n- Fixed a crash.\n', version: '12.9.1', date: '2026-10-01' })
  assert.match(page, /---\n\n<!-- truncate -->\n\n## Patch Changes\n/)
})

test('rejects a changelog for another version', () => {
  assert.throws(() => renderReleasePage({ changelog: CHANGELOG, version: '12.9.1', date: '2026-10-01' }), /Expected the changelog to start with "## 12.9.1"/)
})

test('writes the page from the line\'s changelog at the release commit', t => {
  const f = fixture(t, { 'pacquet@12.9.0.md': CHANGELOG, 'pnpm@11.29.0.md': CHANGELOG.replaceAll('12.9.0', '11.29.0') })
  writeFileSync(path.join(f.source, '.changeset/changelogs/pacquet@12.9.0.md'), 'uncommitted')
  assert.equal(writeReleasePage({ ...f, line: '12.x', version: '12.9.0' }), true)
  const page = readFileSync(path.join(f.site, 'blog/releases/12.9.0.md'), 'utf8')
  assert.match(page, /^---\ntitle: pnpm 12.9.0\n.*\ndate: 2026-10-01\n/s)
  assert.match(page, /pnpm 12.9.0 adds/)
  assert.equal(writeReleasePage({ ...f, line: '11.x', version: '11.29.0' }), true)
  assert.match(readFileSync(path.join(f.site, 'blog/releases/11.29.0.md'), 'utf8'), /title: pnpm 11.29.0/)
})

test('keeps an existing page', t => {
  const f = fixture(t, { 'pacquet@12.9.0.md': CHANGELOG })
  mkdirSync(path.join(f.site, 'blog/releases'), { recursive: true })
  writeFileSync(path.join(f.site, 'blog/releases/12.9.0.md'), 'edited on the website')
  assert.equal(writeReleasePage({ ...f, line: '12.x', version: '12.9.0' }), false)
  assert.equal(readFileSync(path.join(f.site, 'blog/releases/12.9.0.md'), 'utf8'), 'edited on the website')
})

test('skips a release without a composed changelog and pnpr releases', t => {
  const f = fixture(t, {})
  t.mock.method(console, 'warn', () => {})
  assert.equal(writeReleasePage({ ...f, line: '12.x', version: '12.9.0' }), false)
  assert.equal(writeReleasePage({ ...f, line: 'pnpr', version: '0.1.0-alpha.15' }), false)
  assert.equal(existsSync(path.join(f.site, 'blog')), false)
})

test('rejects a version outside the line, a prerelease and a mutable commit', t => {
  const f = fixture(t, { 'pacquet@12.9.0.md': CHANGELOG })
  assert.throws(() => writeReleasePage({ ...f, line: '11.x', version: '12.9.0' }), /has no 11.x release page/)
  assert.throws(() => writeReleasePage({ ...f, line: '12.x', version: '12.9.0-rc.0' }), /has no 12.x release page/)
  assert.throws(() => writeReleasePage({ ...f, line: '12.x', version: '../12.9.0' }), /has no 12.x release page/)
  assert.throws(() => writeReleasePage({ ...f, line: '12.x', version: '12.9.0', releaseCommit: 'HEAD' }), /immutable release commit/)
})
