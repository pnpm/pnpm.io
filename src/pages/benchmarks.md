# Benchmarks of JavaScript Package Managers

**Last benchmarked at**: _May 29, 2022, 11:46 AM_ (_daily_ updated).

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

The app's `package.json` [here](https://github.com/pnpm/pnpm.github.io/blob/main/benchmarks/fixtures/alotta-files/package.json)

| action  | cache | lockfile | node_modules| npm | pnpm | Yarn | Yarn PnP |
| ---     | ---   | ---      | ---         | --- | ---  | ---  | ---      |
| install |       |          |             | 45.1s | 14.8s | 16.7s | 24.4s |
| install | ✔     | ✔        | ✔           | 1.9s | 1.2s | 2.2s | n/a |
| install | ✔     | ✔        |             | 17.8s | 3.7s | 6.5s | 1.5s |
| install | ✔     |          |             | 23.5s | 6.6s | 11.4s | 6.1s |
| install |       | ✔        |             | 26.8s | 12.8s | 11.5s | 18.8s |
| install | ✔     |          | ✔           | 2.4s | 2.7s | 6.9s | n/a |
| install |       | ✔        | ✔           | 2s | 1.2s | 7.1s | n/a |
| install |       |          | ✔           | 2.5s | 7.8s | 11.7s | n/a |
| update  | n/a | n/a | n/a | 1.9s | 9.7s | 15.4s | 30.5s |

<img alt="Graph of the alotta-files results" src="/img/benchmarks/alotta-files.svg" />

## The reason pnpm is fast

Why is pnpm so crazy fast compared to other "traditional" package managers?

pnpm doesn't have blocking stages of installation. Each dependency has its own stages and the next stage starts as soon as possible.

![](/img/installation-stages-of-other-pms.png)

![](/img/installation-stages-of-pnpm.jpg)