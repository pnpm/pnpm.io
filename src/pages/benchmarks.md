# Benchmarks of JavaScript Package Managers

**Last benchmarked at**: _Aug 13, 2026, 7:44 PM_ (_daily_ updated).

This benchmark compares the performance of npm, pnpm, Yarn Classic, and Yarn PnP (check [Yarn's benchmarks](https://yarnpkg.com/benchmarks) for any other Yarn modes that are not included here). It also compares how fast pnpm, fnm, and nvm install and switch Node.js versions.

Each row's label lists which of `cache`, `lockfile`, and `node_modules` are warm/present before install runs. Quick mapping to the real world (ordered from slowest to fastest scenario):

- `clean`: a brand-new clone — nothing cached, no lockfile, no `node_modules`.
- `cache`: a developer reinstalling without a lockfile.
- `lockfile`: a CI server doing its first install.
- `cache+lockfile`: a developer reinstalling a known project.
- `cache+node_modules`: the lockfile is deleted and install is run again.
- `node_modules`: the cache and lockfile are deleted and install is run again.
- `lockfile+node_modules`: the cache is deleted and install is run again.
- `cache+lockfile+node_modules`: re-running install when nothing has changed.
- `update`: dependency versions are bumped in `package.json` and install is run again.

## Lots of Files

The app's `package.json` [here](https://github.com/pnpm/pnpm.io/blob/main/benchmarks/fixtures/alotta-files/package.json)

| action  | cache | lockfile | node_modules| npm | pnpm | [pnpm 🦀](https://github.com/pnpm/pacquet) | Yarn | Yarn PnP |
| ---     | ---   | ---      | ---         | --- | --- | --- | --- | --- |
| install |   |   |   | 27.3s | 7.1s | 1.9s | 6.9s | 2.9s |
| install | ✔ |   |   | 10.8s | 3.9s | 997ms | 6.9s | 2.5s |
| install |   | ✔ |   | 10.2s | 5.5s | 1.8s | 5.1s | 1.1s |
| install | ✔ | ✔ |   | 6.6s | 1.9s | 499ms | 5.1s | 1.1s |
| install | ✔ |   | ✔ | 1.4s | 429ms | 45ms | 6.4s | n/a |
| install |   |   | ✔ | 1.4s | 460ms | 57ms | 6.5s | n/a |
| install |   | ✔ | ✔ | 1s | 394ms | 56ms | 4.6s | n/a |
| install | ✔ | ✔ | ✔ | 1s | 385ms | 13ms | 4.6s | n/a |
| update | n/a | n/a | n/a | 6.3s | 6.7s | 1s | 5.3s | 2.6s |

<img alt="Graph of the alotta-files results" src="/img/benchmarks/alotta-files.svg?v=5bf97150" />

### pnpm vs pnpm 🦀

pnpm v12 will use a new installation engine for fetching and linking written in Rust. See [pacquet](https://github.com/pnpm/pacquet).

| action  | cache | lockfile | node_modules| pnpm | [pnpm 🦀](https://github.com/pnpm/pacquet) |
| ---     | ---   | ---      | ---         | --- | --- |
| install |   |   |   | 7.1s | 1.9s |
| install |   | ✔ |   | 5.5s | 1.8s |
| install | ✔ |   |   | 3.9s | 997ms |
| install | ✔ | ✔ |   | 1.9s | 499ms |
| install |   |   | ✔ | 460ms | 57ms |
| install | ✔ |   | ✔ | 429ms | 45ms |
| install |   | ✔ | ✔ | 394ms | 56ms |
| install | ✔ | ✔ | ✔ | 385ms | 13ms |
| update | n/a | n/a | n/a | 6.7s | 1s |

<img alt="Graph comparing pnpm versions on the alotta-files fixture" src="/img/benchmarks/alotta-files-pnpm.svg?v=d6f45224" />

## Node.js Version Management

pnpm installs and switches Node.js versions itself, so a separate version manager is not needed. This section compares [`pnpm runtime set node`](/cli/runtime) with fnm and nvm.

| scenario | pnpm 12 | fnm | nvm |
| ---      | --- | --- | --- |
| install Node.js 24 with nothing cached | 1s | 2.3s | 3.1s |
| install Node.js 24 that was installed before | 259ms | 2.4s | 2.8s |
| run `node` in a project pinned to Node.js 22 | 9ms | 5ms | 101ms |

<img alt="Graph comparing Node.js version managers on installing Node.js" src="/img/benchmarks/node-versions.svg?v=25aad00a" />

A few things to keep in mind when reading these numbers:

- pnpm keeps Node.js in its content-addressable store and nvm keeps the downloaded tarballs in `$NVM_DIR/.cache`, so for both of them installing a version that was installed before needs no download. fnm has no download cache and fetches Node.js again.
- pnpm doesn't extract the `npm`, `npx`, and `corepack` binaries bundled with Node.js, so on a clean install it downloads and writes fewer files than the other two.
- Per-project switching costs no command at all in pnpm: the `node` on your PATH is a shim that reads the [`devEngines.runtime`](/package_json#devenginesruntime) of the project and runs the matching version. fnm and nvm read a `.node-version` or `.nvmrc` file through a shell hook that fires on `cd`, which is what `fnm exec` and `nvm use` measure in that row. Loading nvm into the shell in the first place is not counted at all here, and it costs more than everything in that row.
- All three have to materialize the pinned version the first time a project asks for it: pnpm links it from its store, fnm downloads it, nvm unpacks it. The row measures the repeated runs after that.