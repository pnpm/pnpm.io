# Benchmarks of JavaScript Package Managers

**Last benchmarked at**: _Jul 6, 2026, 9:42 AM_ (_daily_ updated).

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
| install |   |   |   | 31.3s | 7.7s | 2.3s | 7s | 2.7s |
| install | ✔ |   |   | 13.8s | 4.5s | 1.3s | 7s | 2.3s |
| install |   | ✔ |   | 12.5s | 6.4s | 1.9s | 5s | 1s |
| install | ✔ | ✔ |   | 9s | 2.3s | 603ms | 5.4s | 1.1s |
| install |   |   | ✔ | 1.7s | 576ms | 47ms | 6.3s | n/a |
| install | ✔ |   | ✔ | 1.7s | 557ms | 48ms | 6.3s | n/a |
| install |   | ✔ | ✔ | 1.3s | 520ms | 62ms | 4.6s | n/a |
| install | ✔ | ✔ | ✔ | 1.3s | 510ms | 13ms | 4.5s | n/a |
| update | n/a | n/a | n/a | 6.9s | 7.5s | 2.1s | 5.1s | 2.3s |

<img alt="Graph of the alotta-files results" src="/img/benchmarks/alotta-files.svg?v=5aa40110" />

### pnpm vs pnpm 🦀

pnpm v12 will use a new installation engine for fetching and linking written in Rust. See [pacquet](https://github.com/pnpm/pacquet).

| action  | cache | lockfile | node_modules| pnpm | [pnpm 🦀](https://github.com/pnpm/pacquet) |
| ---     | ---   | ---      | ---         | --- | --- |
| install |   |   |   | 7.7s | 2.3s |
| install |   | ✔ |   | 6.4s | 1.9s |
| install | ✔ |   |   | 4.5s | 1.3s |
| install | ✔ | ✔ |   | 2.3s | 603ms |
| install |   |   | ✔ | 576ms | 47ms |
| install | ✔ |   | ✔ | 557ms | 48ms |
| install |   | ✔ | ✔ | 520ms | 62ms |
| install | ✔ | ✔ | ✔ | 510ms | 13ms |
| update | n/a | n/a | n/a | 7.5s | 2.1s |

<img alt="Graph comparing pnpm versions on the alotta-files fixture" src="/img/benchmarks/alotta-files-pnpm.svg?v=9c2500c6" />