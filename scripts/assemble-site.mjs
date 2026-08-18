import { cpSync, existsSync, readdirSync, readFileSync, renameSync, rmSync } from 'node:fs'
import path from 'node:path'

// Vercel builds this site by running this script (see `buildCommand` in
// vercel.json) instead of building Docusaurus, because the build itself
// happens in CI: .github/workflows/deploy.yml builds every locale in its own
// job — the default locale at the root of the tree, the other ones under their
// own `/<locale>/` segment — and downloads all of those artifacts into
// ARTIFACTS_DIR. All that is left here is to move them where Vercel looks for
// them, so that `vercel build` still turns vercel.json into a deployment.

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
  // A locale whose build job was skipped or whose artifact failed to download
  // would silently disappear from the site, so make sure they all arrived.
  const [defaultLocale, ...locales] = JSON.parse(readFileSync('locales.json', 'utf-8'))
    .map(({ locale }) => locale)
  const missing = locales.filter(locale => !existsSync(path.join(OUT_DIR, locale, 'index.html')))
  if (missing.length > 0) {
    fail(`These locales are missing from the assembled site: ${missing.join(', ')}.`)
  }
  console.log(`Assembled ${defaultLocale} and ${locales.length} translated locales.`)
} else if (isPopulated(OUT_DIR)) {
  // A single-locale preview build wrote straight into `build`.
  console.log(`Deploying the site already present in ${path.relative(process.cwd(), OUT_DIR)}`)
} else {
  fail(`Nothing to deploy: neither ${ARTIFACTS_DIR} nor ${OUT_DIR} exists.

The site is built by the "Deploy" GitHub Actions workflow, one job per locale,
and shipped from there with \`vercel deploy --prebuilt\`. Re-run that workflow
instead of building from the Vercel dashboard. To build the whole site locally,
run \`pnpm build\`.`)
}

if (!existsSync(path.join(OUT_DIR, 'index.html'))) {
  fail(`${path.relative(process.cwd(), OUT_DIR)} has no index.html: the build of the default locale is missing.`)
}
