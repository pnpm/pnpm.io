export default {
  npm: {
    scenario: 'npm',
    legend: 'npm',
    color: '#cd3731',
    name: 'npm',
    args: [
      'install',
      '--no-fund',
      '--no-audit',
      '--ignore-scripts',
      '--cache=cache',
      '--registry=https://registry.npmjs.org/',
      '--legacy-peer-deps',
      // npm CLI fails on the benchmarks with this option. So, commenting out for now.
      // '--install-strategy=linked',
    ]
  },
  pnpm11: {
    scenario: 'pnpm11',
    legend: 'pnpm',
    color: '#fbae00',
    name: 'pnpm',
    args: [
      'install',
      '--ignore-scripts',
      '--store-dir=cache/store',
      '--cache-dir=cache/cache',
      '--registry=https://registry.npmjs.org/',
      '--no-strict-peer-dependencies',
      '--config.auto-install-peers=false',
      '--config.resolution-mode=highest',
    ]
  },
  pnpm12: {
    scenario: 'pnpm12',
    legend: 'pnpm 🦀',
    mdLegend: '[pnpm 🦀](https://github.com/pnpm/pacquet)',
    color: '#fbae00',
    displayVersion: '12',
    name: 'pacquet',
    args: [
      'install',
      '--frozen-lockfile',
    ]
  },
  yarn: {
    scenario: 'yarn',
    legend: 'Yarn',
    color: '#248ebd',
    name: 'yarn',
    args: [
      'install'
    ]
  },
  yarn_pnp: {
    scenario: 'yarn_pnp',
    legend: 'Yarn PnP',
    color: '#40a9ff',
    name: 'yarn',
    args: [
      'install'
    ]
  }
}
