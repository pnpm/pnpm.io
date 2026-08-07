---
id: using-changesets
title: 在 pnpm 中使用 Changesets
---

:::note

在编写本文档时，最新的 pnpm 版本为 v10.4.1。 最新的 [ChangeSets](https://github.com/changesets/changesets) 版本是 v2.28.0。

:::

## 配置

要在 pnpm 工作空间上配置 changesets，请将 changesets 作为开发依赖项安装在工作空间的根目录中：

```sh
pnpm add -Dw @changesets/cli
```

然后运行 changesets 的 init 命令来生成 changesets 配置：

```sh
pnpm changeset init
```

## 添加新的 changesets

要生成新的 changesets，请在仓库的根目录中执行 `pnpm changeset`。 `.changeset` 目录中生成的 markdown 文件需要被提交到到仓库。

## 发布变更

1. 运行 `pnpm changeset version`。 这将提高先前使用 `pnpm changeset` （以及它们的任何依赖项）的版本，并更新变更日志文件。
2. 运行 `pnpm install`。 这将更新锁文件并重新构建包。
3. 提交更改。
4. 运行 `pnpm publish -r`。 此命令将发布所有包含被更新版本且尚未出现在包注册源中的包。

## 与 GitHub Actions 集成

要自动执行此过程，你可以将 `changeset version` 与 GitHub actions 一起使用。 当检测到 changeset 文件被合并到 `main` 分支时，该 action 将创建一个新的 PR，列出所有应该变更版本号的包。 每次有新的变更集文件到达 `main`时，PR 都会自动更新。 一旦合并，包将被更新，并且如果在 Action 中指定了 `publush` 输入，则它们将使用给定的命令发布。

### 添加发布脚本

添加一个新脚本 `ci:publish` 执行 `pnpm publish -r`。 一旦由 `changeset version` 创建的 PR 被合并，将会发布到注册源。 如果包是公共且有范围的，则可能需要添加 `--access=public` 以防止 npm 拒绝发布。

**package.json**
```json
{
   "scripts": {
      "ci:publish": "pnpm publish -r"
   },
   ...
}
```

### 添加工作流

在 `.github/workflows/changesets.yml`添加新的工作流程。 此工作流程将创建一个新的分支和 PR，因此应在存储库设置 (`github.com/<repo-owner>/<repo-name>/settings/actions`) 中授予 Action **读取和写入** 权限。 如果`changesets/action` 步骤上包含 `发布 ` 输入，存储库还应该包含一个 npm 认证令牌作为仓库密钥，名为 `NPM_TOKEN`。

**.github/workflows/changesets.yml**
```yaml
name: Changesets

on:
  push:
    branches:
      - main

env:
  CI: true

jobs:
  version:
    timeout-minutes: 15
    runs-on: ubuntu-latest
    steps:
      - name: 检出代码仓库
        uses: actions/checkout@v4

      - name: 设置 pnpm
        uses: pnpm/action-setup@v4

      - name: 设置 node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: 安装依赖
        run: pnpm install

      - name: 创建并发布版本
        uses: changesets/action@v1
        with:
          commit: "chore: update versions"
          title: "chore: update versions"
          publish: pnpm ci:publish
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

有关 changesets Action 的更多信息和文档可以在[此处](https://github.com/changesets/action)找到。
