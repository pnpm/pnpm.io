# Benchmarks of JavaScript Package Managers

**Last benchmarked at**: _Jun 14, 2026, 3:53 AM_ (_daily_ updated).

This benchmark compares the performance of npm, pnpm, Yarn Classic, and Yarn PnP (check [Yarn's benchmarks](https://yarnpkg.com/benchmarks) for any other Yarn modes that are not included here).

Each row's label lists which of `cache`, `lockfile`, and `node_modules` are warm/present before install runs. Quick mapping to the real world (ordered from slowest to fastest scenario):

- `clean`: a brand-new clone — nothing cached, no lockfile, no `node_modules`.
- `cache`: a developer reinstalling without a lockfile.
- `lockfile`: a CI server doing its first install.
- `cache+lockfile`: a developer reinstalling a known project.
- `cache+node_modules`: the lockfile is deleted and install is run again.
- `node_modules`: the cache and lockfile are deleted and install is run again.
- `cache+lockfile+node_modules`: re-running install when nothing has changed.
- `lockfile+node_modules`: the cache is deleted and install is run again.
- `update`: dependency versions are bumped in `package.json` and install is run again.

## Lots of Files

The app's `package.json` [here](https://github.com/pnpm/pnpm.io/blob/main/benchmarks/fixtures/alotta-files/package.json)

| action  | cache | lockfile | node_modules| npm | pnpm | [pnpm 🦀](https://github.com/pnpm/pacquet) | Yarn | Yarn PnP |
| ---     | ---   | ---      | ---         | --- | --- | --- | --- | --- |
| install |   |   |   | 28.6s | 7.1s | 2s | 5.9s | 2.4s |
| install | ✔ |   |   | 13.9s | 4.1s | 1.2s | 5.6s | 2.1s |
| install |   | ✔ |   | 12.3s | 6s | 1.8s | 3.9s | 868ms |
| install | ✔ | ✔ |   | 8.8s | 2.2s | 537ms | 3.9s | 860ms |
| install | ✔ |   | ✔ | 1.7s | 558ms | 975ms | 5.5s | n/a |
| install |   |   | ✔ | 1.7s | 579ms | 74ms | 5.3s | n/a |
| install | ✔ | ✔ | ✔ | 1.3s | 509ms | 37ms | 3.5s | n/a |
| install |   | ✔ | ✔ | 1.3s | 521ms | 40ms | 3.5s | n/a |
| update | n/a | n/a | n/a | 6.3s | 7.8s | 1.8s | 4.2s | 2.1s |

<img alt="Graph of the alotta-files results" src="/img/benchmarks/alotta-files.svg?v=16591e76" />

### pnpm vs pnpm 🦀

pnpm v12 will use a new installation engine for fetching and linking written in Rust. See [pacquet](https://github.com/pnpm/pacquet).

| action  | cache | lockfile | node_modules| pnpm | [pnpm 🦀](https://github.com/pnpm/pacquet) |
| ---     | ---   | ---      | ---         | --- | --- |
| install |   |   |   | 7.1s | 2s |
| install |   | ✔ |   | 6s | 1.8s |
| install | ✔ |   |   | 4.1s | 1.2s |
| install | ✔ | ✔ |   | 2.2s | 537ms |
| install |   |   | ✔ | 579ms | 74ms |
| install | ✔ |   | ✔ | 558ms | 975ms |
| install |   | ✔ | ✔ | 521ms | 40ms |
| install | ✔ | ✔ | ✔ | 509ms | 37ms |
| update | n/a | n/a | n/a | 7.8s | 1.8s |

<img alt="Graph comparing pnpm versions on the alotta-files fixture" src="/img/benchmarks/alotta-files-pnpm.svg?v=0c2f94fe" />