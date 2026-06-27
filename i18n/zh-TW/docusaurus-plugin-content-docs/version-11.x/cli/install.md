---
id: install
title: pnpm install
---

別名： `i`

使用 `pnpm install` 來為專案安裝所有相依性。

在 CI 環境中，如果 lockfile 存在但需要更新時，會使安裝失敗。

Inside a [workspace], `pnpm install` installs all dependencies in all the
projects. If you want to disable this behavior, set the `recursive-install`
setting to `false`.

![](/img/demos/pnpm-install.svg)

[workspace]: ../workspaces.md

## TL;DR

| 命令                         | 效果                   |
| -------------------------- | -------------------- |
| `pnpm i --offline`         | 僅從儲存區離線安裝套件          |
| `pnpm i --frozen-lockfile` | 不更新 `pnpm-lock.yaml` |
| `pnpm i --lockfile-only`   | 僅更新 `pnpm-lock.yaml` |

## Options for filtering dependencies

Without a lockfile, pnpm has to create one, and it must be consistent regardless of dependencies
filtering, so running `pnpm install --prod` on a directory without a lockfile would still resolve the
dev dependencies, and it would error if the resolution is unsuccessful. The only exception for this rule
are `link:` dependencies.

Without `--frozen-lockfile`, pnpm will check for outdated information from `file:` dependencies, so
running `pnpm install --prod` without `--frozen-lockfile` on an environment where the target of `file:`
has been removed would error.

### --prod, -P

- 預設值：**false**
- 型別：**布林值**

若為 `true`， pnpm 將不會安裝 `devDependencies` 中所列出的任何套件，並會在已安裝的套件中移除它們。
若為 `false`，pnpm 則會安裝所有在 `devDependencies` 及 `dependencies` 中列出的套件。

### --dev, -D

Only `devDependencies` are installed and `dependencies` are removed insofar they
were already installed.

### --no-optional

不安裝 `optionalDependencies`。

## Options

### --force

Force reinstall dependencies: refetch packages modified in store, recreate a lockfile and/or modules directory created by a non-compatible version of pnpm. Install all optionalDependencies even they don't satisfy the current environment(cpu, os, arch).

### --offline

- 預設值：**false**
- 型別：**布林值**

此值為 `true` 時，pnpm 僅會使用儲存區中可用的套件。
如果在本機無法找到套件，則安裝會失敗。

### --prefer-offline

- 預設值：**false**
- 型別：**布林值**

此值為 `true` 時不會檢查快取資料是否過時，但將從伺服器請求遺漏的資料。 若要強制啟用完全離線模式，請使用 `--offline`。

### --no-lockfile

Don't read or generate a `pnpm-lock.yaml` file.

### --lockfile-only

- 預設值：**false**
- 型別：**布林值**

使用此選項時，僅更新 `pnpm-lock.yaml` 與 `package.json`。 不會對 `node_modules` 目錄寫入任何檔案。

### --fix-lockfile

自動修復損壞的 lockfile。

### --frozen-lockfile

- 預設值：
  - 在非 CI 環境：**false**
  - 在 CI 環境：當 lockfile 存在時為 **true**
- 型別：**布林值**

此值為 `true` 時，pnpm 不會產生 lockfile，並且在 lockfile 與清單不同步、需要更新，或 lockfile 不存在時，會使安裝失敗。

此設定值在[CI environments]中預設為 `true`。 用來偵測 CI 環境的程式碼如下：

```js title="https://github.com/watson/ci-info/blob/44e98cebcdf4403f162195fbcf90b1f69fc6e047/index.js#L54-L61"
exports.isCI = !!(
  env.CI || // Travis CI, CircleCI, Cirrus CI, GitLab CI, Appveyor, CodeShip, dsari
  env.CONTINUOUS_INTEGRATION || // Travis CI, Cirrus CI
  env.BUILD_NUMBER || // Jenkins, TeamCity
  env.RUN_ID || // TaskCluster, dsari
  exports.name ||
  false
)
```

[CI environments]: https://github.com/watson/ci-info#supported-ci-tools

### --merge-git-branch-lockfiles

Merge all git branch lockfiles.
[Read more about git branch lockfiles.](../git_branch_lockfiles)

### --reporter=&lt;name\>

- 預設值：
  - For TTY stdout: **default**
  - For non-TTY stdout: **append-only**
- Type: **default**, **append-only**, **ndjson**, **silent**

Allows you to choose the reporter that will log debug info to the terminal about
the installation progress.

- **silent** - no output is logged to the console, not even fatal errors
- **default** - the default reporter when the stdout is TTY
- **append-only** - the output is always appended to the end. 不會進行游標操作
- **ndjson** - the most verbose reporter. Prints all logs in [ndjson](https://github.com/ndjson/ndjson-spec) format

If you want to change what type of information is printed, use the [loglevel] setting.

[loglevel]: ../settings.md#loglevel

### --shamefully-hoist

- 預設值：**false**
- 型別：**布林值**

Creates a flat `node_modules` structure, similar to that of `npm` or `yarn`.
**WARNING**: This is highly discouraged.

### --ignore-scripts

- 預設值：**false**
- 型別：**布林值**

Do not execute any scripts defined in the project `package.json` and its
dependencies.

### --filter &lt;package_selector>

[Read more about filtering.](../filtering.md)

### --resolution-only

Re-runs resolution: useful for printing out peer dependency issues.

import CpuFlag from '../settings/_cpuFlag.mdx'

<CpuFlag />

import OsFlag from '../settings/_osFlag.mdx'

<OsFlag />

import LibcFlag from '../settings/_libcFlag.mdx'

<LibcFlag />
