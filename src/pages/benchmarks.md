# Benchmarks of JavaScript Package Managers

**Last benchmarked at**: _May 22, 2021, 2:23 PM_ (_daily_ updated).

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

| action  | cache | lockfile | node_modules| npm | pnpm | Yarn Berry | Yarn Berry PnP |
| ---     | ---   | ---      | ---         | --- | --- | --- | --- | --- |
| install |       |          |             | 46.8s | 17.6s | 1m 2.1s | 50.7s |
| install | ✔     | ✔        | ✔           | 2.1s | 1.5s | 2.8s | n/a |
| install | ✔     | ✔        |             | 13.3s | 4.8s | 16s | 2.1s |
| install | ✔     |          |             | 27.4s | 8s | 21.6s | 8.5s |
| install |       | ✔        |             | 31.1s | 14.8s | 50.4s | 40.9s |
| install | ✔     |          | ✔           | 3s | 2s | 8.4s | n/a |
| install |       | ✔        | ✔           | 2.2s | 1.5s | 38.1s | n/a |
| install |       |          | ✔           | 2.9s | 6.8s | 45.4s | n/a |
| update  | n/a   | n/a      | n/a         | 2.2s | 12.9s | 1m 10.9s | 1m 1.8s |

![Graph of the alotta-files results](../../static/img/benchmarks/alotta-files.svg)