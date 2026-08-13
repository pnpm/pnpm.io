# Benchmarks of JavaScript Package Managers

**Last benchmarked at**: _Aug 13, 2026, 5:04 PM_ (_daily_ updated).

This benchmark compares the performance of npm, pnpm, Yarn Classic, and Yarn PnP (check [Yarn's benchmarks](https://yarnpkg.com/benchmarks) for any other Yarn modes that are not included here).

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
| install | ✔ |   | ✔ | 1.4s | 431ms | 52ms | 6.4s | n/a |
| install |   |   | ✔ | 1.4s | 499ms | 57ms | 6.5s | n/a |
| install |   | ✔ | ✔ | 1s | 394ms | 64ms | 4.6s | n/a |
| install | ✔ | ✔ | ✔ | 1s | 385ms | 14ms | 4.6s | n/a |
| update | n/a | n/a | n/a | 6.3s | 6.7s | 1s | 5.3s | 2.6s |

<img alt="Graph of the alotta-files results" src="/img/benchmarks/alotta-files.svg?v=a69d2cba" />

### pnpm vs pnpm 🦀

pnpm v12 will use a new installation engine for fetching and linking written in Rust. See [pacquet](https://github.com/pnpm/pacquet).

| action  | cache | lockfile | node_modules| pnpm | [pnpm 🦀](https://github.com/pnpm/pacquet) |
| ---     | ---   | ---      | ---         | --- | --- |
| install |   |   |   | 7.1s | 1.9s |
| install |   | ✔ |   | 5.5s | 1.8s |
| install | ✔ |   |   | 3.9s | 997ms |
| install | ✔ | ✔ |   | 1.9s | 499ms |
| install |   |   | ✔ | 499ms | 57ms |
| install | ✔ |   | ✔ | 431ms | 52ms |
| install |   | ✔ | ✔ | 394ms | 64ms |
| install | ✔ | ✔ | ✔ | 385ms | 14ms |
| update | n/a | n/a | n/a | 6.7s | 1s |

<img alt="Graph comparing pnpm versions on the alotta-files fixture" src="/img/benchmarks/alotta-files-pnpm.svg?v=7e0d2cb4" />