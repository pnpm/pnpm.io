import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { currentDocsVersion, readDocsVersions } from './docs-sources.mjs'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const vercel = JSON.parse(readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'))

// The unversioned path serves the current docs version, so a redirect that
// drops a version prefix only belongs to that version. An older version's
// pages are built and served under their own prefix, so when a new version
// becomes the current one the outgoing version's redirect has to go, or its
// pages silently start serving the new version instead.
test('only the current docs version redirects its prefix to the unversioned path', () => {
  const versions = readDocsVersions(ROOT)
  const redirected = vercel.redirects
    .filter(({ destination }) => destination === '/:splat*')
    .map(({ source }) => /^\/([^/]+)\/:splat\*$/.exec(source)?.[1])
    .filter((version) => version !== undefined && versions.includes(version))
  assert.deepEqual(redirected, [currentDocsVersion],
    `only /${currentDocsVersion}/:splat* may redirect to /:splat*, but vercel.json also redirects ${redirected.filter((v) => v !== currentDocsVersion).join(', ')}`)
})
