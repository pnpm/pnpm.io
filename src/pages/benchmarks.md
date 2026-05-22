# Benchmarks of JavaScript Package Managers

**Last benchmarked at**: _May 22, 2026, 12:43 AM_ (_daily_ updated).

This benchmark compares the performance of npm, pnpm, Yarn Classic, and Yarn PnP (check [Yarn's benchmarks](https://yarnpkg.com/benchmarks) for any other Yarn modes that are not included here).

Here's a quick explanation of how these tests could apply to the real world:

- `clean install`: How long it takes to run a totally fresh install: no lockfile present, no packages in the cache, no `node_modules` folder.
- `with cache`, `with lockfile`, `with node_modules`: After the first install is done, the install command is run again.
- `with cache`, `with lockfile`: When a repo is fetched by a developer and installation is first run.
- `with cache`: Same as the one above, but the package manager doesn't have a lockfile to work from.
- `with lockfile`: When an installation runs on a CI server.
- `with cache`, `with node_modules`: The lockfile is deleted and the install command is run again.
- `with node_modules`, `with lockfile`: The package cache is deleted and the install command is run again.
- `with node_modules`: The package cache and the lockfile is deleted and the install command is run again.
- `update`: Updating your dependencies by changing the version in the `package.json` and running the install command again.

## Lots of Files

The app's `package.json` [here](https://github.com/pnpm/pnpm.io/blob/main/benchmarks/fixtures/alotta-files/package.json)

| action  | cache | lockfile | node_modules| npm | pnpm | [pnpm 🦀](https://github.com/pnpm/pacquet) | Yarn | Yarn PnP |
| ---     | ---   | ---      | ---         | --- | --- | --- | --- | --- |
| install |   |   |   | 31.2s | 7.5s | 11.4s | 8.2s | 3.5s |
| install | ✔ | ✔ | ✔ | 1.2s | 452ms | 348ms | 5.5s | n/a |
| install | ✔ | ✔ |   | 8s | 1.8s | 718ms | 5.8s | 1.3s |
| install | ✔ |   |   | 12.8s | 3.5s | 24.3s | 8.2s | 3s |
| install |   | ✔ |   | 11.5s | 6.9s | 4s | 5.9s | 1.3s |
| install | ✔ |   | ✔ | 1.8s | 5.2s | 23s | 7.8s | n/a |
| install |   | ✔ | ✔ | 1.2s | 444ms | 216ms | 5.6s | n/a |
| install |   |   | ✔ | 1.8s | 7.8s | 28.4s | 7.9s | n/a |
| update | n/a | n/a | n/a | 7s | 3.6s | 23.8s | 6.3s | 3s |

<img alt="Graph of the alotta-files results" src="/img/benchmarks/alotta-files.svg?v=7cfa6955" />

### pnpm vs pnpm 🦀

pnpm v12 will use a new installation engine for fetching and linking written in Rust. See [pacquet](https://github.com/pnpm/pacquet).

| action  | cache | lockfile | node_modules| pnpm | [pnpm 🦀](https://github.com/pnpm/pacquet) |
| ---     | ---   | ---      | ---         | --- | --- |
| install |   |   |   | 7.5s | 11.4s |
| install | ✔ | ✔ | ✔ | 452ms | 348ms |
| install | ✔ | ✔ |   | 1.8s | 718ms |
| install | ✔ |   |   | 3.5s | 24.3s |
| install |   | ✔ |   | 6.9s | 4s |
| install | ✔ |   | ✔ | 5.2s | 23s |
| install |   | ✔ | ✔ | 444ms | 216ms |
| install |   |   | ✔ | 7.8s | 28.4s |
| update | n/a | n/a | n/a | 3.6s | 23.8s |

<img alt="Graph comparing pnpm versions on the alotta-files fixture" src="/img/benchmarks/alotta-files-pnpm.svg?v=b24387e7" />