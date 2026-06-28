# Benchmarks of JavaScript Package Managers

**Last benchmarked at**: _Jun 28, 2026, 3:52 AM_ (_daily_ updated).

This benchmark compares the performance of npm, pnpm, Yarn Classic, and Yarn PnP (check [Yarn's benchmarks](https://yarnpkg.com/benchmarks) for any other Yarn modes that are not included here).

Each row's label lists which of `cache`, `lockfile`, and `node_modules` are warm/present before install runs. Quick mapping to the real world (ordered from slowest to fastest scenario):

- `clean`: a brand-new clone — nothing cached, no lockfile, no `node_modules`.
- `cache`: a developer reinstalling without a lockfile.
- `lockfile`: a CI server doing its first install.
- `cache+lockfile`: a developer reinstalling a known project.
- `node_modules`: the cache and lockfile are deleted and install is run again.
- `cache+node_modules`: the lockfile is deleted and install is run again.
- `lockfile+node_modules`: the cache is deleted and install is run again.
- `cache+lockfile+node_modules`: re-running install when nothing has changed.
- `update`: dependency versions are bumped in `package.json` and install is run again.

## Lots of Files

The app's `package.json` [here](https://github.com/pnpm/pnpm.io/blob/main/benchmarks/fixtures/alotta-files/package.json)

| action  | cache | lockfile | node_modules| npm | pnpm | [pnpm 🦀](https://github.com/pnpm/pacquet) | Yarn | Yarn PnP |
| ---     | ---   | ---      | ---         | --- | --- | --- | --- | --- |
| install |   |   |   | 25.2s | 7.1s | 2.3s | 7s | 2.7s |
| install | ✔ |   |   | 10.7s | 4.3s | 1.3s | 7s | 2.3s |
| install |   | ✔ |   | 9.8s | 5.6s | 1.9s | 5s | 1s |
| install | ✔ | ✔ |   | 7s | 2.3s | 605ms | 5.4s | 1.1s |
| install |   |   | ✔ | 1.3s | 476ms | 76ms | 6.3s | n/a |
| install | ✔ |   | ✔ | 1.3s | 432ms | 75ms | 6.3s | n/a |
| install |   | ✔ | ✔ | 1s | 400ms | 89ms | 4.6s | n/a |
| install | ✔ | ✔ | ✔ | 1s | 394ms | 41ms | 4.5s | n/a |
| update | n/a | n/a | n/a | 5.5s | 6.7s | 2.1s | 5.1s | 2.3s |

<img alt="Graph of the alotta-files results" src="/img/benchmarks/alotta-files.svg?v=2980ed1c" />

### pnpm vs pnpm 🦀

pnpm v12 will use a new installation engine for fetching and linking written in Rust. See [pacquet](https://github.com/pnpm/pacquet).

| action  | cache | lockfile | node_modules| pnpm | [pnpm 🦀](https://github.com/pnpm/pacquet) |
| ---     | ---   | ---      | ---         | --- | --- |
| install |   |   |   | 7.1s | 2.3s |
| install |   | ✔ |   | 5.6s | 1.9s |
| install | ✔ |   |   | 4.3s | 1.3s |
| install | ✔ | ✔ |   | 2.3s | 605ms |
| install |   |   | ✔ | 476ms | 76ms |
| install | ✔ |   | ✔ | 432ms | 75ms |
| install |   | ✔ | ✔ | 400ms | 89ms |
| install | ✔ | ✔ | ✔ | 394ms | 41ms |
| update | n/a | n/a | n/a | 6.7s | 2.1s |

<img alt="Graph comparing pnpm versions on the alotta-files fixture" src="/img/benchmarks/alotta-files-pnpm.svg?v=0b1a77c0" />