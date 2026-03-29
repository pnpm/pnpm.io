---
id: pnpm-cli
title: pnpm CLI
---

## Short aliases

Added in: v11.0.0

`pn` is available as a short alias for `pnpm`, and [`pnx`](./cli/pnx.md) as a short alias for `pnpx` (`pnpm dlx`). You can use them anywhere you'd use `pnpm` or `pnpx`:

```sh
pn install
pn add express
pn run build
pn test
pnx create-vue my-app
```

## Differences vs npm

Unlike npm, pnpm validates all options. For example, `pn install --target_arch x64` will
fail as `--target_arch` is not a valid option for `pn install`.

However, some dependencies may use the `npm_config_` environment variable, which
is populated from the CLI options. In this case, you have the following options:

1. explicitly set the env variable: `npm_config_target_arch=x64 pn install`
1. force the unknown option with `--config.`: `pn install --config.target_arch=x64`

## Options

### -C &lt;path\>, --dir &lt;path\>

Run as if pnpm was started in `<path>` instead of the current working directory.

### -w, --workspace-root

Run as if pnpm was started in the root of the [workspace](./workspaces.md)
instead of the current working directory.

## Commands

For more information, see the documentation for individual CLI commands. Here is
a list of handy npm equivalents to get you started:

| npm command     | pnpm equivalent    |
|-----------------|--------------------|
| `npm install`   | [`pn install`]     |
| `npm i <pkg>`   | [`pn add <pkg>`]   |
| `npm run <cmd>` | [`pn <cmd>`]       |
| `npx <pkg>`     | [`pnx <pkg>`]      |

When an unknown command is used, pnpm will search for a script with the given name,
so `pn run lint` is the same as `pn lint`. If there is no script with the specified name,
then pnpm will execute the command as a shell script, so you can do things like `pn eslint` (see [`pn exec`]).

[`pn install`]: ./cli/install.md
[`pn add <pkg>`]: ./cli/add.md
[`pn <cmd>`]: ./cli/run.md
[`pn exec`]: ./cli/exec.md
[`pnx <pkg>`]: ./cli/pnx.md

## Environment variables

Some environment variables that are not pnpm related might change the behaviour of pnpm:

* [`CI`](./cli/install.md#--frozen-lockfile)

These environment variables may influence what directories pnpm will use for storing global information:

* `XDG_CACHE_HOME`
* `XDG_CONFIG_HOME`
* `XDG_DATA_HOME`
* `XDG_STATE_HOME`

You can search the docs to find the settings that leverage these environment variables.
