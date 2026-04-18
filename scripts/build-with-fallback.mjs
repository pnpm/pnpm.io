import { execSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync, unlinkSync } from 'node:fs'
import path from 'node:path'

const MAX_RETRIES = 50
const I18N_DIR = path.resolve('i18n')

function extractBrokenI18nFile (output) {
  // Match file paths inside the i18n directory from the build error output.
  // Docusaurus / MDX / webpack errors typically include the full file path.
  const regex = new RegExp(`(${escapeRegExp(I18N_DIR)}[^\\s:)"']+\\.mdx?)`, 'g')
  const matches = [...output.matchAll(regex)]
  if (matches.length > 0) {
    return matches[0][1]
  }
  // Also try a relative i18n/ path
  const relativeRegex = /(?:^|\s|["'(])(i18n\/[^\s:)"']+\.mdx?)/gm
  const relMatches = [...output.matchAll(relativeRegex)]
  if (relMatches.length > 0) {
    return path.resolve(relMatches[0][1])
  }
  return null
}

// When a translated doc has a mistranslated `id:` frontmatter, Docusaurus reports
// an "Invalid sidebar file" error pointing at the sidebar path rather than the
// offending i18n file. In that case, scan every locale's translated doc tree for
// files whose on-disk path implies an expected id but whose frontmatter declares
// a different one, and return one of those to delete.
function extractMismatchedI18nIdFile (output) {
  if (!output.includes('Invalid sidebar file')) return null
  if (!existsSync(I18N_DIR)) return null
  for (const locale of safeReaddir(I18N_DIR)) {
    const localeDocsRoot = path.join(I18N_DIR, locale, 'docusaurus-plugin-content-docs')
    if (!existsSync(localeDocsRoot)) continue
    for (const versionDir of safeReaddir(localeDocsRoot)) {
      const versionRoot = path.join(localeDocsRoot, versionDir)
      if (!isDir(versionRoot)) continue
      const mismatch = findMismatchedDoc(versionRoot, versionRoot)
      if (mismatch) return mismatch
    }
  }
  return null
}

function findMismatchedDoc (root, dir) {
  for (const entry of safeReaddir(dir)) {
    const full = path.join(dir, entry)
    if (isDir(full)) {
      const nested = findMismatchedDoc(root, full)
      if (nested) return nested
      continue
    }
    if (!/\.mdx?$/.test(entry)) continue
    const declaredId = readFrontmatterId(full)
    if (!declaredId) continue
    const rel = path.relative(root, full).replace(/\\/g, '/')
    const expectedId = rel.replace(/\.mdx?$/, '')
    // Frontmatter `id:` may be a bare name (e.g. `search`) or the full path
    // (`cli/search`). Anything else is a broken translation.
    const expectedBase = path.basename(expectedId)
    if (declaredId !== expectedId && declaredId !== expectedBase) {
      return full
    }
  }
  return null
}

function readFrontmatterId (file) {
  let content
  try {
    content = readFileSync(file, 'utf-8')
  } catch {
    return null
  }
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/)
  if (!match) return null
  const idLine = match[1].split('\n').find(line => /^\s*id\s*:/.test(line))
  if (!idLine) return null
  return idLine.replace(/^\s*id\s*:\s*/, '').replace(/["']/g, '').trim()
}

function safeReaddir (dir) {
  try {
    return readdirSync(dir)
  } catch {
    return []
  }
}

function isDir (p) {
  try {
    return statSync(p).isDirectory()
  } catch {
    return false
  }
}

function escapeRegExp (string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

let removedFiles = []

for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
  console.log(`\n🔨 Build attempt ${attempt}${removedFiles.length > 0 ? ` (${removedFiles.length} broken translation(s) removed so far)` : ''}...\n`)
  try {
    execSync('docusaurus build', {
      stdio: ['inherit', 'inherit', 'pipe'],
      encoding: 'utf-8',
      maxBuffer: 50 * 1024 * 1024,
    })
    // Build succeeded
    if (removedFiles.length > 0) {
      console.log(`\n✅ Build succeeded after removing ${removedFiles.length} broken translation file(s):`)
      for (const f of removedFiles) {
        console.log(`   - ${path.relative(process.cwd(), f)}`)
      }
      console.log('\nThese pages will fall back to English.\n')
    }
    process.exit(0)
  } catch (err) {
    const stderr = err.stderr || ''
    const stdout = err.stdout || ''
    const output = stderr + '\n' + stdout

    const brokenFile = extractBrokenI18nFile(output) ?? extractMismatchedI18nIdFile(output)
    if (!brokenFile) {
      // Not a translation file error — fail the build
      console.error('\n❌ Build failed with a non-translation error:\n')
      console.error(stderr)
      process.exit(1)
    }

    console.warn(`\n⚠️  Broken translation file detected: ${path.relative(process.cwd(), brokenFile)}`)
    console.warn('   Removing it so the page falls back to English...\n')

    try {
      unlinkSync(brokenFile)
      removedFiles.push(brokenFile)
    } catch (unlinkErr) {
      console.error(`Failed to remove ${brokenFile}: ${unlinkErr.message}`)
      process.exit(1)
    }
  }
}

console.error(`\n❌ Build failed after ${MAX_RETRIES} retries. Removed files:`)
for (const f of removedFiles) {
  console.error(`   - ${path.relative(process.cwd(), f)}`)
}
process.exit(1)
