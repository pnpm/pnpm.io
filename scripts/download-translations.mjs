// Downloads the translations from Crowdin into i18n/, laid out the way
// `crowdin download` laid them out. The build reads them from there.
//
// A download younger than an hour is reused instead of asking Crowdin for
// another export, and a refused export (Crowdin rate limits them and answers
// 429) is retried a few times before the last download is used instead. Fails
// when a locale of locales.json has no translations, because that locale would
// go out as an untranslated copy of the English site.
//
// Needs CROWDIN_PERSONAL_TOKEN. CROWDIN_PROJECT_ID defaults to the pnpm project.

import { appendFileSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { downloadTranslations } from '@pnpm/website.docs.crowdin-translations'
import { CROWDIN_PROJECT_ID } from '@pnpm/website.docs.docs-model'

const locales = JSON.parse(readFileSync('locales.json', 'utf8')).filter(({ crowdinLanguage }) => crowdinLanguage)

const result = await downloadTranslations({
  token: process.env.CROWDIN_PERSONAL_TOKEN ?? '',
  projectId: Number(process.env.CROWDIN_PROJECT_ID || CROWDIN_PROJECT_ID),
  targetDir: path.resolve('i18n'),
  languageMapping: Object.fromEntries(locales.map(({ locale, crowdinLanguage }) => [crowdinLanguage, locale])),
})

if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `source=${result.source}\n`)
if (result.source === 'stale') {
  console.log(`::warning::Crowdin would not export; using the translations downloaded at ${result.downloadedAt.toISOString()}.`)
}

const missing = locales.filter(({ locale }) => !result.locales.includes(locale)).map(({ locale }) => locale)
if (missing.length > 0) {
  console.error(`No translations for: ${missing.join(', ')}`)
  process.exit(1)
}
