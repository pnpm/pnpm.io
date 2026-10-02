import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import semver from 'semver'
import { releaseChangelogPackages } from './docs-sources.mjs'

const FENCE = /^\s*(```|~~~)/
const HEADING = /^#{1,6}\s/

/**
 * Writes `blog/releases/<version>.md` from the changelog section composed for a
 * stable pnpm release, read at its release commit. An existing page is kept, so
 * edits made on the website survive a rerun of the sync.
 * @returns whether a page was written.
 */
export function writeReleasePage ({ source, site, line, version, releaseCommit }) {
  const packageName = releaseChangelogPackages[line]
  if (!packageName) return false
  if (!semver.valid(version) || semver.prerelease(version) || line !== `${semver.major(version)}.x`) {
    throw new Error(`Release ${version} has no ${line} release page`)
  }
  if (!/^[a-f0-9]{40}$/.test(releaseCommit ?? '')) throw new Error('Expected an immutable release commit SHA')
  const page = path.join(site, 'blog/releases', `${version}.md`)
  if (existsSync(page)) return false
  const git = (...args) => execFileSync('git', args, { cwd: source, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  const changelogPath = `.changeset/changelogs/${packageName}@${version}.md`
  const object = `${releaseCommit}:${changelogPath}`
  try {
    git('cat-file', '-e', object)
  } catch {
    console.warn(`::warning::No ${changelogPath} at ${releaseCommit}; skipping the ${version} release page`)
    return false
  }
  const date = git('show', '-s', '--format=%cs', releaseCommit).trim()
  mkdirSync(path.dirname(page), { recursive: true })
  writeFileSync(page, renderReleasePage({ changelog: git('show', object), version, date }))
  return true
}

/**
 * Turns a `## <version>` changelog section into a blog post. Headings move up
 * one level, and the paragraph before the first heading becomes the excerpt.
 */
export function renderReleasePage ({ changelog, version, date }) {
  const lines = changelog.replace(/\r\n?/g, '\n').trim().split('\n')
  if (lines[0] !== `## ${version}`) throw new Error(`Expected the changelog to start with "## ${version}"`)
  let inFence = false
  let firstHeading = -1
  const body = lines.slice(1).map((text, index) => {
    if (FENCE.test(text)) inFence = !inFence
    if (inFence || !HEADING.test(text)) return text
    if (firstHeading < 0) firstHeading = index
    return text.startsWith('##') ? text.slice(1) : text
  })
  const lead = body.slice(0, firstHeading < 0 ? body.length : firstHeading).join('\n').trim()
  const rest = firstHeading < 0 ? '' : body.slice(firstHeading).join('\n').trim()
  const frontMatter = `---\ntitle: pnpm ${version}\nauthors: zkochan\ntags: [release]\ndate: ${date}\n---`
  return [frontMatter, lead, '<!-- truncate -->', rest].filter(Boolean).join('\n\n') + '\n'
}
