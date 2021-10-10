# Benchmarks of JavaScript Package Managers

**Last benchmarked at**: _Oct 10, 2021, 2:47 AM_ (_daily_ updated).

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
| install |       |          |             | 44.3s | 14.1s | 40.9s | 28.6s |
| install | ✔     | ✔        | ✔           | 2.1s | 1.1s | 2.3s | n/a |
| install | ✔     | ✔        |             | 12.4s | 3.6s | 12.5s | 1.7s |
| install | ✔     |          |             | 18.1s | 6.7s | 18.4s | 7.7s |
| install |       | ✔        |             | 30.4s | 11.5s | 32.6s | 21.9s |
| install | ✔     |          | ✔           | 19.8s | 1.7s | 8.3s | n/a |
| install |       | ✔        | ✔           | 2.1s | 1.2s | 22.8s | n/a |
| install |       |          | ✔           | 17.7s | 5.3s | 28.8s | n/a |
| update  | n/a | n/a | n/a | 2s | 10.7s | 43.2s | 35.8s |

![Graph of the alotta-files results](../../static/img/benchmarks/alotta-files.svg)