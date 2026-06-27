---
id: install
title: pnpm install
---

别名: `i`

`pnpm install` 用于安装项目所有依赖.

在 CI 环境中, 如果存在锁文件但需要更新，那么安装会失败.

在[工作空间][]内, `pnpm install` 会在所有项目中安装所有依赖. 如果想禁用这个行为, 将 `recursive-install` 设置为 `false`。

![](/img/demos/pnpm-install.svg)

## 摘要

| 命令                         | 含义                   |
| -------------------------- | -------------------- |
| `pnpm i --offline`         | 仅从存储中离线安装            |
| `pnpm i --frozen-lockfile` | 不更新 `pnpm-lock.yaml` |
| `pnpm i --lockfile-only`   | 只更新 `pnpm-lock.yaml` |

## 过滤依赖项的选项

如果没有锁文件，pnpm 必须创建一个，并且无论依赖项 如何过滤，它都必须保持一致，因此在没有锁文件的目录上运行 `pnpm install --prod` 仍然会解析 dev 依赖项，如果解析不成功，则会出错。 此规则的唯一例外是 `link:` 依赖项。

如果没有 `--frozen-lockfile`，pnpm 将检查 `file:` 依赖项中的过时信息，因此在 `file:` 的目标已被删除的环境中，运行 `pnpm install --prod` 而不使用 `--frozen-lockfile` 会出现错误。

### --prod, -P

* 默认值： **false**
* 类型：**Boolean**

如果 `true`，pnpm 将不会安装 `devDependencies` 中列出的任何软件包，并将删除已安装的软件包。 如果 `false`，pnpm 将安装 `devDependencies` 和 `dependencies`中列出的所有软件包。

### --dev, -D

仅安装 `devDependencies` 并且删除 `dependencies` 即使它们已经安装。

### --no-optional

不安装 `optionalDependencies`。

## 配置项

### --force

强制重新安装依赖：重新获取存储中修改的软件包，重新创建由不兼容版本的 pnpm 创建的锁文件和（或）模块目录。 安装所有的可选依赖，即使它们不满足当前环境（cpu、os、arch）。

### --offline

* 默认值： **false**
* 类型：**Boolean**

如果为 `true`，pnpm 将仅使用存储中已有的包。 如果本地找不到包, 则会安装失败。

### --prefer-offline

* 默认值： **false**
* 类型：**Boolean**

如果为 `true`，将跳过对缓存数据的过期检查，但会从服务器请求缺失的数据。 要强制完全离线模式，使用 `--offline`。

### --no-lockfile

不要读取或生成 `pnpm-lock.yaml` 文件。

### --lockfile-only

* 默认值：**false**
* 类型：**Boolean**

使用时，只更新 `pnpm-lock.yaml` 和 `package.json`。 不会向 `node_modules` 目录写入任何内容。

### --fix-lockfile

自动修复损坏的锁文件入口。

### --frozen-lockfile

* 默认值：
  * 非 CI: **false**
  * CI: 如果存在锁文件，则为 **true**
* 类型：**Boolean**

如果设置为 `true`, pnpm 不会生成锁文件，且如果锁文件跟清单文件不同步、锁文件需要更新或不存在锁文件，则会安装失败。

在 [CI 环境][]中，该设置默认为 `true`。 以下代码用于检测 CI 环境：

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

### --merge-git-branch-lockfiles

合并所有 Git 分支上的锁文件。 [阅读有关 Git 分支锁文件的更多信息。](../git_branch_lockfiles)


### --reporter=&lt;name\>

* 默认值：
    * TTY stdout: **default**
    * 非 TTY stdout: **append-only**
* 类型：**default**, **append-only**, **ndjson**, **silent**

允许你选择向终端输出有关安装进度的调试信息的报告程序。

* **silent** - 不会向控制台记录任何信息，甚至不包含致命错误
* **default** - 标准输出是 TTY 时的默认报告程序
* **append-only** - 始终向末尾追加输出。 不执行任何光标操作
* **ndjson** - 最详细报告. 以 [ndjson](https://github.com/ndjson/ndjson-spec) 格式打印所有日志

如果你想更改日志打印的信息类型，请使用 [loglevel][] 设置。

### --shamefully-hoist

* 默认值：**false**
* 类型：**Boolean**

创建一个扁平`node_modules` 目录结构，类似于`npm` 或 `yarn`。 **警告**：强烈不建议这么做。

### --ignore-scripts

* 默认值： **false**
* 类型：**Boolean**

不执行项目的 `package.json `及其依赖定义的任何脚本。

### --filter &lt;package_selector>

[阅读更多有关过滤的内容。](../filtering.md)

### --resolution-only

重新进行解析：对于打印出对等依赖问题很有用。

import CpuFlag from '../settings/_cpuFlag.mdx'

<CpuFlag />

import OsFlag from '../settings/_osFlag.mdx'

<OsFlag />

import LibcFlag from '../settings/_libcFlag.mdx'

<LibcFlag />

[工作空间]: ../workspaces.md

[CI 环境]: https://github.com/watson/ci-info#supported-ci-tools

[loglevel]: ../settings.md#loglevel
