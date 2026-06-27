---
id: filtering
title: 过滤
---

过滤允许你将命令限制于软件包的特定子集。

pnpm 支持丰富的选择器语法，可以通过名称或关系选择包。

可通过 `--filter` (或 `-F`) 标志指定选择器:

```sh
pnpm --filter <package_selector> <command>
```

## 匹配

### --filter &lt;package_name>

要选择准确的包，只需指定其名称 (`@scope/pkg`) 或使用
模式来选择一组包 (`@scope/*`)。

示例：

```sh
pnpm --filter "@babel/core" test
pnpm --filter "@babel/*" test
pnpm --filter "*core" test
```

指定包的范围是可选的，因此如果未找到 `core`，`--filter=core` 将选择 `@babel/core`。
但是，如果工作空间有多个同名的包（例如，`@babel/core` 和 `@types/core`），则没有范围的过滤将不会选择任何内容。

### --filter &lt;package_name>...

要选择一个软件包及其依赖项（直接和非直接），请在包名称后加上省略号： `<package_name>...`。 例如，下一个命令将运行 `foo` 及其所有依赖的测试：

```sh
pnpm --filter foo... test
```

你可以使用模式来选择一组根目录包：

```sh
pnpm --filter "@babel/preset-*..." test
```

### --filter &lt;package_name>^...

要**只**选择一个包的依赖项(直接和非直接)，在包名前添加一个山形符号加上先前提到的省略号。 例如，下面的命令将运行所有 `foo` 的依赖项的测试：

```sh
pnpm --filter "foo^..." test
```

### --filter ...&lt;package_name>

要选择一个包及被其依赖的包(直接和非直接)，在包名前添加一个省略号: `...<package_name>`。 例如，这将运行 `foo` 以及依赖于它的所有包的测试：

```sh
pnpm --filter ...foo test
```

### --filter "...^&lt;package_name>"

要只选择一个包的被依赖项 (直接和非直接) ，在包名前添加一个省略号与山形符号。 例如，这将运行所有依赖于 `foo` 的包的测试：

```text
pnpm --filter "...^foo" test
```

### --filter `./<glob>`, --filter `{<glob>}`

相对于当前工作目录匹配项目的全局模式。

```sh
pnpm --filter "./packages/**" <cmd>
```

包括指定目录下的所有项目。

也可以使用省略号与山形符号来选择依赖项与被依赖项：

```sh
pnpm --filter ...{<directory>} <cmd>
pnpm --filter {<directory>}... <cmd>
pnpm --filter ...{<directory>}... <cmd>
```

它也可以与 `[<since>]` 结合使用。 例如，在某个目录中选择所有已更改的项目：

```sh
pnpm --filter "{packages/**}[origin/master]" <cmd>
pnpm --filter "...{packages/**}[origin/master]" <cmd>
pnpm --filter "{packages/**}[origin/master]..." <cmd>
pnpm --filter "...{packages/**}[origin/master]..." <cmd>
```

或者你可以从某个目录中选择符合给定的通配符的所有包：

```text
pnpm --filter "@babel/*{components/**}" <cmd>
pnpm --filter "@babel/*{components/**}[origin/master]" <cmd>
pnpm --filter "...@babel/*{components/**}[origin/master]" <cmd>
```

### --filter "[&lt;since>]"

选择自指定的提交/分支以来有更改的所有包。 可以在前后添加 `...` 来包括依赖项/被依赖项：

例如，以下命令将运行自 `master` 以来所有变动过的包以及被其依赖的包的测试：

```sh
pnpm --filter "...[origin/master]" test
```

### --fail-if-no-match

如果你希望 CLI 在没有包与过滤器匹配的情况下失败，请使用此标志。

你也可以使用 [`failIfNoMatch` 设置][`failIfNoMatch` setting] 永久设置此行为。

[`failIfNoMatch` setting]: workspaces.md#failifnomatch

## 排除

任何过滤规则选择器都可以作为排除项，只要在开头添加一个"!"。 在 zsh (可能还有其他 shells) 中, "!" 应转义: `\!`.

例如，这将在除 `foo` 以外的所有项目中运行一个命令：

```sh
pnpm --filter=!foo <cmd>
```

然后这将在所有不在 `lib` 目录下的项目中运行一个命令：

```sh
pnpm --filter=!./lib <cmd>
```

## 多重性

当包被过滤时，每个都会被匹配到至少一个选择器。 你可以使用无限数量的过滤器：

```sh
pnpm --filter ...foo --filter bar --filter baz... test
```

## --filter-prod &lt;filtering_pattern>

在从工作区选择依赖项时，会忽略 `devDependencies`，其余行为与 `--filter` 一致。

## --test-pattern &lt;glob>

`test-pattern` 允许检测修改后的文件是否与测试有关。
如果是这样，经这种修改的包的被依赖包不会包括在内。

此选项对 "changed since" 过滤器很有用。 例如，以下命令将在所有更改的包中运行测试， 如果包的源码发生变更，则测试也将在其依赖的包中运行：

```sh
pnpm --filter="...[origin/master]" --test-pattern="test/*" test
```

## --changed-files-ignore-pattern &lt;glob>

在筛选自指定提交/分支以来更改的项目时，允许通过 glob 模式忽略已更改的文件。

用法示例：

```sh
pnpm --filter="...[origin/master]" --changed-files-ignore-pattern="**/README.md" run build
```
