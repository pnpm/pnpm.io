# Benchmarks of JavaScript Package Managers

**Last benchmarked at**: _Sep 2, 2026, 4:45 PM_ (_weekly_ updated).

This benchmark compares the performance of npm and pnpm. Every package manager installs through the same [pnpr](/pnpr) registry (v0.1.0-alpha.10) across an emulated 50ms round trip at 200 Mbit/s, so they all face one registry over one reproducible network instead of whatever link the benchmark machine happens to have. pnpm 12 is measured twice: once on its own, and once resolving its dependency graph [on the server](/pnpr/install-acceleration) instead of walking it itself. The page also compares how fast pnpm, fnm, and nvm install and switch Node.js versions.

About the setup:

- **Every manager crosses the same link.** The round trip is applied to all of them, and to pnpm's resolution requests as well, so no client gets a cheaper connection than another. The bandwidth cap is the link's, shared across all of a manager's connections — opening more connections in parallel spreads the latency, as on a real network, but cannot multiply the 200 Mbit/s.
- **pnpr's cache is warmed before anything is timed** — with the fixture's dependency graph and with the one the update row installs — so no manager pays to pull either into the registry on behalf of the ones measured after it.
- **Server-side resolution pays off when there is a graph to resolve.** Resolving one means walking it level by level, and each level costs a round trip, so the cost is roughly the depth of the graph times the latency. pnpr does that walk next to the registry — its own metadata access stays on loopback, the co-located shape the [pnpm monorepo's integrated benchmark](https://github.com/pnpm/pnpm) measures — and answers with the whole resolved lockfile at once, which is why the rows without a lockfile, and the row that changes dependencies, are the ones where it pulls ahead of plain pnpm.
- **The lockfile is trusted, so both managers are asked for the same work.** pnpm verifies a lockfile against the registry before installing it — a supply-chain pass that costs a packument per package, and one npm doesn't perform. The rows with a lockfile run every pnpm column with [`trustLockfile`](/settings#trustlockfile), so what they compare is the install rather than a safety check only one participant was asked for. It is on by default outside this benchmark, and pnpm's own resolution still applies its release-age policy on the rows that resolve.
- **With an up-to-date lockfile there is nothing to resolve.** pnpm doesn't ask the server then, so those rows measure the same install in both pnpm 12 columns.
- **The update row starts from a warm cache.** The rows before it delete the cache twice, and how much of it a manager has rebuilt by the time update runs is an accident of row ordering — restoring a warm `node_modules` without touching the registry leaves the cache cold, while re-downloading the whole graph on the same row refills it. A developer who bumps versions has the cache their installs left, so before the update is timed, every manager re-fetches the base graph once, untimed.
- Tarballs are still fetched by the client, in parallel and directly, on every row.

Each row's label lists which of `cache`, `trusted lockfile`, and `node_modules` are warm/present before install runs. Quick mapping to the real world (ordered from slowest to fastest scenario):

- `clean`: a brand-new clone — nothing cached, no lockfile, no `node_modules`.
- `trusted lockfile`: a CI server doing its first install.
- `cache`: a developer reinstalling without a lockfile.
- `cache+trusted lockfile`: a developer reinstalling a known project.
- `node_modules`: the cache and lockfile are deleted and install is run again.
- `cache+node_modules`: the lockfile is deleted and install is run again.
- `cache+trusted lockfile+node_modules`: re-running install when nothing has changed.
- `trusted lockfile+node_modules`: the cache is deleted and install is run again.
- `update`: dependency versions are bumped in `package.json` and install is run again, from a warm cache.

## Lots of Files

The app's [`alotta-files` package.json](https://github.com/pnpm/benchmarks/blob/main/fixtures/alotta-files/package.json)

| action  | cache | trusted lockfile | node_modules| npm | pnpm | [pnpm 🦀](/blog/releases/12.0) | [pnpm + pnpr](/pnpr/install-acceleration) |
| ---     | ---   | ---      | ---         | --- | --- | --- | --- |
| install |   |   |   | 44.1s | 8s | 5s | 3.2s |
| install |   | ✔ |   | 10.5s | 4.7s | 3.2s | 3.2s |
| install | ✔ |   |   | 8.1s | 4.5s | 788ms | 556ms |
| install | ✔ | ✔ |   | 5.1s | 2.2s | 439ms | 490ms |
| install |   |   | ✔ | 1.1s | 718ms | 62ms | 68ms |
| install | ✔ |   | ✔ | 1.1s | 731ms | 52ms | 56ms |
| install | ✔ | ✔ | ✔ | 825ms | 571ms | 14ms | 17ms |
| install |   | ✔ | ✔ | 784ms | 741ms | 69ms | 74ms |
| update | n/a | n/a | n/a | 2.9s | 4.2s | 929ms | 987ms |

<img alt="Graph of the alotta-files results" src="/img/benchmarks/alotta-files.svg?v=c7214013" />

### pnpm vs pnpm 🦀

pnpm v12 will use a new installation engine for fetching and linking written in Rust. See [pacquet](/blog/releases/12.0).

| action  | cache | trusted lockfile | node_modules| pnpm | [pnpm 🦀](/blog/releases/12.0) |
| ---     | ---   | ---      | ---         | --- | --- |
| install |   |   |   | 8s | 5s |
| install |   | ✔ |   | 4.7s | 3.2s |
| install | ✔ |   |   | 4.5s | 788ms |
| install | ✔ | ✔ |   | 2.2s | 439ms |
| install |   | ✔ | ✔ | 741ms | 69ms |
| install | ✔ |   | ✔ | 731ms | 52ms |
| install |   |   | ✔ | 718ms | 62ms |
| install | ✔ | ✔ | ✔ | 571ms | 14ms |
| update | n/a | n/a | n/a | 4.2s | 929ms |

<img alt="Graph comparing pnpm versions on the alotta-files fixture" src="/img/benchmarks/alotta-files-pnpm.svg?v=1017d6eb" />

## Node.js Version Management

pnpm installs and switches Node.js versions itself, so a separate version manager is not needed. This section compares [`pnpm runtime set node`](/cli/runtime) with fnm and nvm.

| scenario | pnpm 12 | fnm | nvm |
| ---      | --- | --- | --- |
| install Node.js 24 with nothing cached | 1s | 2.3s | 2.4s |
| install Node.js 24 that was installed before | 166ms | 2.4s | 2.1s |
| run `node` in a project pinned to Node.js 22 | 4ms | 3ms | 72ms |

<img alt="Graph comparing Node.js version managers on installing Node.js" src="/img/benchmarks/node-versions.svg?v=dcc9d709" />

A few things to keep in mind when reading these numbers:

- pnpm keeps Node.js in its content-addressable store and nvm keeps the downloaded tarballs in `$NVM_DIR/.cache`, so for both of them installing a version that was installed before needs no download. fnm has no download cache and fetches Node.js again.
- pnpm doesn't extract the `npm`, `npx`, and `corepack` binaries bundled with Node.js, so on a clean install it downloads and writes fewer files than the other two.
- Per-project switching costs no command at all in pnpm: the `node` on your PATH is a shim that reads the [`devEngines.runtime`](/package_json#devenginesruntime) of the project and runs the matching version. fnm and nvm read a `.node-version` or `.nvmrc` file through a shell hook that fires on `cd`, which is what `fnm exec` and `nvm use` measure in that row. Loading nvm into the shell in the first place is not counted at all here, and it costs more than everything in that row.
- All three have to materialize the pinned version the first time a project asks for it: pnpm links it from its store, fnm downloads it, nvm unpacks it. The row measures the repeated runs after that.
