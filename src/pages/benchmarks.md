# Benchmarks of JavaScript Package Managers

**Last benchmarked at**: _Jun 6, 2026, 10:05 PM_ (_daily_ updated).

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
| install |   |   |   | 27.1s | 7.4s | 3.6s | 8.2s | 3.4s |
| install | ✔ |   |   | 12.3s | 4s | 1.7s | 8.1s | 2.9s |
| install |   | ✔ |   | 11s | 6.6s | 2.5s | 5.9s | 1.3s |
| install | ✔ | ✔ |   | 7.8s | 2.1s | 639ms | 5.8s | 1.3s |
| install |   |   | ✔ | 1.6s | 3.3s | 1.9s | 7.7s | n/a |
| install | ✔ |   | ✔ | 1.6s | 2.8s | 1.5s | 7.7s | n/a |
| install | ✔ | ✔ | ✔ | 1.2s | 471ms | 72ms | 5.5s | n/a |
| install |   | ✔ | ✔ | 1.2s | 476ms | 73ms | 5.6s | n/a |
| update | n/a | n/a | n/a | 6.5s | 7.4s | 2.5s | 6.2s | 2.9s |

<img alt="Graph of the alotta-files results" src="/img/benchmarks/alotta-files.svg?v=d4df74a0" />

### pnpm vs pnpm 🦀

pnpm v12 will use a new installation engine for fetching and linking written in Rust. See [pacquet](https://github.com/pnpm/pacquet).

| action  | cache | lockfile | node_modules| pnpm | [pnpm 🦀](https://github.com/pnpm/pacquet) |
| ---     | ---   | ---      | ---         | --- | --- |
| install |   |   |   | 7.4s | 3.6s |
| install |   | ✔ |   | 6.6s | 2.5s |
| install | ✔ |   |   | 4s | 1.7s |
| install |   |   | ✔ | 3.3s | 1.9s |
| install | ✔ |   | ✔ | 2.8s | 1.5s |
| install | ✔ | ✔ |   | 2.1s | 639ms |
| install |   | ✔ | ✔ | 476ms | 73ms |
| install | ✔ | ✔ | ✔ | 471ms | 72ms |
| update | n/a | n/a | n/a | 7.4s | 2.5s |

<img alt="Graph comparing pnpm versions on the alotta-files fixture" src="/img/benchmarks/alotta-files-pnpm.svg?v=688b4967" />