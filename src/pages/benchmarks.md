# Benchmarks of JavaScript Package Managers

**Last benchmarked at**: _Jun 4, 2021, 4:24 AM_ (_daily_ updated).

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
| install |       |          |             | 50.4s | 18.6s | 1m 5.3s | 53.6s |
| install | ✔     | ✔        | ✔           | 2.3s | 1.6s | 2.8s | n/a |
| install | ✔     | ✔        |             | 14.1s | 5s | 16s | 2.3s |
| install | ✔     |          |             | 20.4s | 8.4s | 23.6s | 9s |
| install |       | ✔        |             | 33.4s | 16.2s | 56.7s | 43.1s |
| install | ✔     |          | ✔           | 3.3s | 3s | 9.4s | n/a |
| install |       | ✔        | ✔           | 2.4s | 1.6s | 43.9s | n/a |
| install |       |          | ✔           | 3.2s | 7.4s | 50.2s | n/a |
| update  | n/a   | n/a      | n/a         | 2.3s | 13.8s | 1m 18.9s | 1m 9.8s |

![Graph of the alotta-files results](../../static/img/benchmarks/alotta-files.svg)