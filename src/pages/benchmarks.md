# Benchmarks of JavaScript Package Managers

**Last benchmarked at**: _Sep 17, 2023, 2:45 AM_ (_daily_ updated).

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

| action  | cache | lockfile | node_modules| npm | pnpm | Yarn | Yarn PnP |
| ---     | ---   | ---      | ---         | --- | ---  | ---  | ---      |
| install |       |          |             | 34.3s | 12.5s | 22.1s | 20.2s |
| install | ✔     | ✔        | ✔           | 2.5s | 1.6s | 695ms | n/a |
| install | ✔     | ✔        |             | 9.5s | 4.6s | 8.8s | 668ms |
| install | ✔     |          |             | 15.5s | 8.4s | 22.8s | 15.2s |
| install |       | ✔        |             | 19.3s | 9.6s | 8.9s | 670ms |
| install | ✔     |          | ✔           | 2.8s | 3.4s | 16s | n/a |
| install |       | ✔        | ✔           | 2.5s | 1.6s | 681ms | n/a |
| install |       |          | ✔           | 2.8s | 8.8s | 16.6s | n/a |
| update  | n/a | n/a | n/a | 9.2s | 5.7s | 8.7s | 16.9s |

<img alt="Graph of the alotta-files results" src="/img/benchmarks/alotta-files.svg" />