---
id: pnpm-cli
title: pnpm CLI
---

## Short aliases

Added in: v11.0.0

`pn` is available as a short alias for `pnpm`, and [`pnx`](./cli/pnx.md) as a short alias for `pnpm dlx`. You can use them anywhere you'd use `pnpm` or `pnpx`:

```sh
pn install
pn add express
pn build
pn test
pnx create-vue my-app
```

## 與 npm 的差異

與 npm 不同，pnpm 會核對所有的選項。 例如 `pnpm install --target_arch x64` 會發生錯誤，因為 `--target_arch` 並非 `pnpm install` 的合法選項。

不過，部分依賴套件可能會使用 `npm_config_` 環境變數，該變數是來自 CLI 的選項。 這時候有兩種做法：

1. 顯式設定 env 變數：`npm_config_target_arch=x64 pnpm install`
1. 以 `--config` 強制使用未知的選項：`pnpm install --config.target_arch=x64`

## 選項

### -C &lt;path\>, --dir &lt;path\>

取代目前的工作目錄改由 `<path>` 為開頭的路徑執行 pnpm。

### -w, --workspace-root

Run as if pnpm was started in the root of the [workspace](./workspaces.md) instead of the current working directory.

## 命令

有關更多的資訊，請參閱各別 CLI 指令的文件。 以下為一些簡易的 npm 等價命令，可幫助您入門：

| npm 的命令               | pnpm 的等價命令               |
| --------------------- | ------------------------ |
| `npm install`         | [`pnpm install`][]       |
| `npm i <pkg>`   | [`pnpm add <pkg>`] |
| `npm run <cmd>` | [`pnpm <cmd>`]     |
| `npx <pkg>`     | [`pnx <pkg>`]      |

當使用未知的命令時，pnpm 將會搜尋具相同名稱的指令檔，因此 `pnpm run lint` 等同 `pnpm lint`。 If there is no script with the specified name, then pnpm will execute the command as a shell script, so you can do things like `pnpm eslint` (see [`pnpm exec`][]).

## Environment variables

Some environment variables that are not pnpm related might change the behaviour of pnpm:

* [`CI`](./cli/install.md#--frozen-lockfile)

These environment variables may influence what directories pnpm will use for storing global information:

* `XDG_CACHE_HOME`
* `XDG_CONFIG_HOME`
* `XDG_DATA_HOME`
* `XDG_STATE_HOME`

You can search the docs to find the settings that leverage these environment variables.

[`pnpm install`]: ./cli/install.md
[`pnpm exec`]: ./cli/exec.md
