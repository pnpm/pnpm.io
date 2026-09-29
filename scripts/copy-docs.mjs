import { execFileSync } from 'node:child_process'
import { copyFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, renameSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
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

const INSTALL_GUIDE_PACKAGE = '@pnpm/website.sections.install-guide'

export function copyInstallGuideMessages (site) {
  const packageDir = path.dirname(createRequire(path.join(site, 'package.json')).resolve(`${INSTALL_GUIDE_PACKAGE}/package.json`))
  const source = ['install-guide.json', 'dist/install-guide.json']
    .map((file) => path.join(packageDir, file))
    .find((file) => existsSync(file))
  if (!source) throw new Error(`${INSTALL_GUIDE_PACKAGE} has no install-guide.json in ${packageDir}`)
  const target = path.join(site, 'i18n-sources', 'en', 'install-guide.json')
  mkdirSync(path.dirname(target), { recursive: true })
  copyFileSync(source, target)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  copyDocsForTranslations(site)
  copyInstallGuideMessages(site)
}
