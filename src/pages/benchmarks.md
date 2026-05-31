# Benchmarks of JavaScript Package Managers

**Last benchmarked at**: _May 31, 2026, 3:53 AM_ (_daily_ updated).

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
| install |   |   |   | 36.7s | 8.8s | 4.6s | 7.1s | 2.9s |
| install | ✔ |   |   | 12.3s | 3.5s | 1s | 6.8s | 2.4s |
| install |   | ✔ |   | 11s | 8.3s | 3.4s | 5.1s | 1.1s |
| install | ✔ | ✔ |   | 7.8s | 1.8s | 431ms | 5s | 1.1s |
| install |   |   | ✔ | 1.8s | 4.2s | 3.1s | 6.4s | n/a |
| install | ✔ |   | ✔ | 1.8s | 4.1s | 877ms | 6.4s | n/a |
| install | ✔ | ✔ | ✔ | 1.3s | 449ms | 56ms | 4.5s | n/a |
| install |   | ✔ | ✔ | 1.3s | 444ms | 57ms | 4.5s | n/a |
| update | n/a | n/a | n/a | 7.7s | 8.9s | 3.9s | 5.1s | 2.5s |

<img alt="Graph of the alotta-files results" src="/img/benchmarks/alotta-files.svg?v=2dfb7ec5" />

### pnpm vs pnpm 🦀

pnpm v12 will use a new installation engine for fetching and linking written in Rust. See [pacquet](https://github.com/pnpm/pacquet).

| action  | cache | lockfile | node_modules| pnpm | [pnpm 🦀](https://github.com/pnpm/pacquet) |
| ---     | ---   | ---      | ---         | --- | --- |
| install |   |   |   | 8.8s | 4.6s |
| install |   | ✔ |   | 8.3s | 3.4s |
| install |   |   | ✔ | 4.2s | 3.1s |
| install | ✔ |   | ✔ | 4.1s | 877ms |
| install | ✔ |   |   | 3.5s | 1s |
| install | ✔ | ✔ |   | 1.8s | 431ms |
| install | ✔ | ✔ | ✔ | 449ms | 56ms |
| install |   | ✔ | ✔ | 444ms | 57ms |
| update | n/a | n/a | n/a | 8.9s | 3.9s |

<img alt="Graph comparing pnpm versions on the alotta-files fixture" src="/img/benchmarks/alotta-files-pnpm.svg?v=80097289" />