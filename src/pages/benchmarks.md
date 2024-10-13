# Benchmarks of JavaScript Package Managers

**Last benchmarked at**: _Oct 13, 2024, 3:15 AM_ (_daily_ updated).

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
| install |       |          |             | 48.3s | 9.3s | 7.3s | 3.5s |
| install | ✔     | ✔        | ✔           | 7.1s | 1s | 5.2s | n/a |
| install | ✔     | ✔        |             | 13.6s | 2.7s | 5.4s | 1.3s |
| install | ✔     |          |             | 18.9s | 6.2s | 7.2s | 2.9s |
| install |       | ✔        |             | 17.6s | 5.5s | 5.5s | 1.3s |
| install | ✔     |          | ✔           | 7.3s | 2.4s | 7.1s | n/a |
| install |       | ✔        | ✔           | 7s | 1s | 5.2s | n/a |
| install |       |          | ✔           | 7.3s | 5.8s | 7s | n/a |
| update  | n/a | n/a | n/a | 20.9s | 3.9s | 5.8s | 3s |

<img alt="Graph of the alotta-files results" src="/img/benchmarks/alotta-files.svg" />