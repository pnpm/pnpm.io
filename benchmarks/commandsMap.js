export default {
  npm: {
    scenario: 'npm',
    legend: 'npm',
    name: 'npm',
    args: [
      'install',
      '--no-fund',
      '--no-audit',
      '--ignore-scripts',
      '--cache',
      'cache',
      '--registry',
      'https://registry.npmjs.org/',
      '--legacy-peer-deps'
    ]
  },
  pnpm: {
    scenario: 'pnpm',
    legend: 'pnpm',
    name: 'pnpm',
    args: [
      'install',
      '--ignore-scripts',
      '--store-dir',
      `cache`,
      '--registry',
      'https://registry.npmjs.org/'
    ]
  },
  yarn: {
    scenario: 'yarn',
    legend: 'Yarn Berry',
    name: 'yarn',
    args: [
      'install'
    ]
  },
  yarn_pnp: {
    scenario: 'yarn_pnp',
    legend: 'Yarn Berry PnP',
    name: 'yarn',
    args: [
      'install'
    ]
  }
}
