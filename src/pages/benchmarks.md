# Benchmarks of JavaScript Package Managers

**Last benchmarked at**: _Jun 19, 2022, 3:55 AM_ (_daily_ updated).

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
| install |       |          |             | 36.7s | 15.9s | 16.7s | 22.9s |
| install | ✔     | ✔        | ✔           | 2s | 1.3s | 2.1s | n/a |
| install | ✔     | ✔        |             | 10.8s | 4.6s | 6.5s | 1.4s |
| install | ✔     |          |             | 15.4s | 7.6s | 11.1s | 6.1s |
| install |       | ✔        |             | 17.6s | 13.7s | 11.5s | 17.2s |
| install | ✔     |          | ✔           | 2.6s | 2.8s | 6.9s | n/a |
| install |       | ✔        | ✔           | 2s | 1.3s | 7.1s | n/a |
| install |       |          | ✔           | 2.6s | 7.8s | 11.7s | n/a |
| update  | n/a | n/a | n/a | 2s | 9.8s | 15.4s | 28.3s |

<img alt="Graph of the alotta-files results" src="/img/benchmarks/alotta-files.svg" />

## The reason pnpm is fast

Why is pnpm so crazy fast compared to other "traditional" package managers?

pnpm doesn't have blocking stages of installation. Each dependency has its own stages and the next stage starts as soon as possible.

![](/img/installation-stages-of-other-pms.png)

![](/img/installation-stages-of-pnpm.jpg)