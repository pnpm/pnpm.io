import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import semver from 'semver'
import { docsSourcePaths } from './docs-sources.mjs'

const websiteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export function syncDocs ({ source, site = websiteRoot, line, version, releaseCommit, docsCommit, preview = false }) {
  if (!Object.hasOwn(docsSourcePaths, line)) throw new Error(`Invalid documentation line: ${line}`)
  const sourceDir = path.join(source, docsSourcePaths[line])
  const versions = readJson(path.join(site, 'versions.json'))
  const latest = versions[0]
  if (line !== 'pnpr' && !versions.includes(line)) throw new Error(`Configure ${line} in versions.json before importing it`)
  const docsPath = line === 'pnpr' ? 'pnpr-docs' : line === latest ? 'docs' : `versioned_docs/version-${line}`
  const sidebarPath = line === 'pnpr' ? 'sidebars-pnpr.json' : line === latest ? 'sidebars.json' : `versioned_sidebars/version-${line}-sidebars.json`
  const statePath = path.join(site, 'docs-sync.json')
  const state = existsSync(statePath) ? readJson(statePath) : {}

  if (!preview) {
    if (!semver.valid(version)) throw new Error(`Invalid release version: ${version}`)
    if (line !== 'pnpr' && (line !== `${semver.major(version)}.x` || semver.prerelease(version))) {
      throw new Error(`Release ${version} cannot update stable ${line} documentation`)
    }
    for (const commit of [releaseCommit, docsCommit]) {
      if (!/^[a-f0-9]{40}$/.test(commit ?? '')) throw new Error('Expected immutable release and documentation commit SHAs')
    }
    const previous = state[line]
    if (previous && semver.lt(version, previous.version)) return false
    if (previous?.version === version && previous.docsCommit) {
      if (previous.releaseCommit !== releaseCommit) throw new Error(`Release commit changed for ${version}`)
      if (previous.docsCommit === docsCommit) return false
      if (!isAncestor(source, previous.docsCommit, docsCommit)) {
        if (isAncestor(source, docsCommit, previous.docsCommit)) return false
        throw new Error(`Documentation corrections diverged for ${line}`)
      }
    }
  }

  assertRegularTree(sourceDir)
  const sidebar = readJson(path.join(sourceDir, 'sidebars.json'))
  if (!sidebar || typeof sidebar !== 'object') throw new Error(`Invalid sidebar for ${line}`)
  const assetsDir = path.join(sourceDir, 'static')
  const assets = existsSync(assetsDir) ? listFiles(assetsDir) : []
  replaceDocs(sourceDir, path.join(site, docsPath))
  mkdirSync(path.dirname(path.join(site, sidebarPath)), { recursive: true })
  cpSync(path.join(sourceDir, 'sidebars.json'), path.join(site, sidebarPath))
  const targetAssets = path.join(site, 'static/docs-assets', line)
  rmSync(targetAssets, { recursive: true, force: true })
  if (assets.length) cpSync(assetsDir, targetAssets, { recursive: true })
  for (const file of listFiles(path.join(site, docsPath))) {
    if (!/\.mdx?$/.test(file)) continue
    const target = path.join(site, docsPath, file)
    let text = readFileSync(target, 'utf8')
    for (const asset of assets) {
      text = text.replaceAll(`/${asset}`, (url, offset, input) => {
        const before = input[offset - 1]
        const after = input[offset + url.length]
        if (before && !' \t\n\r("\'='.includes(before)) return url
        if (after && !' \t\n\r)"\'<>],?#'.includes(after)) return url
        return `/docs-assets/${line}${url}`
      })
    }
    writeFileSync(target, text)
  }
  if (!preview) {
    state[line] = { version, releaseCommit, docsCommit }
    writeFileSync(statePath, JSON.stringify(state, null, 2) + '\n')
  }
  return true
}

function isAncestor (repo, older, newer) {
  try {
    execFileSync('git', ['merge-base', '--is-ancestor', older, newer], { cwd: repo, stdio: 'pipe' })
    return true
  } catch (error) {
    if (error.status === 1) return false
    throw error
  }
}

function readJson (file) {
  return JSON.parse(readFileSync(file, 'utf8'))
}

function assertRegularTree (dir) {
  const stat = lstatSync(dir)
  if (stat.isDirectory()) {
    for (const name of readdirSync(dir)) assertRegularTree(path.join(dir, name))
  } else if (!stat.isFile()) {
    throw new Error(`Documentation must contain only regular files: ${dir}`)
  }
}

function listFiles (dir) {
  return readdirSync(dir, { recursive: true })
    .filter(file => lstatSync(path.join(dir, file)).isFile())
    .map(file => file.split(path.sep).join('/'))
}

function replaceDocs (source, target) {
  rmSync(target, { recursive: true, force: true })
  mkdirSync(target, { recursive: true })
  for (const name of readdirSync(source)) {
    if (['static', 'sidebars.json', '.gitattributes'].includes(name)) continue
    cpSync(path.join(source, name), path.join(target, name), { recursive: true })
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [source, line, version, releaseCommit, docsCommit] = process.argv.slice(2)
  if (!source || !line) throw new Error('Usage: node scripts/sync-docs.mjs SOURCE LINE VERSION RELEASE_SHA DOCS_SHA | SOURCE --preview')
  if (line === '--preview') {
    for (const name of Object.keys(docsSourcePaths)) {
      syncDocs({ source, line: name, preview: true })
    }
  } else {
    console.log(syncDocs({ source, line, version, releaseCommit, docsCommit }) ? `Updated ${line} docs to ${version}` : `Docs for ${line} are already current`)
  }
}
