# Benchmarks of JavaScript Package Managers

**Last benchmarked at**: _Jun 2, 2026, 9:03 AM_ (_daily_ updated).

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
| install |   |   |   | 27.1s | 7.8s | 2.9s | 8.2s | 3.4s |
| install | ✔ |   |   | 12.3s | 4.2s | 1.3s | 8.1s | 2.9s |
| install |   | ✔ |   | 11s | 6.8s | 2.3s | 6s | 1.3s |
| install | ✔ | ✔ |   | 7.8s | 2.2s | 597ms | 5.8s | 1.4s |
| install | ✔ |   | ✔ | 1.7s | 3s | 1.1s | 7.8s | n/a |
| install |   |   | ✔ | 1.7s | 3.5s | 1.5s | 7.8s | n/a |
| install |   | ✔ | ✔ | 1.3s | 477ms | 68ms | 5.6s | n/a |
| install | ✔ | ✔ | ✔ | 1.2s | 482ms | 69ms | 5.7s | n/a |
| update | n/a | n/a | n/a | 6.6s | 7.5s | 2.8s | 6.3s | 3s |

<img alt="Graph of the alotta-files results" src="/img/benchmarks/alotta-files.svg?v=b719479a" />

### pnpm vs pnpm 🦀

pnpm v12 will use a new installation engine for fetching and linking written in Rust. See [pacquet](https://github.com/pnpm/pacquet).

| action  | cache | lockfile | node_modules| pnpm | [pnpm 🦀](https://github.com/pnpm/pacquet) |
| ---     | ---   | ---      | ---         | --- | --- |
| install |   |   |   | 7.8s | 2.9s |
| install |   | ✔ |   | 6.8s | 2.3s |
| install | ✔ |   |   | 4.2s | 1.3s |
| install |   |   | ✔ | 3.5s | 1.5s |
| install | ✔ |   | ✔ | 3s | 1.1s |
| install | ✔ | ✔ |   | 2.2s | 597ms |
| install | ✔ | ✔ | ✔ | 482ms | 69ms |
| install |   | ✔ | ✔ | 477ms | 68ms |
| update | n/a | n/a | n/a | 7.5s | 2.8s |

<img alt="Graph comparing pnpm versions on the alotta-files fixture" src="/img/benchmarks/alotta-files-pnpm.svg?v=a855b553" />