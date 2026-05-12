---
id: exec
title: pnpm exec
---

在專案的範圍中執行 Shell 命令。

`node_modules/.bin` 會被添加到 `PATH`，因此 `pnpm exec` 允許執行依賴關係的命令。

## 範例

如果您的專案使用 Jest 作為依附套件，則無需全域安裝 Jest，只需使用 `pnpm exec` 執行它：

```
pnpm exec jest
```

當命令名稱與 pnpm 的內建命令不衝突時，實際上 `exec` 是可省略的，因此您也可以只執行：

```
pnpm jest
```

## 選項

有關 `exec` 命令的選項需置於 `exec` 關鍵字前。 置於 `exec` 關鍵字後的選項將會提供給執行的命令。

正確範例， pnpm 將遞迴地執行：

```
pnpm -r exec jest
```

錯誤範例，pnpm 不會遞迴地執行，但 `jest` 會以 `-r` 選項執行：

```
pnpm exec jest -r
```

### --recursive, -r

在 workspace 的每個專案中都執行 shell 命令。

可透過環境變數 `PNPM_PACKAGE_NAME` 取得目前的套件名稱。

#### 範例

刪去所有套件安裝在 `node_modules` 的檔案：

```
pnpm -r exec rm -rf node_modules
```

檢視所有套件的詳細資訊。 此命令應與 `--shell-mode`（同 `-c`）選項使用，以使環境變數作用。

```
pnpm -rc exec pnpm view \$PNPM_PACKAGE_NAME
```

### --no-reporter-hide-prefix

Do not hide prefix when running commands in parallel.

### --resume-from &lt;package_name>

Resume execution from a particular project. This can be useful if you are working with a large workspace and you want to restart a build at a particular project without running through all of the projects that precede it in the build order.

### --parallel

Completely disregard concurrency and topological sorting, running a given script immediately in all matching packages. This is the preferred flag for long-running processes over many packages, for instance, a lengthy build process.

### --shell-mode, -c

在 shell 中執行此命令。 使用的 shell 依系統而定， UNIX 系統中使用 `/bin/sh`；Windows 中使用 `\cmd.exe`。

### --report-summary

[Read about this option in the run command docs](./run.md#--report-summary)

### --filter &lt;package_selector\>

[Read more about filtering.](../filtering.md)
