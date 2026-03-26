import { execSync } from 'node:child_process'
import { unlinkSync } from 'node:fs'
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

    const brokenFile = extractBrokenI18nFile(output)
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
