---
id: git-worktrees
title: pnpm + Git 工作树用于多代理开发
---

当多个 AI 代理需要同时处理同一个 monorepo 时，它们各自都需要一个具有完整功能的 `node_modules` 的隔离工作副本。 Git 工作树与 pnpm 的 [全局虚拟存储](./global-virtual-store.md) 相结合，使之成为可能：每个工作树都有自己的检出和自己的 `node_modules`，但依赖项通过磁盘上的单个内容寻址存储在所有工作树之间共享。

## 什么是 Git 工作树？

通常情况下，一个 Git 仓库只有一个工作目录，并且一次只能关联一个分支。 如果你想查看另一个分支，你必须暂存或提交你的更改并切换。 [git 工作树](https://git-scm.com/docs/git-worktree) 允许你同时检出多个分支，每个分支都在其自己的目录中。 所有工作树共享相同的存储库历史记录和对象——它们只是同一个存储库的不同视图。

```
git worktree add ../feature-branch feat/my-feature
```

这将创建一个新的目录 `../feature-branch`，并检出 `feat/my-feature`，而您的原始工作目录仍保留在其当前分支上。 你可以独立在两个目录中工作。

一种常见的模式是使用一个**裸仓库**（没有自己的工作目录）作为中心，并将所有工作目录创建为工作树：

```
git clone --bare https://github.com/your-org/your-repo.git your-repo
cd your-repo
git worktree add ./main main
git worktree add ./feature feat/something
```

## 为什么需要工作树？

即使在 AI 代理之前，工作树对于维护一个项目的多个主要版本也是有用的。 在我的开发机器上，我使用一个 pnpm 仓库，其中至少有两个工作树：一个在 `main` 分支上，用于 pnpm v11；另一个在 `v10` 分支上，用于向后移植和维护版本。 这样，我就可以在不暂停我正在进行的 v11 工作的情况下修复 v10 中的错误——两个版本始终都已检出并准备就绪。 过去，在 pnpm 仓库中，2 到 3 个工作树通常就足够了。 但是，自从我开始大量使用 AI 代理以来，我需要更多的工作树，才能让我的代理并行处理许多任务。

## 为什么这对 AI 代理更重要

借助 AI 编码代理，工作树从方便变成了必不可少。 每个代理都需要自己的工作目录来编辑文件、运行构建和执行测试，而不会干扰其他代理。 如果没有工作树，这意味着需要多次克隆存储库，每次复制都会复制 git 历史记录。

工作树解决了 git 方面的问题——每个代理都有自己独立的检出，同时共享底层的 git 对象。 但是每个工作树仍然需要自己的 `node_modules`，这可能会占用数百兆字节的空间。 这就是 pnpm 的 [全局虚拟存储](./global-virtual-store.md) 的作用所在：启用它之后，每个工作树的 `node_modules` 都只包含指向磁盘上单个内容寻址存储的符号链接。 这意味着添加新代理程序速度很快，而且几乎不占用额外的磁盘空间。

## 设置

### 1. 创建一个裸仓库

```sh
git clone --bare https://github.com/your-org/your-monorepo.git your-monorepo
cd your-monorepo
```

### 2. 为每个分支创建工作树

```sh
# 主开发工作树
git worktree add ./main main

# 代理 A 的功能分支
git worktree add ./feature-auth feat/auth

# 代理 B 的 bug 修复分支
git worktree add ./fix-api fix/api-error
```

每个工作树都是一个完整的检出，拥有自己的文件，但它们都共享同一个 `.git` 对象存储。

### 3. 启用全局虚拟存储

在你的仓库中的 `pnpm-workspace.yaml` 文件中添加 `enableGlobalVirtualStore: true`：

```yaml
packages:
  - 'packages/*'

enableGlobalVirtualStore: true
```

### 4. 在每个工作树中安装依赖项

```sh
cd main && pnpm install
cd ../feature-auth && pnpm install
cd ../fix-api && pnpm install
```

第一次执行 `pnpm install` 会将软件包下载到全局存储中。 在其他工作树中进行后续安装几乎是瞬间完成的，因为它们只会创建指向同一存储的符号链接。

## 工作原理

如果没有全局虚拟存储，每个工作树都会在 `node_modules` 中拥有自己的 `.pnpm` 虚拟存储，其中包含每个包的硬链接或副本。 启用 `enableGlobalVirtualStore: true` 后，pnpm 会将所有包内容保存在一个共享目录中（全局存储，可以通过运行 `pnpm store path` 找到），并且每个工作树的 `node_modules` 都包含指向该目录的符号链接：

```
your-monorepo/（裸 Git 仓库）
├── main/（工作树：main 分支）
│ ├── packages/
│ └── node_modules/
│ ├── lodash → <global-store>/links/@/lodash/...
│ └── express → <global-store>/links/@/express/...
├── feature-auth/（工作树：feat/auth 分支）
│ └── node_modules/
│ ├── lodash → <global-store>/links/@/lodash/... ← 相同目标
│ └── express → <global-store>/links/@/express/...
└── fix-api/ (工作树：fix/api-error 分支)
    └── node_modules/
        ├── lodash → <global-store>/links/@/lodash/... ← 相同目标
        └── express → <global-store>/links/@/express/...
```

这意味着：

- **每个工作树的开销几乎为零** — 本地 `node_modules` 仅包含指向共享全局虚拟存储的符号链接。 与 pnpm 的默认行为（将内容寻址存储中的文件硬链接到本地 `node_modules/.pnpm` 目录）不同，全局虚拟存储意味着根本不会将任何文件复制或硬链接到工作树中。
- **新工作树的即时安装** — 软件包已在全局存储中。
- **无冲突** — 每个工作树都有自己的 `node_modules` 树，因此代理可以在不同的分支上安装不同的依赖项版本而不会相互干扰。

## 示例：pnpm 单仓库本身

[pnpm 仓库](https://github.com/pnpm/pnpm) 使用了完全相同的设置，包括裸 git 仓库和 `enableGlobalVirtualStore: true`。 它包含一些辅助脚本，使工作树管理更加便捷：

**`pnpm worktree:new <branch-name|pr-number>`** — 创建一个新的工作树并进行设置：

```sh
# 为分支创建工作树（如果不存在则从主分支创建）
pnpm worktree:new feat/my-feature

# 为 GitHub PR 创建工作树（自动获取 PR 引用）
pnpm worktree:new 10834
```

该脚本除了简单的 `git worktree add` 之外，还处理一些其他操作：

- PR 编号是通过 `git fetch origin pull/<number>/head` 获取的，因此它们也适用于 fork。
- 分支名称中带有斜杠（例如 `feat/my-feature`）的目录名称将转换为短横线（例如 `feat-my-feature`）。
- `.claude` 目录是从裸仓库的 git common 目录符号链接到新的工作树的，因此所有工作树都共享相同的 Claude Code 设置和已批准的命令。

还有一个 shell 辅助工具 [`shell/wt.sh`](https://github.com/pnpm/pnpm/blob/main/shell/wt.sh)，它会包装脚本并将 `cd` 命令切换到新的工作树：

```sh
# 在 shell 配置中加载它，然后：
wt feat/my-feature
wt 10834
```

## 小技巧

- **为代理创建工作树**：启动 AI 代理时，为其创建一个专用工作树。 该代理程序获得完全隔离，可以编辑文件、运行测试和安装软件包，而不会影响其他代理程序。
- **清理**：当不再需要工作树时，使用 `git worktree remove ./feature-auth` 将其删除。 剩余的工作树虽然成本低廉，但会不断累积。
