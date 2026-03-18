import fs from 'node:fs';
import path from 'node:path';

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '..');
const LOGOS_DIR = path.join(PROJECT_ROOT, 'static', 'img', 'users');
const SPONSORS_FILE = path.join(PROJECT_ROOT, 'sponsors.json');

const BASE_URL = 'https://pnpm.io/img/users';

const TIER_CONFIG = {
  platinum: { columns: 1, heading: 'Platinum Sponsors' },
  gold: { columns: 3, heading: 'Gold Sponsors' },
  silver: { columns: 3, heading: 'Silver Sponsors' },
};

const ALT_EXTENSIONS = ['.svg', '.png', '.jpg', '.jpeg'];

function addUTM(urlStr, medium) {
  const url = new URL(urlStr);
  url.searchParams.set('utm_source', 'pnpm');
  url.searchParams.set('utm_medium', medium);
  return url.toString();
}

/**
 * Try to find a file with the given base name, trying the preferred extension
 * first, then alternative extensions. Returns the filename or null.
 */
function findFile(baseName, preferredExt) {
  const exts = [preferredExt, ...ALT_EXTENSIONS.filter(e => e !== preferredExt)];
  for (const ext of exts) {
    const filename = baseName + ext;
    if (fs.existsSync(path.join(LOGOS_DIR, filename))) return filename;
  }
  return null;
}

/**
 * Strip the _min suffix from a logo filename to get the full-size version.
 * Returns the non-min filename if it exists on disk, otherwise the original.
 */
function stripMin(logoFilename) {
  const ext = path.extname(logoFilename);
  const base = path.basename(logoFilename, ext);
  if (!base.endsWith('_min')) return logoFilename;

  const fullBase = base.replace(/_min$/, '');
  return findFile(fullBase, ext) || logoFilename;
}

/**
 * For a given logo filename, find the best variant for a given theme suffix.
 * Returns the filename (not full path) or null if no variant found.
 */
function findVariant(logoFilename, suffix) {
  const ext = path.extname(logoFilename);
  const base = path.basename(logoFilename, ext);

  // Try exact: base_suffix with same or alternative extensions
  const found = findFile(`${base}_${suffix}`, ext);
  if (found) return found;

  // Try stripping _min: baseNoMin_suffix
  const baseNoMin = base.replace(/_min$/, '');
  if (baseNoMin !== base) {
    const fallback = findFile(`${baseNoMin}_${suffix}`, ext);
    if (fallback) return fallback;
  }

  return null;
}

/**
 * Resolve logo filenames for light and dark GitHub themes.
 * Uses the full-size (non-min) logo for the README.
 */
function resolveLogos(logoFilename) {
  const fullLogo = stripMin(logoFilename);

  // For dark backgrounds: prefer _light variant
  const darkVariant = findVariant(fullLogo, 'light');
  // For light backgrounds: prefer _dark variant
  const lightVariant = findVariant(fullLogo, 'dark');

  return {
    light: lightVariant || fullLogo,
    dark: darkVariant || fullLogo,
  };
}

function renderSponsorCell(sponsor, utmMedium) {
  const url = addUTM(sponsor.url, utmMedium);
  const width = sponsor.readmeWidth || sponsor.width;
  const alt = sponsor.alt || sponsor.name;

  if (sponsor.emoji) {
    return [
      `      <td align="center" valign="middle">`,
      `        <a href="${url}" target="_blank">${sponsor.emoji} ${sponsor.name}</a>`,
      `      </td>`,
    ].join('\n');
  }

  const logos = resolveLogos(sponsor.logo);
  const hasDarkVariant = logos.light !== logos.dark;

  if (hasDarkVariant) {
    return [
      `      <td align="center" valign="middle">`,
      `        <a href="${url}" target="_blank">`,
      `          <picture>`,
      `            <source media="(prefers-color-scheme: light)" srcset="${BASE_URL}/${logos.light}" />`,
      `            <source media="(prefers-color-scheme: dark)" srcset="${BASE_URL}/${logos.dark}" />`,
      `            <img src="${BASE_URL}/${logos.light}" width="${width}" alt="${alt}" />`,
      `          </picture>`,
      `        </a>`,
      `      </td>`,
    ].join('\n');
  }

  return [
    `      <td align="center" valign="middle">`,
    `        <a href="${url}" target="_blank"><img src="${BASE_URL}/${logos.light}" width="${width}" alt="${alt}"></a>`,
    `      </td>`,
  ].join('\n');
}

function renderTier(tierName, sponsors, utmMedium) {
  const config = TIER_CONFIG[tierName];
  const lines = [];

  lines.push(`## ${config.heading}`);
  lines.push('');
  lines.push('<table>');
  lines.push('  <tbody>');

  for (let i = 0; i < sponsors.length; i += config.columns) {
    const row = sponsors.slice(i, i + config.columns);
    lines.push('    <tr>');
    for (const sponsor of row) {
      lines.push(renderSponsorCell(sponsor, utmMedium));
    }
    lines.push('    </tr>');
  }

  lines.push('  </tbody>');
  lines.push('</table>');

  return lines.join('\n');
}

function generateMarkdown(sponsors, { tiers = ['platinum', 'gold', 'silver'], utmMedium = 'readme' } = {}) {
  const sections = [];
  for (const tier of tiers) {
    if (sponsors[tier] && sponsors[tier].length > 0) {
      sections.push(renderTier(tier, sponsors[tier], utmMedium));
    }
  }
  return sections.join('\n\n');
}

function updateFileMarkers(filePath, content, startMarker = '<!-- sponsors -->', endMarker = '<!-- sponsors end -->') {
  const absPath = path.resolve(filePath);
  const file = fs.readFileSync(absPath, 'utf-8');

  const startIdx = file.indexOf(startMarker);
  const endIdx = file.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    console.error(`Could not find ${startMarker} and ${endMarker} markers in ${absPath}`);
    process.exit(1);
  }

  const before = file.slice(0, startIdx + startMarker.length);
  const after = file.slice(endIdx);
  const updated = `${before}\n\n${content}\n\n${after}`;

  fs.writeFileSync(absPath, updated);
  console.log(`Updated sponsors in ${absPath}`);
}

function generate() {
  const sponsors = JSON.parse(fs.readFileSync(SPONSORS_FILE, 'utf-8'));
  const pnpmRoot = process.argv[2];

  if (!pnpmRoot) {
    console.error('Usage: node generate-sponsors.mjs <path-to-pnpm-repo-root>');
    process.exit(1);
  }

  const absPnpmRoot = path.resolve(pnpmRoot);

  // READMEs — all tiers
  const readmeMarkdown = generateMarkdown(sponsors);
  updateFileMarkers(path.join(absPnpmRoot, 'README.md'), readmeMarkdown);
  updateFileMarkers(path.join(absPnpmRoot, 'pnpm/README.md'), readmeMarkdown);

  // Release text generator — platinum + gold only
  const releaseTextPath = path.join(absPnpmRoot, '__utils__/get-release-text/src/main.ts');
  const releaseMarkdown = generateMarkdown(sponsors, {
    tiers: ['platinum', 'gold'],
    utmMedium: 'release_notes',
  });
  updateFileMarkers(releaseTextPath, releaseMarkdown);
}

generate();
