// Rebuilds the benchmark page from the numbers the repo that measures them
// publishes, https://github.com/pnpm/benchmarks. Nothing is measured here:
// running the benchmarks takes hours and needs a machine that is not doing
// anything else, which a site build is not.
//
// That repo publishes one file — `benchmarks.json`, the numbers together with
// the versions and the conditions they were measured under. What the page says
// about them, which columns it carries and what the charts look like are all
// decided in `scripts/benchmarks/`, so changing the wording of the page is an
// edit in this repository rather than a benchmark run in the other one.

import fs from 'node:fs';
import path from 'node:path';
import renderBenchmarksPage from './benchmarks/page.mjs';

const REPO = process.env.BENCHMARKS_REPO ?? 'pnpm/benchmarks';
const REF = process.env.BENCHMARKS_REF ?? 'main';
// A local checkout to read instead of the published one, for trying out a
// change to the page against numbers that aren't merged yet.
const LOCAL_MANIFEST = process.env.BENCHMARKS_MANIFEST;

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '..');
const PAGE_FILE = path.join(PROJECT_ROOT, 'src', 'pages', 'benchmarks.md');
const IMGS_DIR = path.join(PROJECT_ROOT, 'static', 'img', 'benchmarks');

const MANIFEST_FILE = 'benchmarks.json';

async function readManifest() {
  if (LOCAL_MANIFEST) {
    console.log(`Reading ${LOCAL_MANIFEST}`);
    return JSON.parse(fs.readFileSync(LOCAL_MANIFEST, 'utf8'));
  }
  const url = `https://raw.githubusercontent.com/${REPO}/${REF}/${MANIFEST_FILE}`;
  console.log(`Reading ${REPO}@${REF}`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Couldn't fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

function writeIfChanged(file, content) {
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === content) {
    return false;
  }
  fs.writeFileSync(file, content, 'utf8');
  return true;
}

async function update() {
  const manifest = await readManifest();
  const { markdown, charts } = renderBenchmarksPage(manifest);

  fs.mkdirSync(IMGS_DIR, { recursive: true });
  const written = [];
  for (const { name, svg } of charts) {
    if (writeIfChanged(path.join(IMGS_DIR, `${name}.svg`), svg)) written.push(name);
  }

  // A chart the page stopped drawing would otherwise be served forever.
  const drawn = new Set(charts.map(({ name }) => `${name}.svg`));
  const stale = fs.readdirSync(IMGS_DIR).filter((name) => !drawn.has(name));
  for (const name of stale) fs.rmSync(path.join(IMGS_DIR, name));

  const pageChanged = writeIfChanged(PAGE_FILE, markdown);

  if (stale.length) console.log(`Removed unreferenced: ${stale.join(', ')}`);
  if (written.length) console.log(`Updated charts: ${written.join(', ')}`);
  console.log(pageChanged ? `Updated ${path.relative(PROJECT_ROOT, PAGE_FILE)}` : 'Page already up to date');
}

update().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
