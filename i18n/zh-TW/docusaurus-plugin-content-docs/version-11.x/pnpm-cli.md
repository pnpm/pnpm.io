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

與 npm 不同，pnpm 會核對所有的選項。 For example, `pnpm install --target_arch x64` will
fail as `--target_arch` is not a valid option for `pnpm install`.

However, some dependencies may use the `npm_config_` environment variable, which
is populated from the CLI options. 這時候有兩種做法：

1. explicitly set the env variable: `npm_config_target_arch=x64 pnpm install`
2. force the unknown option with `--config.`: `pnpm install --config.target_arch=x64`

## Options

### -C &lt;path\>, --dir &lt;path\>

Run as if pnpm was started in `<path>` instead of the current working directory.

### -w, --workspace-root

Run as if pnpm was started in the root of the [workspace](./workspaces.md)
instead of the current working directory.

## 命令

有關更多的資訊，請參閱各別 CLI 指令的文件。 以下為一些簡易的 npm 等價命令，可幫助您入門：

| npm 的命令         | pnpm 的等價命令         |
| --------------- | ------------------ |
| `npm install`   | [`pnpm install`]   |
| `npm i <pkg>`   | [`pnpm add <pkg>`] |
| `npm run <cmd>` | [`pnpm <cmd>`]     |
| `npx <pkg>`     | [`pnx <pkg>`]      |

When an unknown command is used, pnpm will search for a script with the given name,
so `pnpm run lint` is the same as `pnpm lint`. If there is no script with the specified name,
then pnpm will execute the command as a shell script, so you can do things like `pnpm eslint` (see [`pnpm exec`]).

[`pnpm install`]: ./cli/install.md
[`pnpm add <pkg>`]: ./cli/add.md
[`pnpm <cmd>`]: ./cli/run.md
[`pnpm exec`]: ./cli/exec.md
[`pnx <pkg>`]: ./cli/pnx.md

## Environment variables

Some environment variables that are not pnpm related might change the behaviour of pnpm:

- [`CI`](./cli/install.md#--frozen-lockfile)

These environment variables may influence what directories pnpm will use for storing global information:

- `XDG_CACHE_HOME`
- `XDG_CONFIG_HOME`
- `XDG_DATA_HOME`
- `XDG_STATE_HOME`

You can search the docs to find the settings that leverage these environment variables.
