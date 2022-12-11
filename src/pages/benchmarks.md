# Benchmarks of JavaScript Package Managers

**Last benchmarked at**: _Dec 11, 2022, 3:24 AM_ (_daily_ updated).

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
| install |       |          |             | 40.7s | 25.5s | 21.2s | 40s |
| install | ✔     | ✔        | ✔           | 2.8s | 1.6s | 2.5s | n/a |
| install | ✔     | ✔        |             | 12.6s | 6.3s | 7.9s | 1.7s |
| install | ✔     |          |             | 18.7s | 10.4s | 14.2s | 7.9s |
| install |       | ✔        |             | 20.9s | 22.8s | 14.3s | 32.9s |
| install | ✔     |          | ✔           | 3.4s | 3.8s | 8.7s | n/a |
| install |       | ✔        | ✔           | 2.7s | 1.6s | 8.7s | n/a |
| install |       |          | ✔           | 3.3s | 14.4s | 15.4s | n/a |
| update  | n/a | n/a | n/a | 10.7s | 14.8s | 6.9s | 14.5s |

<img alt="Graph of the alotta-files results" src="/img/benchmarks/alotta-files.svg" />

## The reason pnpm is fast

Why is pnpm so crazy fast compared to other "traditional" package managers?

pnpm doesn't have blocking stages of installation. Each dependency has its own stages and the next stage starts as soon as possible.

![](/img/installation-stages-of-other-pms.png)

![](/img/installation-stages-of-pnpm.jpg)