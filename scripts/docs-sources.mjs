import { readFileSync } from 'node:fs'
import path from 'node:path'

export const currentDocsVersion = '12.x'

export const docsSourcePaths = {
  '11.x': 'pnpm11/docs',
  '12.x': 'pnpm/docs',
  pnpr: 'pnpr/docs',
}

export function readDocsVersions (site) {
  const versions = JSON.parse(readFileSync(path.join(site, 'versions.json'), 'utf8'))
  if (versions[0] !== currentDocsVersion) {
    throw new Error(`Freeze ${currentDocsVersion} documentation and update the source mapping before changing the latest version`)
  }
  return versions
}
