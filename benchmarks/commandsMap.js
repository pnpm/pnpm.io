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
      '--cache=cache',
      '--registry=https://registry.npmjs.org/',
      '--legacy-peer-deps',
      // npm CLI fails on the benchmarks with this option. So, commenting out for now.
      // '--install-strategy=linked',
    ]
  },
  npm_linked: {
    scenario: 'npm_linked',
    legend: 'npm linked',
    name: 'npm',
    args: [
      'install',
      '--install-strategy=linked',
      '--no-fund',
      '--no-audit',
      '--ignore-scripts',
      '--cache=cache',
      '--registry=https://registry.npmjs.org/',
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
      '--store-dir=cache/store',
      '--cache-dir=cache/cache',
      '--registry=https://registry.npmjs.org/',
      '--no-strict-peer-dependencies',
      '--config.auto-install-peers=false',
      '--config.resolution-mode=highest',
    ]
  },
  yarn: {
    scenario: 'yarn',
    legend: 'Yarn',
    name: 'yarn',
    args: [
      'install'
    ]
  },
  yarn_pnp: {
    scenario: 'yarn_pnp',
    legend: 'Yarn PnP',
    name: 'yarn',
    args: [
      'install'
    ]
  }
}
