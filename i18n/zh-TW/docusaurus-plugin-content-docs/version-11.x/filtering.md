---
id: filtering
title: 篩選
---

篩選功能允許您將命令限制為特定的套件子集合。

pnpm 支援豐富多元的選取器語法，可使用名稱或關係選取套件。

Selectors may be specified via the `--filter` (or `-F`) flag:

```sh
pnpm --filter <package_selector> <command>
```

## 比對

### --filter &lt;package_name>

To select an exact package, just specify its name (`@scope/pkg`) or use a
pattern to select a set of packages (`@scope/*`).

Examples:

```sh
pnpm --篩選 "@babel/core" 測試
pnpm --篩選 "@babel/*" 測試
pnpm --篩選 "*core" 測試
```

Specifying the scope of the package is optional, so `--filter=core` will pick `@babel/core` if `core` is not found.
However, if the workspace has multiple packages with the same name (for instance, `@babel/core` and `@types/core`),
then filtering without scope will pick nothing.

### --filter &lt;package_name>...

To select a package and its dependencies (direct and non-direct), suffix the
package name with an ellipsis: `<package_name>...`. For instance, the next
command will run tests of `foo` and all of its dependencies:

```sh
pnpm --filter foo... test
```

您可以使用模式來選擇一組根封裝:

```sh
pnpm --filter "@babel/preset-*..." test
```

### --filter &lt;package_name>^...

若要僅選取封裝的相依項 (直接和非直接)，
請以前述的省略符號搭配＞形箭號作為名稱尾碼。 For
instance, the next command will run tests for all of `foo`'s
dependencies:

```sh
pnpm --filter "foo^..." test
```

### --filter ...&lt;package_name>

To select a package and its dependent packages (direct and non-direct), prefix
the package name with an ellipsis: `...<package_name>`. For instance, this will
run the tests of `foo` and all packages dependent on it:

```sh
pnpm --filter ...foo test
```

### --filter "...^&lt;package_name>"

若要僅選擇封裝的相依項 (直接和非直接)，請以省略符號之後跟隨＞形箭號
作為封裝名稱首碼。 For instance, this will
run tests for all packages dependent on `foo`:

```text
pnpm --filter "...^foo" test
```

### --filter `./<glob>`, --filter `{<glob>}`

相對於當前工作目錄相符專案的 Glob 模式。

```sh
pnpm --filter "./packages/**" <cmd>
```

包括指定目錄下的所有專案。

也可以與省略符號和＞形符號運算子一起使用，以選取
依存項/相依項:

```sh
pnpm --filter ...{<directory>} <cmd>
pnpm --filter {<directory>}... <cmd>
pnpm --filter ...{<directory>}... <cmd>
```

It may also be combined with `[<since>]`. 例如，要選取目錄中所有已變更的
專案:

```sh
pnpm --filter "{packages/**}[origin/master]" <cmd>
pnpm --filter "...{packages/**}[origin/master]" <cmd>
pnpm --filter "{packages/**}[origin/master]..." <cmd>
pnpm --filter "...{packages/**}[origin/master]..." <cmd>
```

或者，您可以從名稱與給定
模式相符的目錄中選取所有封裝:

```text
pnpm --filter "@babel/*{components/**}" <cmd>
pnpm --filter "@babel/*{components/**}[origin/master]" <cmd>
pnpm --filter "...@babel/*{components/**}[origin/master]" <cmd>
```

### --filter "[&lt;since>]"

選取自指定認可/分支變更的所有封裝。 May be
suffixed or prefixed with `...` to include dependencies/dependents.

For example, the next command will run tests in all changed packages since
`master` and on any dependent packages:

```sh
pnpm --filter "...[origin/master]" test
```

### --fail-if-no-match

Use this flag if you want the CLI to fail if no packages have matched the filters.

You may also set this permanently with a [`failIfNoMatch` setting].

[`failIfNoMatch` setting]: workspaces.md#failifnomatch

## 排除

任何篩選器規則都可以執行排除操作，只需在前綴加上 "！"。 In zsh (and possibly other shells), "!" should be escaped: `\!`.

For instance, this will run a command in all projects except for `foo`:

```sh
pnpm --filter=!foo <cmd>
```

And this will run a command in all projects that are not under the `lib`
directory:

```sh
pnpm --filter=!./lib <cmd>
```

## 使用多個篩選器

當套件被篩選後，所有的套件都會匹配至少一個篩選器。 您可以同時使用多個篩選器：

```sh
pnpm --filter ...foo --filter bar --filter baz... test
```

## --filter-prod &lt;filtering_pattern>

Acts the same a `--filter` but omits `devDependencies` when selecting dependency projects
from the workspace.

## --test-pattern &lt;glob>

`test-pattern` allows detecting whether the modified files are related to tests.
如果是，此被修改套件的被依賴套件將不會被包含在內。

此選項對 "changed since" 篩選器很有用。 例如，下方指令將在所有變更中的套件執行測試，若變更在套件的原始碼當中，測試也經在其被依賴的套件中執行：

```sh
pnpm --filter="...[origin/master]" --test-pattern="test/*" test
```

## --changed-files-ignore-pattern &lt;glob>

允許在篩選自指定的提交/分支變更的專案中，通過 glob 樣本需略變更的檔案。

使用範例：

```sh
pnpm --filter="...[origin/master]" --changed-files-ignore-pattern="**/README.md" run build
```
