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

## Diferencias con npm

A diferencia de npm, pnpm valida todas las opciones. For example, `pnpm install --target_arch x64` will
fail as `--target_arch` is not a valid option for `pnpm install`.

However, some dependencies may use the `npm_config_` environment variable, which
is populated from the CLI options. En este caso, tienes las siguientes opciones:

1. explicitly set the env variable: `npm_config_target_arch=x64 pnpm install`
2. force the unknown option with `--config.`: `pnpm install --config.target_arch=x64`

## Opciones

### -C &lt;path\>, --dir &lt;path\>

Run as if pnpm was started in `<path>` instead of the current working directory.

### -w, --workspace-root

Run as if pnpm was started in the root of the [workspace](./workspaces.md)
instead of the current working directory.

## Commands

Si deseas aprender más, puede visitar la documentación para cada comando de pnpm CLI de forma individual. Aqui hay una lista de comandos útiles de npm y su equivalente en pnpm:

| npm command     | pnpm equivalent    |
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

## Variables de entorno

Algunas variables de entorno que no están relacionadas con pnpm pueden cambiar el comportamiento de pnpm:

- [`CI`](./cli/install.md#--frozen-lockfile)

Estas variables de entorno pueden influir en los directorios que utilizará pnpm para almacenar información global:

- `XDG_CACHE_HOME`
- `XDG_CONFIG_HOME`
- `XDG_DATA_HOME`
- `XDG_STATE_HOME`

Puede buscar en la documentación para encontrar los ajustes que aprovechan estas variables de entorno.
