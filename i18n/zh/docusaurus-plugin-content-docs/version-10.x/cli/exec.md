---
id: exec
title: pnpm exec
---

在项目范围内执行 shell 命令。

`node_modules/.bin` 被添加到 `PATH`，因此 `pnpm exec` 允许执行依赖项的命令。

## 示例

如果你将 Jest 作为你项目的依赖项，则无需全局安装 Jest，只需使用 `pnpm exec` 运行它即可：

```
pnpm exec jest
```

当命令与内置 pnpm 命令不冲突时， exec 部分实际上是可选的，因此你也可以运行：

```
pnpm jest
```

## 配置项

`exec` 命令的任何选项都应该在 `exec` 关键字之前列出。
在 `exec` 关键字之后列出的选项都将被传递给被执行的命令。

好的做法。 pnpm 将以递归的方式运行：

```
pnpm -r exec jest
```

糟糕的做法，pnpm 将不会以递归方式运行，但 jest 将使用 `-r` 选项执行。

```
pnpm exec jest -r
```

### --recursive, -r

在工作区的每个项目中执行 shell 命令。

当前软件包的名称可通过环境变量 `PNPM_PACKAGE_NAME` 获取。

#### 示例

为所有的软件包清理 `node_modules` 安装。

```
pnpm -r exec rm -rf node_modules
```

查看所有包的包信息。 这应该与 --shell-mode（或 -c）选项一起使用，以使环境变量起作用。

```
pnpm -rc exec pnpm view \$PNPM_PACKAGE_NAME
```

### --no-reporter-hide-prefix

并行运行命令时不隐藏前缀。

### --resume-from &amp;lt;package_name\>

从特定项目恢复执行。 如果你正在使用大型工作空间，并且想要在不运行先前项目的情况下从特定项目重新启动构建，那么这可能非常有用。

### --parallel

完全忽略并发和拓扑排序，在所有匹配的包中立即运行给定的脚本。 对于许多包中长时间运行的进程，这是首选标志，例如漫长的构建进程。

### --shell-mode, -c

在 shell 中运行该命令。 在 UNIX 上使用 `/bin/sh`，在 Windows 上使用 `\cmd.exe`。

### --report-summary

[在运行命令文档中阅读有关此选项的信息](./run.md#--report-summary)

### --filter &amp;lt;package_selector\>

[阅读更多有关过滤的内容。](../filtering.md)
