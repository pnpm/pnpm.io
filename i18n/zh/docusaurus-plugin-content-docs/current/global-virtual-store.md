---
id: global-virtual-store
title: 全局虚拟存储
---

默认情况下，pnpm 会在每个项目的 `node_modules` 目录下创建一个 `.pnpm` 目录——这就是“虚拟存储”。 它包含指向 [内容寻址存储](./settings.md#storedir) 中文件的硬链接。 每个项目都有自己的虚拟存储投影——pnpm 将内容寻址商店中的文件硬链接到 `.pnpm` 目录结构中。 实际的文件内容在磁盘上只存在一次，但目录结构会为每个项目重新创建，以便 Node.js 的模块解析算法能够找到每个包的正确依赖项。

启用全局虚拟存储（`enableGlobalVirtualStore: true`）可以改变这一点。 pnpm 不为每个项目都设置自己的 `node_modules/.pnpm` 目录，而是维护一个共享的虚拟存储（位于 `<store-path>/links/`，运行 `pnpm store path` 可以找到 `<store-path>`）。 每个项目的 `node_modules` 目录下只包含指向这个共享位置的符号链接。

## 默认行为与全局虚拟存储

### 默认（每个项目一个虚拟存储）

```
project-a/
└── node_modules/
    ├── lodash → .pnpm/lodash@4.17.21/node_modules/lodash
    └── .pnpm/
        └── lodash@4.17.21/
            └── node_modules/
                └── lodash/ ← 指向内容寻址存储的硬链接
project-b/
└── node_modules/
    ├── lodash → .pnpm/lodash@4.17.21/node_modules/lodash
    └── .pnpm/
        └── lodash@4.17.21/
            └── node_modules/
                └── lodash/ ← 相同的硬链接，重复的目录结构
```

每个项目都有自己的 `.pnpm` 文件，其中包含硬链接。 文件内容不会在磁盘上重复（硬链接共享 inode），但目录结构会重复。 对于大型单体仓库或许多并行检出，在 `pnpm install` 期间创建数千个硬链接所花费的时间会累积。

### 使用全局虚拟存储

```
project-a/
└── node_modules/
    └── lodash → <global-store>/links/@/lodash/4.17.21/<hash>/node_modules/lodash
project-b/
└── node_modules/
    └── lodash → <global-store>/links/@/lodash/4.17.21/<hash>/node_modules/lodash ← 相同目标
```

这两个项目都直接符号链接到全局虚拟存储中的同一位置。 没有每个项目单独的 `.pnpm` 目录。 全局虚拟存储本身包含指向内容寻址存储的硬链接——但这只发生在每个依赖图上一次（下文会详细说明），而不是每个项目。

## 软件包标识如何工作

在全局虚拟存储中，每个软件包目录都以其依赖关系图的哈希值命名。 两个使用 `lodash@4.17.21` 且具有相同传递依赖树的项目将指向完全相同的目录。 如果依赖关系树不同（例如，不同的对等依赖关系），pnpm 会创建单独的条目。 这在概念上类似于 [NixOS 管理软件包](https://nixos.org/guides/how-nix-works/) 使用依赖关系图哈希的方式。

## 何时使用它

当你在磁盘上有同一项目的多个检出版本时，全局虚拟存储最为有用——例如，在使用[git 工作树进行多代理开发](./git-worktrees.md) 时。 在这种情况下，每个工作树都可以获得几乎无成本的 `node_modules`，因为所有真正的包内容都已存在于共享存储中。

它还可以加快同一台机器上不相关项目的安装速度，因为任何项目已经安装的任何软件包版本都可以立即使用。

## 局限性

- **CI 环境**：在 CI 中，通常没有缓存，因此没有可用的全局热存储。 全局虚拟存储在 CI 中通常没用。
- **ESM 提升**：pnpm 使用 `NODE_PATH` 环境变量来支持全局虚拟存储的提升依赖项。 但是，Node.js 并不遵循 ESM 导入的 `NODE_PATH`。 如果 ESM 依赖项尝试导入未在其自身 `package.json` 中声明的包，则解析将失败。 您可以使用 [packageExtensions](./settings.md#packageextensions) 或 [@pnpm/plugin-esm-node-path](https://github.com/pnpm/plugin-esm-node-path) 配置依赖项来解决此问题。./settings.md#packageextensions

:::note

全局虚拟存储目前对于项目安装默认处于禁用状态，并被标记为实验性功能，因为某些工具可能无法正确处理符号链接的 `node_modules`。 要在项目安装中使用它，需要在 `pnpm-workspace.yaml` 中显式设置 `enableGlobalVirtualStore: true`。 在 pnpm v11 中，默认情况下，通过 `pnpm dlx` (`pnpx`) 安装的软件包和全局安装的软件包都会启用全局虚拟存储。 目标是在未来的版本中默认启用该功能。

:::

## 全局软件包

在 pnpm v11 中，全局安装（`pnpm add -g`）和 `pnpm dlx` 默认使用全局虚拟存储。 有关 v11 中全局软件包管理如何工作的完整指南，包括隔离安装和新的二进制文件位置，请参阅 [全局软件包](./global-packages.md)。

## 配置

有关所有配置详情，请参阅 [`enableGlobalVirtualStore`](./settings.md#enableglobalvirtualstore)。
