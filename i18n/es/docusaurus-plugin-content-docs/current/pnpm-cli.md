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

A diferencia de npm, pnpm valida todas las opciones. Por ejemplo, `pnpm install --target_arch x64` fallará ya que `--target_arch` no es una opción válida para `pnpm install`.

Sin embargo, algunas dependencias pueden usar la variable de entorno `npm_config_` que se completa desde las opciones de la CLI. En este caso, tienes las siguientes opciones:

1. establezca explícitamente la variable env: `npm_config_target_arch=x64 pnpm install`
1. Fuerza la opción desconocida con `--config.`: `pnpm install--config.target_arch=x64`

## Opciones

### -C &lt;path\>, --dir &lt;path\>

Ejecute como si pnpm se hubiera iniciado en `<path>` en lugar del directorio de trabajo actual.

### -w, --workspace-root

Run as if pnpm was started in the root of the [workspace](./workspaces.md) instead of the current working directory.

## Commands

Si deseas aprender más, puede visitar la documentación para cada comando de pnpm CLI de forma individual. Aqui hay una lista de comandos útiles de npm y su equivalente en pnpm:

| npm command           | pnpm equivalent          |
| --------------------- | ------------------------ |
| `npm install`         | [`pnpm install`][]       |
| `npm i <pkg>`   | [`pnpm add <pkg>`] |
| `npm run <cmd>` | [`pnpm <cmd>`]     |
| `npx <pkg>`     | [`pnx <pkg>`]      |

Cuando se utiliza un comando desconocido, pnpm va a buscar un script que coincida con ese nombre, por ejemplo, `pnpm run lint` es lo mismo que usar `pnpm lint`. If there is no script with the specified name, then pnpm will execute the command as a shell script, so you can do things like `pnpm eslint` (see [`pnpm exec`][]).

## Variables de entorno

Algunas variables de entorno que no están relacionadas con pnpm pueden cambiar el comportamiento de pnpm:

* [`CI`](./cli/install.md#--frozen-lockfile)

Estas variables de entorno pueden influir en los directorios que utilizará pnpm para almacenar información global:

* `XDG_CACHE_HOME`
* `XDG_CONFIG_HOME`
* `XDG_DATA_HOME`
* `XDG_STATE_HOME`

Puede buscar en la documentación para encontrar los ajustes que aprovechan estas variables de entorno.

[`pnpm install`]: ./cli/install.md
[`pnpm exec`]: ./cli/exec.md
