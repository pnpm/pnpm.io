---
id: using-changesets
title: 搭配 pnpm 使用 Changesets
---

:::note

At the time of writing this documentation, the latest pnpm version was v10.4.1. The latest [Changesets](https://github.com/changesets/changesets) version was v2.28.0.

:::

## 安装

要在 pnpm workspace 上設置 changesets ，請將 changesets 作為開發依賴項 安裝在 workspace 的根目錄中：

```sh
pnpm add -Dw @changesets/cli
```

Then run changesets' init command to generate a changesets config:

```sh
pnpm changeset init
```

## 添加新的 changesets

要生成新的 changesets，請在 workspace 的根目錄下運行 `pnpm changesets` 。 在 `.changeset` 目錄中生成的 markdown 文件應被 提交到 repository。

## 發布變更

1. 執行 `pnpm changeset version`. 這將提高先前使用 `pnpm changeset` 的套件（以及它們的任何依賴項）的版本，並更新變更日誌(changelog) 文件。
2. 執行 `pnpm install`。 這將會更新 lockfile 及重新打包套件。
3. 提交更改
4. 執行 `pnpm publish -r`。 此命令將發布所有包含被更新版本且尚未出現在註冊源中的套件。

## Integration with GitHub Actions

To automate the process, you can use `changeset version` with GitHub actions. The action will detect when changeset files arrive in the `main` branch, and then open a new PR listing all the packages with bumped versions. The PR will automatically update itself every time a new changeset file arrives in `main`. Once merged the packages will be updated, and if the `publish` input has been specified on the action they will  be published using the given command.

### Add a publish script

Add a new script called `ci:publish` which executes `pnpm publish -r`. This will publish to the registry once the PR created by `changeset version` has been merged. If the package is public and scoped, adding `--access=public` may be necessary to prevent npm rejecting the publish.

**package.json**
```json
{
   "scripts": {
      "ci:publish": "pnpm publish -r"
   },
   ...
}
```

### Add the workflow

Add a new workflow at `.github/workflows/changesets.yml`. This workflow will create a new branch and PR, so Actions should be given **read and write** permissions in the repo settings (`github.com/<repo-owner>/<repo-name>/settings/actions`). If including the `publish` input on the `changesets/action` step, the repo should also include an auth token for npm as a repository secret named `NPM_TOKEN`.

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
      - name: Checkout code repository
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Create and publish versions
        uses: changesets/action@v1
        with:
          commit: "chore: update versions"
          title: "chore: update versions"
          publish: pnpm ci:publish
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

More info and documentation regarding the changesets action can be found [here](https://github.com/changesets/action).
