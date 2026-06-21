# Benchmarks of JavaScript Package Managers

**Last benchmarked at**: _Jun 21, 2026, 3:56 AM_ (_daily_ updated).

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
| install |   |   |   | 28.6s | 7.7s | 2.1s | 8.2s | 3.4s |
| install | ✔ |   |   | 13.1s | 4.5s | 1.3s | 8s | 2.9s |
| install |   | ✔ |   | 11.6s | 6.3s | 1.9s | 6s | 1.3s |
| install | ✔ | ✔ |   | 8.5s | 2.1s | 596ms | 5.8s | 1.3s |
| install | ✔ |   | ✔ | 1.6s | 552ms | 1s | 7.8s | n/a |
| install |   |   | ✔ | 1.6s | 556ms | 76ms | 7.7s | n/a |
| install | ✔ | ✔ | ✔ | 1.2s | 493ms | 41ms | 5.6s | n/a |
| install |   | ✔ | ✔ | 1.2s | 509ms | 42ms | 5.5s | n/a |
| update | n/a | n/a | n/a | 6.3s | 7.9s | 1.9s | 6.3s | 2.9s |

<img alt="Graph of the alotta-files results" src="/img/benchmarks/alotta-files.svg?v=e2a1b926" />

### pnpm vs pnpm 🦀

pnpm v12 will use a new installation engine for fetching and linking written in Rust. See [pacquet](https://github.com/pnpm/pacquet).

| action  | cache | lockfile | node_modules| pnpm | [pnpm 🦀](https://github.com/pnpm/pacquet) |
| ---     | ---   | ---      | ---         | --- | --- |
| install |   |   |   | 7.7s | 2.1s |
| install |   | ✔ |   | 6.3s | 1.9s |
| install | ✔ |   |   | 4.5s | 1.3s |
| install | ✔ | ✔ |   | 2.1s | 596ms |
| install |   |   | ✔ | 556ms | 76ms |
| install | ✔ |   | ✔ | 552ms | 1s |
| install |   | ✔ | ✔ | 509ms | 42ms |
| install | ✔ | ✔ | ✔ | 493ms | 41ms |
| update | n/a | n/a | n/a | 7.9s | 1.9s |

<img alt="Graph comparing pnpm versions on the alotta-files fixture" src="/img/benchmarks/alotta-files-pnpm.svg?v=9465c75a" />