---
id: add
title: "pnpm add <pkg>"
---

Installs a package and any packages that it depends on.
By default, any new package is installed as a production dependency.

## TL;DR

| Command                                | Meaning                            |
|----------------------------------------|------------------------------------|
| `pnpm add sax`                         | Save to `dependencies`             |
| `pnpm add -D sax`                      | Save to `devDependencies`          |
| `pnpm add -O sax`                      | Save to `optionalDependencies`     |
| `pnpm add -g sax `                     | Install package globally           |
| `pnpm add sax@next`                    | Install from the `next` tag        |
| `pnpm add sax@3.0.0`                   | Specify version `3.0.0`            |

## Supported package sources

pnpm supports installing packages from various sources. See the [Supported package sources](../package-sources.md) page for detailed documentation on:

- npm registry
- JSR registry
- Workspace packages
- Local file system (tarballs and directories)
- Remote tarballs
- Git repositories (with semver, subdirectories, and more)

## Adding a package manager or a runtime

Added in: v12.0.0-rc.6 (pnpm v12 only)

Naming a [package manager](../package-managers.md) — `npm`, `yarn` or `bun` — records which one the project uses instead of installing the npm package that shares the name:

```sh
pnpm add yarn@4
```

writes `"packageManager": "yarn@4.18.0"`, and every other package manager is recorded as a range in [`devEngines.packageManager`](../package_json.md#devenginespackagemanager). Naming a runtime (`node`, `deno`) records it under `engines.runtime`, as the explicit `node@runtime:22` spelling already did — `bun` is both, and is declared as the project's package manager unless you ask for the runtime (`pnpm add bun@runtime:1.3.0`).

Globally, `pnpm add -g yarn` installs the current Yarn line rather than the Classic-only `yarn` package, and `pnpm add -g node@22` installs that Node.js release rather than a wrapper that downloads one.

A specifier that locates a package rather than asking for a released version — `pnpm add yarn@npm:yarn@1.22.22`, `pnpm add yarn@yarnpkg/berry` — installs what it names, as an ordinary dependency.

## Options

### --save-prod, -P, -p

Install the specified packages as regular `dependencies`.

### --save-dev, -D, -d

Install the specified packages as `devDependencies`.

### --save-optional, -O, -o

Install the specified packages as `optionalDependencies`.

### --save-exact, -E, -e

Saved dependencies will be configured with an exact version rather than using
pnpm's default semver range operator.

### --save-peer

Using `--save-peer` will add one or more packages to `peerDependencies` and
install them as dev dependencies.

### --save-catalog

Added in: v10.12.1

Save the new dependency to the default [catalog].

### --save-catalog-name &lt;catalog_name\>

Added in: v10.12.1

Save the new dependency to the specified [catalog].

[catalog]: catalogs.md

### --config

Added in: v10.8.0

Save the dependency to [configDependencies](config-dependencies.md).

### --ignore-workspace-root-check

Adding a new dependency to the root workspace package fails, unless the
`--ignore-workspace-root-check` or `-w` flag is used.

For instance, `pnpm add debug -w`.

### --global, -g

Install a package globally. See [Global Packages](../global-packages.md) for details.

Each space-separated package is installed into its own isolated directory. To bundle several packages into a single isolated install (so they share dependencies and are removed together), pass them as a comma-separated list, e.g. `pnpm add -g eslint,prettier`.

### --workspace

Only adds the new dependency if it is found in the workspace.


### --allow-build

Added in: v10.4.0

A list of package names that are allowed to run postinstall scripts during installation.

Example:

```
pnpm --allow-build=esbuild add my-bundler
```

This will run `esbuild`'s postinstall script and also add it to the `allowBuilds` field of `pnpm-workspace.yaml`. So, `esbuild` will always be allowed to run its scripts in the future.

### --filter &lt;package_selector\>

[Read more about filtering.](../filtering.md)

import CpuFlag from '../settings/_cpuFlag.mdx'

<CpuFlag />

import OsFlag from '../settings/_osFlag.mdx'

<OsFlag />

import LibcFlag from '../settings/_libcFlag.mdx'

<LibcFlag />
