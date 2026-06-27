---
id: config
title: pnpm config
---

Aliases: `c`

Gestiona los archivos de configuración.

pnpm settings are split across two kinds of configuration files:

- **Registry and authentication settings** live in INI files — the global `rc` file and local `.npmrc` files.
- **All other pnpm settings** live in YAML files — the global `config.yaml` and the per-project `pnpm-workspace.yaml`.

The local workspace configuration file is located at the root of the project and is named `pnpm-workspace.yaml`. The global YAML configuration file (`config.yaml`) is located at:

- If the **$XDG_CONFIG_HOME** env variable is set, then **$XDG_CONFIG_HOME/pnpm/config.yaml**
- On Windows: **~/AppData/Local/pnpm/config/config.yaml**
- On macOS: **~/Library/Preferences/pnpm/config.yaml**
- On Linux: **~/.config/pnpm/config.yaml**

The global `rc` file (registry/auth settings only) is at:

- If the **$XDG_CONFIG_HOME** env variable is set, then **$XDG_CONFIG_HOME/pnpm/rc**
- On Windows: **~/AppData/Local/pnpm/config/rc**
- On macOS: **~/Library/Preferences/pnpm/rc**
- On Linux: **~/.config/pnpm/rc**

You can also retrieve the path to your global config file by running (added in v10.21.0):

```sh
pnpm config get globalconfig
```

## Commands

### set &lt;key> &lt;value>

Establece la clave de configuración en el valor proporcionado.

Without the `--json` flag, it parses the value as plain string:

```sh
pnpm config set --location=project nodeVersion 22.0.0
```

With the `--json` flag, it parses the value as JSON:

```sh
pnpm config set --location=project --json nodeVersion '"22.0.0"'
```

The `--json` flag also allows `pnpm config set` to create arrays and objects:

```sh
pnpm config set --location=project --json allowBuilds '{"react": true, "react-dom": true}'
pnpm config set --location=project --json catalog '{ "react": "19" }'
```

The `set` command does not accept a property path.

### get &lt;key>

Imprime el valor de configuración de la clave proporcionada.

The `key` can be a simple key:

```sh
pnpm config get nodeVersion
pnpm config get --json nodeVersion
pnpm config get --json packageExtensions
pnpm config get --json allowBuilds
pnpm config get --json catalog
```

It can also be a property path:

```sh
pnpm config get 'packageExtensions["@babel/parser"].peerDependencies["@babel/types"]'
pnpm config get --json 'packageExtensions["@babel/parser"].peerDependencies["@babel/types"]'
pnpm config get 'allowBuilds.react'
pnpm config get --json 'allowBuilds.react'
pnpm config get catalog.react
pnpm config get --json catalog.react
```

The syntax of the property path emulates JavaScript property paths.

### delete &lt;key>

Elimina la clave de configuración del archivo de configuración.

### list

Muestra todos los ajustes de configuración. Output is a JSON object.

Auth-related settings are hidden from the output; use `pnpm config get <key>` to read them explicitly.

:::note

Since v11, `pnpm config get` (without `--json`) no longer prints INI-formatted text. It prints JSON for objects and arrays, and raw strings for strings, numbers, booleans, and nulls. `pnpm config get --json` prints all values as JSON. `pnpm config list` always prints a JSON object.

:::

## Opciones

### --global, -g

Establece la configuración en el archivo de configuración global.

### --location

By default, `--location` is set to `global`.

When set to `project`, pnpm writes the setting to `pnpm-workspace.yaml` at the workspace root (or, for registry/auth settings, to the `.npmrc` in the workspace root).

When set to `global`, the behavior is the same as passing the `--global` option.

### --json

Make `get` and `list` show all the config settings in JSON format and make `set` parse the value as JSON.
