---
id: add
title: "pnpm add <pkg>"
---

安装软件包及其依赖的任何软件包。
默认情况下，任何新软件包都被安装为生产依赖项。

## 摘要：

| 命令                   | 含义                         |
| -------------------- | -------------------------- |
| `pnpm add sax`       | 保存到 `dependencies`         |
| `pnpm add -D sax`    | 保存到 `devDependencies`      |
| `pnpm add -O sax`    | 保存到 `optionalDependencies` |
| `pnpm add -g sax `   | 安装全局依赖                     |
| `pnpm add sax@next`  | 安装 `next` 标签的版本            |
| `pnpm add sax@3.0.0` | 指定 `3.0.0` 版本              |

## 支持的软件包来源

pnpm 支持从各种来源安装软件包。 请参阅 [支持的软件包源](../package-sources.md) 页面了解详细文档：

- npm 源
- JSR 源
- 工作区包
- 本地文件系统 (tarballs和目录)
- 远程 tarball
- Git 仓库（包含语义化版本控制、子目录等）

## 配置项

### --save-prod, -P, -p

将指定的依赖安装为常规的 `dependencies`。

### --save-dev, -D, -d

将指定的依赖安装为 `devDependencies`。

### --save-optional, -O, -o

将指定的依赖安装为 `optionalDependencies`。

### --save-exact, -E, -e

已保存的依赖项将被配置确切版本，而不是使用 pnpm 的默认语义化版本范围运算符。

### --save-peer

使用 `--save-peer` 会把依赖安装为开发依赖，并添加到 `peerDependencies` 中。

### --save-catalog

添加于：v10.12.1

将新依赖项保存到默认的[目录][catalog]（catalog）。

### --save-catalog-name &lt;catalog_name\>

添加于：v10.12.1

将新的依赖项保存到指定的[目录][catalog]（catalog）。

[catalog]: catalogs.md

### --config

添加于：v10.8.0

将依赖项保存到 [configDependencies](config-dependencies.md)。

### --ignore-workspace-root-check

除非使用 `--ignore-workspace-root-check` 或 `-W` 标记. 否则在在工作空间根目录下添加依赖项时会失败。

例如：`pnpm add debug -w`.

### --global, -g

全局安装软件包。

### --workspace

仅添加在工作空间中找到的依赖项。

### --allow-build

添加于：v10.4.0

允许在安装期间执行安装的包名列表。

示例：

```
pnpm --allow-build=esbuild add my-bundler
```

这将运行 `esbuild` 的 postinstall 脚本，并将其添加到 `pnpm-workspace.yaml` 的 `allowBuilds` 字段中。 因此， `esbuild` 将来将始终被允许运行其脚本。

### --filter &lt;package_selector\>

[阅读更多有关过滤的内容。](../filtering.md)

import CpuFlag from '../settings/_cpuFlag.mdx'

<CpuFlag />

import OsFlag from '../settings/_osFlag.mdx'

<OsFlag />

import LibcFlag from '../settings/_libcFlag.mdx'

<LibcFlag />
