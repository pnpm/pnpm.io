---
id: global-packages
title: 全局软件包
---

全局软件包是使用 `pnpm add -g` 安装到系统范围内的 CLI 工具和实用程序。 在 pnpm v11 中，全局包管理被重新设计，以提升隔离性和可靠性。

## 安装全局软件包

```sh
pnpm add -g <pkg>
```

示例：

```sh
pnpm add -g typescript prettier eslint
```

## 独立安装

每个全局安装的软件包（或一起安装的一组软件包）都有其自己的独立安装目录，其中包含自己的 `package.json`、`node_modules/` 和锁文件。 This prevents global packages from interfering with each other through peer dependency conflicts, hoisting changes, or version resolution shifts.

Isolated installations are stored at `{pnpmHomeDir}/global/v11/{hash}/`, where the hash is derived from the set of packages installed together.

For example, running the following two commands:

```sh
pnpm add -g typescript
pnpm add -g prettier
```

creates two separate isolated installations — `typescript` and `prettier` each get their own `node_modules` tree and cannot affect each other's dependency resolution.

Installing multiple packages in a single command groups them into one isolated install:

```sh
pnpm add -g eslint prettier
```

`eslint` and `prettier` share a `node_modules` tree and lockfile, so peer dependencies are resolved against each other. Removing either with `pnpm remove -g` removes the entire group.

## Directory layout

The contents of `{pnpmHomeDir}/global/v11/` look like:

```text
{pnpmHomeDir}/global/v11/
├── {hash-A}              → symlink → ./{hash-A-target}/
├── {hash-A-target}/      ← isolated install dir
│   ├── package.json      ← lists the packages installed together
│   ├── pnpm-lock.yaml    ← lockfile for this install group
│   └── node_modules/
│       ├── <pkg>/        ← top-level dep, symlinked into the global virtual store
│       └── .pnpm/
├── {hash-B}              → symlink → ./{hash-B-target}/
├── {hash-B-target}/      ← another isolated install dir
└── store/                ← shared global virtual store
    └── ...
```

- The `{hash}` entries are symlinks; pnpm scans for them to enumerate active installs.
- The targets are real directories that act as ordinary pnpm projects — each has its own `package.json` and lockfile.
- The shared `store/` directory holds the [global virtual store](./global-virtual-store.md). Each install group's direct dependencies — the entries at the root of its `node_modules/` — are symlinks into that store, so the actual package contents are shared rather than copied per group.
- Bin shims live in `{pnpmHomeDir}/bin/` and point through the appropriate install group's `node_modules`.

When a package is removed or its install group is replaced, the hash symlink is updated and orphaned target directories are eventually cleaned up by `pnpm store prune`.

## Listing global packages

```sh
pnpm list -g
pnpm list -g --json        # machine-readable
pnpm list -g --parseable   # paths only
```

Because each install group has its own lockfile, listing across multiple groups can only reliably aggregate the top-level packages they were installed with — transitive dependency trees from different groups can't be coherently merged. As a result:

- `pnpm list -g` (default `--depth=0`) always works and shows every globally installed package.
- `pnpm list -g --depth=<n>` (with `n > 0`) shows the full dependency tree only when:
  - there is just one global install group, or
  - a positional argument narrows the request to a single install group, e.g. `pnpm list -g eslint --depth=1`.

If `--depth>0` is requested but the request can't be narrowed to a single install group, pnpm errors with `ERR_PNPM_GLOBAL_LS_DEPTH_NOT_SUPPORTED`.

## Managing global packages

| 命令                     | 描述                                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| `pnpm add -g <pkg>`    | Install a package globally                                                                     |
| `pnpm remove -g <pkg>` | Remove a globally installed package (removes the entire installation group) |
| `pnpm update -g [pkg]` | Update global packages (re-installs into new isolated directories)          |
| `pnpm list -g`         | List all globally installed packages                                                           |

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
