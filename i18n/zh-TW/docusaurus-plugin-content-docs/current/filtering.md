---
id: filtering
title: 篩選
---

篩選功能允許您將命令限制為特定的套件子集合。

pnpm 支援豐富多元的選取器語法，可使用名稱或關係選取套件。

選擇器可以透過 `--filter` (或 `-F`) 標籤指定選擇器：

```sh
pnpm --篩選 <package_selector> <command>
```

## 比對

### --篩選 &lt;package_name>

為了選取一個精確的套件，只需指定它的名稱 (`@scope/pkg`) 或使用一個樣本來選取一組套件 (`@scope/*`)。

範例:

```sh
pnpm --篩選 "@babel/core" 測試
pnpm --篩選 "@babel/*" 測試
pnpm --篩選 "*core" 測試
```

指定套件的範圍是可選的，因此如果找不到 `core`，`--filter=core` 將選取 `@babel/core`。 然而，若工作區具有多個相同名稱的套件 (例如， `@babel/core` 和 `@types/core`)，則沒有範圍的篩選器將不選取任何內容。

### --filter &lt;package_name>...

要選取封裝及其相依性 (直接和非直接)，請在 封裝名稱後綴上省略符號： `<封裝名稱>...`。 例如，下一個 命令將執行 `foo` 及其所有相依性的測試：

```sh
pnpm --filter foo... test
```

您可以使用模式來選擇一組根封裝:

```sh
pnpm --filter "@babel/preset-*..." test
```

### --filter &lt;封裝名稱>^...

若要僅選取封裝的相依項 (直接和非直接)， 請以前述的省略符號搭配＞形箭號作為名稱尾碼。 例如， 下一個命令將執行所有 `foo` 的相依性測試:

```sh
pnpm --filter "foo^..." test
```

### --filter ...&lt;封裝名稱>

要選取封裝及其相依性封裝 (直接和非直接)，請將省略符號作為 封裝名稱首碼: `...<package_name>`。 例如，這將 執行 `foo` 以及其所有相依封裝的測試:

```sh
pnpm --filter ...foo test
```

### --filter "...^&lt;封裝名稱>"

若要僅選擇封裝的相依項 (直接和非直接)，請以省略符號之後跟隨＞形箭號 作為封裝名稱首碼。 例如，這將 為所有相依於 `foo` 的封裝執行測試：

```text
pnpm --filter "...^foo" test
```

### --filter `./<glob>`, --filter `{<glob>}`

相對於當前工作目錄相符專案的 Glob 模式。

```sh
pnpm --filter "./packages/**" <cmd>
```

包括指定目錄下的所有專案。

也可以與省略符號和＞形符號運算子一起使用，以選取 依存項/相依項:

```sh
pnpm --filter ...{<directory>} <cmd>
pnpm --filter {<directory>}... <cmd>
pnpm --filter ...{<directory>}... <cmd>
```

它也可以與 `[<since>]` 結合使用。 例如，要選取目錄中所有已變更的 專案:

```sh
pnpm --filter "{packages/**}[origin/master]" <cmd>
pnpm --filter "...{packages/**}[origin/master]" <cmd>
pnpm --filter "{packages/**}[origin/master]..." <cmd>
pnpm --filter "...{packages/**}[origin/master]..." <cmd>
```

或者，您可以從名稱與給定 模式相符的目錄中選取所有封裝:

```text
pnpm --filter "@babel/*{components/**}" <cmd>
pnpm --filter "@babel/*{components/**}[origin/master]" <cmd>
pnpm --filter "...@babel/*{components/**}[origin/master]" <cmd>
```

### --filter "[&lt;since>]"

選取自指定認可/分支變更的所有封裝。 也可以在前綴或後綴加上 `...` 來包含依賴與被依賴套件。

例如，下方指令將執行來自 `master` 所有變更的套件與其依賴套件的測試：

```sh
pnpm --filter "...[origin/master]" test
```

### --fail-if-no-match

Use this flag if you want the CLI to fail if no packages have matched the filters.

You may also set this permanently with a [`failIfNoMatch` setting][].

## 排除

任何篩選器規則都可以執行排除操作，只需在前綴加上 "！"。 在 zsh (可能還有其他的 shells)，"！" 應被轉譯為 `\!`。

例如，這將會排除所有專案中的 `foo` 下執行指令：

```sh
pnpm --filter=!foo <cmd>
```

而這將會排除所有專案中 `lib` 目錄下的內容執行指令：

```sh
pnpm --filter=!./lib <cmd>
```

## 使用多個篩選器

當套件被篩選後，所有的套件都會匹配至少一個篩選器。 您可以同時使用多個篩選器：

```sh
pnpm --filter ...foo --filter bar --filter baz... test
```

## --filter-prod &lt;filtering_pattern>

從工作區中選擇依賴專案時，會忽略 `devDependencies` 且其餘行為將與 `--filter` 相同。

## --test-pattern &lt;glob>

`test-pattern` 允許檢測修改後的檔案是否與測試有關。 如果是，此被修改套件的被依賴套件將不會被包含在內。

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

[`failIfNoMatch` setting]: workspaces.md#failifnomatch
