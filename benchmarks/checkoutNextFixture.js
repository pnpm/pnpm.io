import fs from 'fs'
import path from 'path'
import spawn from 'cross-spawn'

const NEXT_COMMIT = '31b78bbed91c538e6cf196faad0a37afdfae7e70'

export default async function checkoutNextFixture (fixtureDir) {
  await fs.promises.mkdir(fixtureDir, { recursive: true })
  runGit(fixtureDir, ['init'])
  runGit(fixtureDir, ['remote', 'add', 'origin', 'https://github.com/vercel/next.js.git'])
  runGit(fixtureDir, ['sparse-checkout', 'init', '--no-cone'])
  runGit(fixtureDir, [
    'sparse-checkout',
    'set',
    '--no-cone',
    '/package.json',
    '/pnpm-lock.yaml',
    '/pnpm-workspace.yaml',
    '/.npmrc',
    '/patches/',
    '**/package.json',
  ])
  runGit(fixtureDir, ['fetch', '--depth=1', '--filter=blob:none', 'origin', NEXT_COMMIT])
  runGit(fixtureDir, ['checkout', '--detach', 'FETCH_HEAD'])
  await fs.promises.rm(`${fixtureDir}/.git`, { recursive: true })
  await removeEmptyDirectories(fixtureDir)
  await migrateSettings(fixtureDir)
}

function runGit (cwd, args) {
  const result = spawn.sync('git', args, { cwd, stdio: 'inherit' })
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed with exit code ${result.status}`)
  }
}

async function removeEmptyDirectories (dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isDirectory()) {
      await removeEmptyDirectories(`${dir}/${entry.name}`)
    }
  }
  if ((await fs.promises.readdir(dir)).length === 0) {
    await fs.promises.rmdir(dir)
  }
}

async function migrateSettings (fixtureDir) {
  const manifestPath = path.join(fixtureDir, 'package.json')
  const workspacePath = path.join(fixtureDir, 'pnpm-workspace.yaml')
  const manifest = JSON.parse(await fs.promises.readFile(manifestPath, 'utf8'))
  const settings = manifest.pnpm
  delete manifest.pnpm
  await fs.promises.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
  await fs.promises.appendFile(workspacePath, [
    '',
    'linkWorkspacePackages: true',
    `overrides: ${JSON.stringify(settings.overrides)}`,
    `packageExtensions: ${JSON.stringify(settings.packageExtensions)}`,
    `patchedDependencies: ${JSON.stringify(settings.patchedDependencies)}`,
    'strictDepBuilds: false',
    '',
  ].join('\n'))
}
