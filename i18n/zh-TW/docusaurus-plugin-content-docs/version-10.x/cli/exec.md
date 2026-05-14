---
id: exec
title: pnpm exec
---

在專案的範圍中執行 Shell 命令。

`node_modules/.bin` is added to the `PATH`, so `pnpm exec` allows executing commands of dependencies.

## Examples

If you have Jest as a dependency of your project, there is no need to install Jest globally, just run it with `pnpm exec`:

```
pnpm exec jest
```

The `exec` part is actually optional when the command is not in conflict with a builtin pnpm command, so you may also just run:

```
pnpm jest
```

## Options

Any options for the `exec` command should be listed before the `exec` keyword.
Options listed after the `exec` keyword are passed to the executed command.

正確範例， pnpm 將遞迴地執行：

```
pnpm -r exec jest
```

Bad, pnpm will not run recursively but `jest` will be executed with the `-r` option:

```
pnpm exec jest -r
```

### --recursive, -r

在 workspace 的每個專案中都執行 shell 命令。

The name of the current package is available through the environment variable
`PNPM_PACKAGE_NAME`.

#### Examples

Prune `node_modules` installations for all packages:

```
pnpm -r exec rm -rf node_modules
```

檢視所有套件的詳細資訊。 This should be used with the `--shell-mode` (or `-c`) option for the environment variable to work.

```
pnpm -rc exec pnpm view \$PNPM_PACKAGE_NAME
```

### --no-reporter-hide-prefix

Do not hide prefix when running commands in parallel.

### --resume-from &amp;lt;package_name\>

Resume execution from a particular project. This can be useful if you are working with a large workspace and you want to restart a build at a particular project without running through all of the projects that precede it in the build order.

### --parallel

Completely disregard concurrency and topological sorting, running a given script
immediately in all matching packages. This is the
preferred flag for long-running processes over many packages, for instance, a
lengthy build process.

### --shell-mode, -c

在殼層中執行命令。 Uses `/bin/sh` on UNIX and `\cmd.exe` on Windows.

### --report-summary

[Read about this option in the run command docs](./run.md#--report-summary)

### --filter &amp;lt;package_selector\>

[Read more about filtering.](../filtering.md)
