import { execFileSync } from 'node:child_process'
import { cpSync, mkdirSync, mkdtempSync, renameSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readDocsVersions } from './docs-sources.mjs'

export function copyDocsForTranslations (site) {
  const [latest] = readDocsVersions(site)
  const relative = `versioned_docs/version-${latest}`
  const tracked = execFileSync('git', ['ls-files', '-z', '--', relative], { cwd: site, encoding: 'utf8' })
  if (tracked) throw new Error(`Refusing to overwrite frozen documentation: ${relative}`)
  const stage = mkdtempSync(path.join(site, '.crowdin-docs-'))
  try {
    cpSync(path.join(site, 'docs'), path.join(stage, 'docs'), { recursive: true })
    mkdirSync(path.dirname(path.join(site, relative)), { recursive: true })
    rmSync(path.join(site, relative), { recursive: true, force: true })
    renameSync(path.join(stage, 'docs'), path.join(site, relative))
  } finally {
    rmSync(stage, { recursive: true, force: true })
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  copyDocsForTranslations(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'))
}
