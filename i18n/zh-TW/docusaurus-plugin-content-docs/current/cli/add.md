---
id: add
title: "pnpm add <pkg>"
---

安裝一個套件與其所有依賴的套件。 預設狀況下，新安裝的套件將被視為生產環境依賴套件安裝。

## 範例

| 命令                   | 效果                            |
| -------------------- | ----------------------------- |
| `pnpm add sax`       | 安裝該套件至 `dependencies`         |
| `pnpm add -D sax`    | 安裝該套件至 `devDependencies`      |
| `pnpm add -O sax`    | 安裝該套件至 `optionalDependencies` |
| `pnpm add -g sax`    | 全域安裝該套件                       |
| `pnpm add sax@next`  | 安裝標籤為 `next` 的套件              |
| `pnpm add sax@3.0.0` | 安裝版本為 `3.0.0` 的套件             |

## Supported package sources

pnpm supports installing packages from various sources. See the [Supported package sources](../package-sources.md) page for detailed documentation on:

- npm registry
- JSR registry
- Workspace packages
- Local file system (tarballs and directories)
- Remote tarballs
- Git repositories (with semver, subdirectories, and more)

## 參數

### --save-prod, -P, -p

安裝套件至 `dependencies`

### --save-dev, -D, -d

安裝套件至 `devDependencies`

### --save-optional, -O, -o

安裝套件至 `optionalDependencies`

### --save-exact, -E, -e

安裝套件並鎖定為指定版本，而不會使用 pnpm 預設的 semver 範圍

### --save-peer

使用 `--save-peer` 將會新增一個或多個套件至 `peerDependencies` 並且將它們當作開發依賴套件進行安裝。

### --save-catalog

新增於 v10.12.1

Save the new dependency to the default [catalog][].

### --save-catalog-name &lt;catalog_name\>

新增於 v10.12.1

Save the new dependency to the specified [catalog][].

### --config

Added in: v10.8.0

Save the dependency to [configDependencies](config-dependencies.md).

### --ignore-workspace-root-check

除非加上 `--ignore-workspace-root-check` 或 `-w` 參數，否則在工作區的根目錄中新增依賴套件時將會失敗。

例如：`pnpm add debug -w`。

### --global, -g

在全域空間安裝該套件

### --workspace

僅新增可在工作區找到的新套件。


### --allow-build

新增於 v10.4.0

A list of package names that are allowed to run postinstall scripts during installation.

例如：

```
pnpm --allow-build=esbuild add my-bundler
```

This will run `esbuild`'s postinstall script and also add it to the `allowBuilds` field of `pnpm-workspace.yaml`. So, `esbuild` will always be allowed to run its scripts in the future.

### --filter &lt;package_selector\>

[閱讀更多關於篩選的內容。](../filtering.md)

import CpuFlag from '../settings/_cpuFlag.mdx'

<CpuFlag />

import OsFlag from '../settings/_osFlag.mdx'

<OsFlag />

import LibcFlag from '../settings/_libcFlag.mdx'

<LibcFlag />

[catalog]: catalogs.md
