---
id: pnpm-cli
title: pnpm CLI
---

## 与 npm 的差别

与 npm 不同，pnpm 会校验所有选项。 例如， `pnpm install --target_arch x64` 将失败，因为 `--target_arch` 不是 `pnpm install` 的有效选项。

但是，某些依赖关系可能使用 `npm_config_` 环境变量，其从 CLI 选项中填充。 在这种情况下，你有以下选择：

1. 明确设置环境变量：`npm_config_target_arch=x64 pnpm install`
2. 使用 `--config` 来强制使用未知选项：`pnpm install --config.target_arch=x64`

## 配置项

### -C &lt;path\>, --dir &lt;path\>

在 `<path>` 的目录中启动 pnpm，而不是当前的工作目录。

### -w, --workspace-root

运行起来就好像 pnpm 是在 [工作空间](./workspace.md) 的根目录中启动的，而不是在当前工作目录中启动的。

## 命令

有关更多信息，请参阅各个 CLI 命令的文档。 以下是简便的 npm 命令等效列表，可帮助你入门：

| npm 命令          | pnpm 等效            |
| --------------- | ------------------ |
| `npm install`   | [`pnpm install`]   |
| `npm i <pkg>`   | [`pnpm add <pkg>`] |
| `npm run <cmd>` | [`pnpm <cmd>`]     |

当使用未知命令时，pnpm 将搜索具有给定名称的脚本，因此 `pnpm run lint` 与 `pnpm lint` 相同。 如果没有具有指定名称的脚本，
那么 pnpm 将以 shell 脚本的形式执行该命令，因此你可以执行类似 `pnpm eslint` 的操作（参见 [`pnpm exec`]）。

[`pnpm install`]: ./cli/install.md
[`pnpm add <pkg>`]: ./cli/add.md
[`pnpm <cmd>`]: ./cli/run.md
[`pnpm exec`]: ./cli/exec.md

## 环境变量

一些与 pnpm 无关的环境变量可能会改变 pnpm 的行为：

- [`CI`](./cli/install.md#--frozen-lockfile)

这些环境变量可能会影响 pnpm 将使用哪些目录来存储全局信息：

- `XDG_CACHE_HOME`
- `XDG_CONFIG_HOME`
- `XDG_DATA_HOME`
- `XDG_STATE_HOME`

你可以搜索文档来找到这些环境变量的设置。
