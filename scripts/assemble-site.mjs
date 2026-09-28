import { cpSync, existsSync, readdirSync, readFileSync, renameSync, rmSync } from 'node:fs'
import path from 'node:path'

// Vercel builds this site by running this script (see `buildCommand` in
// vercel.json) instead of building it, because the build itself happens in CI:
// the build job of .github/workflows/deploy.yml builds the whole site, every
// locale included, and the deploy job downloads it into ARTIFACTS_DIR. All that
// is left here is to move it where Vercel looks for it, so that `vercel build`
// still turns vercel.json into a deployment.

const ARTIFACTS_DIR = path.resolve('.site-artifacts')
const OUT_DIR = path.resolve('build')

function isPopulated (dir) {
  try {
    return readdirSync(dir).length > 0
  } catch {
    return false
  }
}

function fail (message) {
  console.error(message)
  process.exit(1)
}

if (isPopulated(ARTIFACTS_DIR)) {
  console.log(`Assembling the site from ${path.relative(process.cwd(), ARTIFACTS_DIR)}`)
  rmSync(OUT_DIR, { recursive: true, force: true })
  try {
    renameSync(ARTIFACTS_DIR, OUT_DIR)
  } catch (err) {
    // The artifacts may sit on a different filesystem than the checkout.
    if (err.code !== 'EXDEV') throw err
    cpSync(ARTIFACTS_DIR, OUT_DIR, { recursive: true })
    rmSync(ARTIFACTS_DIR, { recursive: true, force: true })
  }
  // A locale missing from the build would silently disappear from the site,
  // so make sure they are all there.
  const [defaultLocale, ...locales] = JSON.parse(readFileSync('locales.json', 'utf-8'))
    .map(({ locale }) => locale)
  const missing = locales.filter(locale => !existsSync(path.join(OUT_DIR, locale, 'index.html')))
  if (missing.length > 0) {
    fail(`These locales are missing from the assembled site: ${missing.join(', ')}.`)
  }
  console.log(`Assembled ${defaultLocale} and ${locales.length} translated locales.`)
} else {
  fail(`Nothing to deploy: ${path.relative(process.cwd(), ARTIFACTS_DIR)} is empty.

The site is built by the "Deploy" GitHub Actions workflow and shipped from
there with \`vercel deploy --prebuilt\`. Re-run that workflow
instead of building from the Vercel dashboard. To build the whole site locally,
run \`pnpm build\`.`)
}

if (!existsSync(path.join(OUT_DIR, 'index.html'))) {
  fail(`${path.relative(process.cwd(), OUT_DIR)} has no index.html: the build of the default locale is missing.`)
}
