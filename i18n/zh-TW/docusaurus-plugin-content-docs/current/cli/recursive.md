---
id: recursive
title: pnpm -r, --recursive
---

Aliases: `m`, `multi`, `recursive`, `<command> -r`

Runs a command in every project of a workspace, when used with the following commands:

* `install`
* `list`
* `outdated`
* `publish`
* `pack`
* `rebuild`
* `remove`
* `unlink`
* `update`
* `why`

Runs a command in every project of a workspace, excluding the root project, when used with the following commands:

* `exec`
* `run`
* `test`
* `add`

If you want the root project be included even when running scripts, set the [includeWorkspaceRoot][] setting to `true`.

使用範例：

```
pnpm -r publish
```

## Options

### --link-workspace-packages

* 預設值：**false**
* 類型：**true, false, deep**

Link locally available packages in workspaces of a monorepo into `node_modules` instead of re-downloading them from the registry. This emulates functionality similar to `yarn workspaces`.

When this is set to deep, local packages can also be linked to subdependencies.

Be advised that it is encouraged instead to use [`pnpm-workspace.yaml`][] for this setting, to enforce the same behaviour in all environments. This option exists solely so you may override that if necessary.

### --workspace-concurrency

* 預設值：**4**
* 類型：**Number**

Set the maximum number of tasks to run simultaneously. For unlimited concurrency use `Infinity`.

You can set the `workspace-concurrency` as `<= 0` and it will use amount of cores of the host as: `max(1, (number of cores) - abs(workspace-concurrency))`

### --[no-]bail

* 預設值：**true**
* 類型：**Boolean**

If true, stops when a task throws an error.

This config does not affect the exit code. Even if `--no-bail` is used, all tasks will finish but if any of the tasks fail, the command will exit with a non-zero code.

Example (run tests in every package, continue if tests fail in one of them):
```sh
pnpm -r --no-bail test
```

### --[no-]sort

* 預設值：**true**
* 類型：**Boolean**

When `true`, packages are sorted topologically (dependencies before dependents). Pass `--no-sort` to disable.

例如：
```sh
pnpm -r --no-sort test
```

### --reverse

* 預設值：**false**
* 類型：**boolean**

When `true`, the order of packages is reversed.

```
pnpm -r --reverse run clean
```

### --filter &lt;package_selector\>

[閱讀更多關於 filter 的資訊。](../filtering.md)

[`pnpm-workspace.yaml`]: ../settings.md#linkWorkspacePackages

[includeWorkspaceRoot]: ../settings.md#includeWorkspaceRoot
