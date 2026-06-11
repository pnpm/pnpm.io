# Benchmarks of JavaScript Package Managers

**Last benchmarked at**: _Jun 11, 2026, 6:37 PM_ (_daily_ updated).

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
| install |   |   |   | 27.1s | 7.5s | 1.8s | 5.9s | 2.4s |
| install | ✔ |   |   | 7.8s | 2.9s | 940ms | 5.6s | 2.1s |
| install |   | ✔ |   | 7.2s | 6.8s | 1.7s | 3.9s | 868ms |
| install | ✔ | ✔ |   | 5.2s | 1.7s | 442ms | 3.9s | 860ms |
| install | ✔ |   | ✔ | 1.1s | 2.8s | 733ms | 5.5s | n/a |
| install |   |   | ✔ | 1.1s | 3.3s | 71ms | 5.3s | n/a |
| install |   | ✔ | ✔ | 794ms | 318ms | 61ms | 3.5s | n/a |
| install | ✔ | ✔ | ✔ | 779ms | 308ms | 62ms | 3.5s | n/a |
| update | n/a | n/a | n/a | 5.4s | 7.5s | 1.7s | 4.2s | 2.1s |

<img alt="Graph of the alotta-files results" src="/img/benchmarks/alotta-files.svg?v=63b6b022" />

### pnpm vs pnpm 🦀

pnpm v12 will use a new installation engine for fetching and linking written in Rust. See [pacquet](https://github.com/pnpm/pacquet).

| action  | cache | lockfile | node_modules| pnpm | [pnpm 🦀](https://github.com/pnpm/pacquet) |
| ---     | ---   | ---      | ---         | --- | --- |
| install |   |   |   | 7.5s | 1.8s |
| install |   | ✔ |   | 6.8s | 1.7s |
| install |   |   | ✔ | 3.3s | 71ms |
| install | ✔ |   |   | 2.9s | 940ms |
| install | ✔ |   | ✔ | 2.8s | 733ms |
| install | ✔ | ✔ |   | 1.7s | 442ms |
| install |   | ✔ | ✔ | 318ms | 61ms |
| install | ✔ | ✔ | ✔ | 308ms | 62ms |
| update | n/a | n/a | n/a | 7.5s | 1.7s |

<img alt="Graph comparing pnpm versions on the alotta-files fixture" src="/img/benchmarks/alotta-files-pnpm.svg?v=8a4b1e27" />