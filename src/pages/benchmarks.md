# Benchmarks of JavaScript Package Managers

**Last benchmarked at**: _Jun 10, 2026, 2:38 PM_ (_daily_ updated).

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
| install |   |   |   | 27.1s | 8s | 3.8s | 5.9s | 2.4s |
| install | ✔ |   |   | 7.8s | 2.9s | 1.4s | 5.6s | 2.1s |
| install |   | ✔ |   | 7.2s | 8s | 2.9s | 3.9s | 868ms |
| install | ✔ | ✔ |   | 5.2s | 1.7s | 570ms | 3.9s | 860ms |
| install | ✔ |   | ✔ | 1.1s | 3.6s | 1s | 5.5s | n/a |
| install |   |   | ✔ | 1.1s | 3.8s | 2.4s | 5.3s | n/a |
| install |   | ✔ | ✔ | 794ms | 318ms | 48ms | 3.5s | n/a |
| install | ✔ | ✔ | ✔ | 779ms | 308ms | 50ms | 3.5s | n/a |
| update | n/a | n/a | n/a | 5.4s | 8.3s | 3.3s | 4.2s | 2.1s |

<img alt="Graph of the alotta-files results" src="/img/benchmarks/alotta-files.svg?v=21f3f4eb" />

### pnpm vs pnpm 🦀

pnpm v12 will use a new installation engine for fetching and linking written in Rust. See [pacquet](https://github.com/pnpm/pacquet).

| action  | cache | lockfile | node_modules| pnpm | [pnpm 🦀](https://github.com/pnpm/pacquet) |
| ---     | ---   | ---      | ---         | --- | --- |
| install |   |   |   | 8s | 3.8s |
| install |   | ✔ |   | 8s | 2.9s |
| install |   |   | ✔ | 3.8s | 2.4s |
| install | ✔ |   | ✔ | 3.6s | 1s |
| install | ✔ |   |   | 2.9s | 1.4s |
| install | ✔ | ✔ |   | 1.7s | 570ms |
| install |   | ✔ | ✔ | 318ms | 48ms |
| install | ✔ | ✔ | ✔ | 308ms | 50ms |
| update | n/a | n/a | n/a | 8.3s | 3.3s |

<img alt="Graph comparing pnpm versions on the alotta-files fixture" src="/img/benchmarks/alotta-files-pnpm.svg?v=06cc49be" />