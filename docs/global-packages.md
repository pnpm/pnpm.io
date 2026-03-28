---
id: global-packages
title: Global Packages
---

Global packages are CLI tools and utilities installed system-wide with `pnpm add -g`. In pnpm v11, global package management was redesigned for better isolation and reliability.

## Installing global packages

```sh
pnpm add -g <pkg>
```

For example:

```sh
pnpm add -g typescript prettier eslint
```

## Isolated installations

Each globally installed package (or group of packages installed together) gets its own isolated installation directory with its own `package.json`, `node_modules/`, and lockfile. This prevents global packages from interfering with each other through peer dependency conflicts, hoisting changes, or version resolution shifts.

Isolated installations are stored at `{pnpmHomeDir}/global/v11/{hash}/`, where the hash is derived from the set of packages installed together.

For example, running the following two commands:

```sh
pnpm add -g typescript
pnpm add -g prettier
```

creates two separate isolated installations — `typescript` and `prettier` each get their own `node_modules` tree and cannot affect each other's dependency resolution.

## Managing global packages

| Command | Description |
|---|---|
| `pnpm add -g <pkg>` | Install a package globally |
| `pnpm remove -g <pkg>` | Remove a globally installed package (removes the entire installation group) |
| `pnpm update -g [pkg]` | Update global packages (re-installs into new isolated directories) |
| `pnpm list -g` | List all globally installed packages |

:::note

`pnpm install -g` (without arguments) is not supported. Use `pnpm add -g <pkg>` to install specific packages.

:::

## Binaries location

Globally installed binaries are stored in a `bin` subdirectory of `PNPM_HOME` (i.e., `$PNPM_HOME/bin/`). This keeps the `PNPM_HOME` directory clean — internal directories like `global/` and `store/` don't pollute shell autocompletion when `PNPM_HOME` is on PATH.

After upgrading to pnpm v11, run [`pnpm setup`](./cli/setup.md) to update your shell configuration so that `$PNPM_HOME/bin` is on your PATH.

You can check the current global bin directory with:

```sh
pnpm bin -g
```

## Global virtual store

Global installs use the [global virtual store](./global-virtual-store.md). Packages are stored at `{storeDir}/links` and shared across global installations. This avoids redundant fetches when multiple global packages depend on the same libraries.

## Registering local packages globally

To make a local package's binaries available system-wide, use `pnpm add -g .` from the package directory:

```sh
cd ~/projects/my-tool
pnpm add -g .
```

This registers the package's `bin` entries so they can be invoked from anywhere. See [`pnpm link`](./cli/link.md#add-a-binary-globally) for more details.

## Build script approval

Global packages that have build scripts (e.g., `postinstall`) require approval. When you install a global package that needs to run build scripts, pnpm will prompt you to approve or deny the build interactively.

You can also pre-approve builds using the `--allow-build` flag:

```sh
pnpm add -g --allow-build=esbuild esbuild
```
