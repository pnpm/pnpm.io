# Benchmarks of JavaScript Package Managers

**Last benchmarked at**: _Nov 5, 2022, 2:36 PM_ (_daily_ updated).

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
| install |       |          |             | 44.9s | 26.7s | 15.6s | 32.6s |
| install | ✔     | ✔        | ✔           | 3.1s | 1.6s | 1.9s | n/a |
| install | ✔     | ✔        |             | 14.6s | 7.2s | 5.9s | 1.2s |
| install | ✔     |          |             | 21.5s | 11.4s | 10.6s | 5.9s |
| install |       | ✔        |             | 24.3s | 23.7s | 10.7s | 27s |
| install | ✔     |          | ✔           | 3.8s | 4s | 6.6s | n/a |
| install |       | ✔        | ✔           | 3s | 1.7s | 6.9s | n/a |
| install |       |          | ✔           | 3.7s | 15.2s | 11.3s | n/a |
| update  | n/a | n/a | n/a | 10.1s | 15.4s | 5.7s | 11.6s |

<img alt="Graph of the alotta-files results" src="/img/benchmarks/alotta-files.svg" />

## The reason pnpm is fast

Why is pnpm so crazy fast compared to other "traditional" package managers?

pnpm doesn't have blocking stages of installation. Each dependency has its own stages and the next stage starts as soon as possible.

![](/img/installation-stages-of-other-pms.png)

![](/img/installation-stages-of-pnpm.jpg)