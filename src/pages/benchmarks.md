# Benchmarks of JavaScript Package Managers

**Last benchmarked at**: _Oct 15, 2021, 2:48 AM_ (_daily_ updated).

This benchmark compares the performance of npm, pnpm, and Yarn (both regular and PnP variant).

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

The app's `package.json` [here](https://github.com/pnpm/pnpm.github.io/blob/main/benchmarks/fixtures/alotta-files/package.json)

| action  | cache | lockfile | node_modules| npm | pnpm | Yarn | Yarn PnP |
| ---     | ---   | ---      | ---         | --- | ---  | ---  | ---      |
| install |       |          |             | 1m 15.5s | 21.6s | 40.9s | 28.6s |
| install | ✔     | ✔        | ✔           | 2.4s | 1.9s | 2.3s | n/a |
| install | ✔     | ✔        |             | 14.7s | 5.1s | 12.5s | 1.7s |
| install | ✔     |          |             | 21.1s | 9.4s | 18.4s | 7.7s |
| install |       | ✔        |             | 35.4s | 16.8s | 32.6s | 21.9s |
| install | ✔     |          | ✔           | 3.2s | 2.1s | 8.3s | n/a |
| install |       | ✔        | ✔           | 2.5s | 1.5s | 22.8s | n/a |
| install |       |          | ✔           | 3.2s | 7.2s | 28.8s | n/a |
| update  | n/a | n/a | n/a | 2.5s | 14.4s | 43.2s | 35.8s |

![Graph of the alotta-files results](../../static/img/benchmarks/alotta-files.svg)