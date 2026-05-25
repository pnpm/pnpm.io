# Benchmarks of JavaScript Package Managers

**Last benchmarked at**: _May 25, 2026, 5:03 PM_ (_daily_ updated).

This benchmark compares the performance of npm, pnpm, Yarn Classic, and Yarn PnP (check [Yarn's benchmarks](https://yarnpkg.com/benchmarks) for any other Yarn modes that are not included here).

Each row's label lists which of `cache`, `lockfile`, and `node_modules` are warm/present before install runs. Quick mapping to the real world (ordered from slowest to fastest scenario):

- `clean`: a brand-new clone — nothing cached, no lockfile, no `node_modules`.
- `cache`: a developer reinstalling without a lockfile.
- `lockfile`: a CI server doing its first install.
- `cache+lockfile`: a developer reinstalling a known project.
- `node_modules`: the cache and lockfile are deleted and install is run again.
- `cache+node_modules`: the lockfile is deleted and install is run again.
- `cache+lockfile+node_modules`: re-running install when nothing has changed.
- `lockfile+node_modules`: the cache is deleted and install is run again.
- `update`: dependency versions are bumped in `package.json` and install is run again.

## Lots of Files

The app's `package.json` [here](https://github.com/pnpm/pnpm.io/blob/main/benchmarks/fixtures/alotta-files/package.json)

| action  | cache | lockfile | node_modules| npm | pnpm | [pnpm 🦀](https://github.com/pnpm/pacquet) | Yarn | Yarn PnP |
| ---     | ---   | ---      | ---         | --- | --- | --- | --- | --- |
| install |   |   |   | 27.6s | 7.3s | 3.1s | 7.1s | 2.9s |
| install | ✔ |   |   | 10.9s | 3.8s | 1.2s | 6.8s | 2.4s |
| install |   | ✔ |   | 9.8s | 6.5s | 2.6s | 5.1s | 1.1s |
| install | ✔ | ✔ |   | 7.1s | 2s | 561ms | 5s | 1.1s |
| install |   |   | ✔ | 1.5s | 7.1s | 3s | 6.4s | n/a |
| install | ✔ |   | ✔ | 1.5s | 5.1s | 953ms | 6.4s | n/a |
| install | ✔ | ✔ | ✔ | 1s | 462ms | 95ms | 4.5s | n/a |
| install |   | ✔ | ✔ | 1s | 467ms | 94ms | 4.5s | n/a |
| update | n/a | n/a | n/a | 6.5s | 3.6s | 1.1s | 5.1s | 2.5s |

<img alt="Graph of the alotta-files results" src="/img/benchmarks/alotta-files.svg?v=323e0d02" />

### pnpm vs pnpm 🦀

pnpm v12 will use a new installation engine for fetching and linking written in Rust. See [pacquet](https://github.com/pnpm/pacquet).

| action  | cache | lockfile | node_modules| pnpm | [pnpm 🦀](https://github.com/pnpm/pacquet) |
| ---     | ---   | ---      | ---         | --- | --- |
| install |   |   |   | 7.3s | 3.1s |
| install |   |   | ✔ | 7.1s | 3s |
| install |   | ✔ |   | 6.5s | 2.6s |
| install | ✔ |   | ✔ | 5.1s | 953ms |
| install | ✔ |   |   | 3.8s | 1.2s |
| install | ✔ | ✔ |   | 2s | 561ms |
| install |   | ✔ | ✔ | 467ms | 94ms |
| install | ✔ | ✔ | ✔ | 462ms | 95ms |
| update | n/a | n/a | n/a | 3.6s | 1.1s |

<img alt="Graph comparing pnpm versions on the alotta-files fixture" src="/img/benchmarks/alotta-files-pnpm.svg?v=30cdb26b" />
