// Pulls the benchmark page and the charts it refers to from the repo that
// measures them, https://github.com/pnpm/benchmarks, and writes them into this
// site. Nothing is measured here: running the benchmarks takes hours and needs
// a machine that is not doing anything else, which a site build is not.

import fs from 'node:fs';
import path from 'node:path';

const REPO = process.env.BENCHMARKS_REPO ?? 'pnpm/benchmarks';
const REF = process.env.BENCHMARKS_REF ?? 'main';

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '..');
const PAGE_FILE = path.join(PROJECT_ROOT, 'src', 'pages', 'benchmarks.md');
const IMGS_DIR = path.join(PROJECT_ROOT, 'static', 'img', 'benchmarks');

// Where the charts sit in the source repo. It publishes them under the path the
// page points at, so the two need no reconciling.
const SOURCE_PAGE = 'benchmarks.md';
const sourceImage = (name) => `img/benchmarks/${name}`;

const headers = {
  accept: 'application/vnd.github+json',
  // Unauthenticated GitHub requests are rate limited per IP, which a CI runner
  // shares with everyone else on it.
  ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

/**
 * Resolves the ref to the commit behind it, so every file below is read from
 * one snapshot. Reading them from a moving ref one at a time can pick up a page
 * from before a benchmark run and a chart from after it.
 */
async function resolveCommit() {
  const res = await fetch(`https://api.github.com/repos/${REPO}/commits/${REF}`, { headers });
  if (!res.ok) {
    throw new Error(`Couldn't resolve ${REPO}@${REF}: ${res.status} ${res.statusText}`);
  }
  return (await res.json()).sha;
}

async function fetchFile(file, commit) {
  const url = `https://raw.githubusercontent.com/${REPO}/${commit}/${file}`;
  const res = await fetch(url);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Couldn't fetch ${url}: ${res.status} ${res.statusText}`);
  return Buffer.from(await res.arrayBuffer());
}

/**
 * The page stands on its own where it is published, so its links into this
 * site's docs are absolute. Left that way here they would send a reader on a
 * full page load out of the site and back into it.
 */
function localizeLinks(md) {
  return md.replaceAll('https://pnpm.io/', '/');
}

/** The charts the page asks for, in the order it asks for them. */
function referencedImages(md) {
  const names = [...md.matchAll(/\/img\/benchmarks\/([\w.-]+\.svg)/g)].map((m) => m[1]);
  return [...new Set(names)];
}

function writeIfChanged(file, content) {
  if (fs.existsSync(file) && Buffer.compare(fs.readFileSync(file), Buffer.from(content)) === 0) {
    return false;
  }
  fs.writeFileSync(file, content);
  return true;
}

async function update() {
  const commit = await resolveCommit();
  console.log(`Reading ${REPO}@${commit.slice(0, 7)}`);

  const page = await fetchFile(SOURCE_PAGE, commit);
  if (!page) throw new Error(`${REPO} has no ${SOURCE_PAGE} to publish`);
  const md = localizeLinks(page.toString('utf8'));

  fs.mkdirSync(IMGS_DIR, { recursive: true });
  const wanted = referencedImages(md);
  const missing = [];
  const written = [];
  for (const name of wanted) {
    const svg = await fetchFile(sourceImage(name), commit);
    if (!svg) {
      missing.push(name);
      continue;
    }
    if (writeIfChanged(path.join(IMGS_DIR, name), svg)) written.push(name);
  }

  // A chart the page stopped drawing would otherwise be served forever.
  const stale = fs.readdirSync(IMGS_DIR).filter((name) => !wanted.includes(name));
  for (const name of stale) fs.rmSync(path.join(IMGS_DIR, name));

  const pageChanged = writeIfChanged(PAGE_FILE, md);

  if (missing.length) {
    // Not fatal: the page is worth publishing with the charts that do exist,
    // and this is what a reference left behind by an older run looks like.
    console.warn(`No chart published for: ${missing.join(', ')} — the page references them anyway`);
  }
  if (stale.length) console.log(`Removed unreferenced: ${stale.join(', ')}`);
  if (written.length) console.log(`Updated charts: ${written.join(', ')}`);
  console.log(pageChanged ? `Updated ${path.relative(PROJECT_ROOT, PAGE_FILE)}` : 'Page already up to date');
}

update().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
