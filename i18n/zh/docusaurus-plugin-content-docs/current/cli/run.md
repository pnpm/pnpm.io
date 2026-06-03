---
id: run
title: pnpm run
---

别名: `run-script`

运行在软件包清单文件中定义的脚本。

## 示例

假如你有个 `watch` 脚本配置在了 `package.json` 中，像这样：

```json
"scripts": {
    "watch": "webpack --watch"
}
```

你现在可以使用 `pnpm run watch` 运行该脚本！ 很简单吧？ 对于那些不喜欢敲键盘而浪费时间的人要注意的另一件事是，所有脚本都会有 pnpm 命令的别名，所以最终 `pnpm run watch` 的简写是 `pnpm watch` （**仅适用于**那些不与已有的 pnpm 命令相同名字的脚本）。

## 运行多个脚本

你可以使用正则表达式来替代脚本名称从而同时运行多个脚本。

```sh
pnpm run "/<regex>/"
```

运行所有以 `watch:` 开头的脚本。

```sh
pnpm run "/^watch:.*/"
```

## 详情

除了 shell 先前存在的 `PATH`， `pnpm run` 也包括在 `PATH` 中的 `node_modules/.bin` 提供的 `scripts`。 这意味着，只要你安装了一个包，你就可以像常规命令一样在脚本中使用它。 例如，如果你已经安装了 `eslint`，你可以这样写一个脚本：

```json
"lint": "eslint src --fix"
```

即使 `eslint` 没有在你的 shell 中全局安装，它也会运行。

对于工作空间， `<workspace root>/node_modules/.bin` 也会被添加到 到 `PATH` 中，因此如果在工作空间根目录中安装了工具，则可以在工作空间中任何软件包的 `scripts` 中调用它。

## 运行环境

pnpm 会自动为执行的脚本创建一些环境变量。 这些环境变量可用于获取有关正在运行的进程的上下文信息。

以下是 pnpm 会创建的环境变量：

* **npm_command** - 包含已执行命令的名称。 如果执行的命令是 `pnpm run`，那么这个变量的值就是“run-script”。

## 配置项

`run` 命令的选项都应被列在脚本名称之前。 脚本名称后列出的options将传递给执行的脚本。

例如下面这些都将使用 `--silent` 选项运行 pnpm CLI：

```sh
pnpm run --silent watch
pnpm --silent run watch
pnpm --silent watch
```

脚本名称后的任何参数都将添加到执行的脚本中。 所以如果 `watch` 运行 `webpack --watch`，那么这个命令：

```sh
pnpm run watch --no-color
```

将运行：

```sh
webpack --watch --no-color
```

### --recursive, -r

这会从每个包的 "scripts" 字段中运行任意一个命令。 如果包没有该命令，则会跳过该命令。 如果所有包都没有该命令，则该命令将失败。

### --if-present

可以使用 `--if-present` 标志避免遇到脚本未定义导致通过非零的退出代码退出的情况。 这使你可以在不中断执行链的情况下运行可能未定义的脚本。

### --parallel

完全忽略并发和拓扑排序，在所有匹配的包中立即运行给定的脚本 并输出前缀流。 对于许多包中长时间运行的进程，这是首选标志，例如漫长的构建进程。

### --stream

立即从子进程流式传输输出，并以原始包目录为前缀。 这使得不同包的输出可以交错。

### --aggregate-output

聚合并行运行的子进程的输出，并且仅在子进程完成时打印输出。 它使在运行 `pnpm -r <command>` 时使用 `--parallel` 或 `--workspace-concurrency=<number>` 后读取大日志更容易（尤其是在 CI 上）。 仅支持 `--reporter=append-only`。

### --resume-from &lt;package_name\>

从特定项目恢复执行。 如果你正在使用大型工作空间，并且想要在不运行先前项目的情况下从特定项目重新启动构建，那么这可能非常有用。

### --report-summary

将脚本执行的结果记录到 `pnpm-exec-summary.json` 文件中。

`pnpm-exec-summary.json`的示例：

```json
{
  "executionStatus": {
    "/Users/zoltan/src/pnpm/pnpm/cli/command": {
      "status": "passed",
      "duration": 1861.143042
    },
    "/Users/zoltan/src/pnpm/pnpm/cli/common-cli-options-help": {
      "status": "passed",
      "duration": 1865.914958
    }
  }
```

`status` 的可能值为：“passed”、“queued”、“running”。

### --reporter-hide-prefix

从并行运行的子进程的输出中隐藏工作空间前缀，并且仅打印原始输出。 如果你在 CI 上运行并且输出必须是不带任何前缀的特定格式（例如 [GitHub Actions annotations](https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-an-error-message)），这会很有用。 仅支持 `--reporter=append-only`。

### --filter &lt;package_selector\>

[阅读更多有关过滤的内容。](../filtering.md)

## pnpm-workspace.yaml 设置

import EnablePrePostScripts from '../settings/_enablePrePostScripts.mdx'

<EnablePrePostScripts />

import ScriptShell from '../settings/_scriptShell.mdx'

<ScriptShell />

import ShellEmulator from '../settings/_shellEmulator.mdx'

<ShellEmulator />
