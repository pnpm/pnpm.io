# Benchmarks of JavaScript Package Managers

**Last benchmarked at**: _Jul 19, 2026, 5:43 AM_ (_daily_ updated).

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
| install |   |   |   | 22.7s | 7.5s | 2.2s | 6.9s | 2.7s |
| install | ✔ |   |   | 10.8s | 4.3s | 1.3s | 6.7s | 2.2s |
| install |   | ✔ |   | 9.7s | 5.9s | 1.8s | 4.9s | 1s |
| install | ✔ | ✔ |   | 7.1s | 2s | 515ms | 4.9s | 1s |
| install | ✔ |   | ✔ | 1.3s | 538ms | 45ms | 6.3s | n/a |
| install |   |   | ✔ | 1.3s | 548ms | 51ms | 6.2s | n/a |
| install | ✔ | ✔ | ✔ | 1s | 485ms | 12ms | 4.5s | n/a |
| install |   | ✔ | ✔ | 1s | 498ms | 56ms | 4.5s | n/a |
| update | n/a | n/a | n/a | 5.1s | 7.3s | 2.1s | 5s | 2.3s |

<img alt="Graph of the alotta-files results" src="/img/benchmarks/alotta-files.svg?v=0dfc7630" />

### pnpm vs pnpm 🦀

pnpm v12 will use a new installation engine for fetching and linking written in Rust. See [pacquet](https://github.com/pnpm/pacquet).

| action  | cache | lockfile | node_modules| pnpm | [pnpm 🦀](https://github.com/pnpm/pacquet) |
| ---     | ---   | ---      | ---         | --- | --- |
| install |   |   |   | 7.5s | 2.2s |
| install |   | ✔ |   | 5.9s | 1.8s |
| install | ✔ |   |   | 4.3s | 1.3s |
| install | ✔ | ✔ |   | 2s | 515ms |
| install |   |   | ✔ | 548ms | 51ms |
| install | ✔ |   | ✔ | 538ms | 45ms |
| install |   | ✔ | ✔ | 498ms | 56ms |
| install | ✔ | ✔ | ✔ | 485ms | 12ms |
| update | n/a | n/a | n/a | 7.3s | 2.1s |

<img alt="Graph comparing pnpm versions on the alotta-files fixture" src="/img/benchmarks/alotta-files-pnpm.svg?v=ba39bf50" />