---
id: update
title: pnpm update
---

命令別名：`up`, `upgrade`

`pnpm update` 將套件更新至其允許範圍內的最新版本。

當不使用其他引數時，更新所有相依性。

## TL;DR

| 命令                   | 效果                                                |
| -------------------- | ------------------------------------------------- |
| `pnpm up`            | 依 `package.json` 中指定的範圍，將所有相依性更新至最新版              |
| `pnpm up --latest`   | Updates all dependencies to their latest versions |
| `pnpm up foo@2`      | 將 `foo` 更新到 v2 的最新版                               |
| `pnpm up "@babel/*"` | 更新 `@babel` 底下的所有相依性                              |

## Selecting dependencies with patterns

You can use patterns to update specific dependencies.

Update all `babel` packages:

```sh
pnpm update "@babel/*"
```

Update all dependencies, except `webpack`:

```sh
pnpm update "\!webpack"
```

Patterns may also be combined, so the next command will update all `babel` packages, except `core`:

```sh
pnpm update "@babel/*" "\!@babel/core"
```

## Options

### --recursive, -r

對除了 node_modules 以外所有包含 `package.json` 的子目錄並行執行更新。

使用示例：

```sh
pnpm --recursive update
# updates all packages up to 100 subdirectories in depth
pnpm --recursive update --depth 100
# update typescript to the latest version in every package
pnpm --recursive update typescript@latest
```

### --latest, -L

Update the dependencies to their latest stable version as determined by their `latest` tags (potentially upgrading the packages across major versions) as long as the version range specified in `package.json` is lower than the `latest` tag (i.e. it will not downgrade prereleases).

### --global, -g

Update global packages.

### --workspace

Tries to link all packages from the workspace. Versions are updated to match the versions of packages inside the workspace.

If specific packages are updated, the command will fail if any of the updated dependencies are not found inside the workspace. For instance, the following command fails if `express` is not a workspace package:

```sh
pnpm up -r --workspace express
```

### --prod, -P

僅更新位於 `dependencies` 與 `optionalDependencies` 中的套件。

### --dev, -D

僅更新位於 `devDependencies` 的套件。

### --no-optional

不更新 `optionalDependencies` 中的套件。

### --interactive, -i

列出過時的相依套件，並從中選擇要更新的。

### --no-save

Don't update the ranges in `package.json`.

### --filter &lt;package_selector\>

[Read more about filtering.](../filtering.md)
