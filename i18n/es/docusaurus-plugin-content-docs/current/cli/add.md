---
id: add
title: "pnpm add <pkg>"
---

Instalar el paquete y cualquier paquete que dependa de el. Por defecto, cualquier nuevo paquete se instala como una dependencia de producción.

## TL;DR

| Comando              | Significado                         |
| -------------------- | ----------------------------------- |
| `pnpm add sax`       | Se guarda en `dependencies`         |
| `pnpm add -D sax`    | Se guarda en `devDependencies`      |
| `pnpm add -O sax`    | Se guarda en `optionalDependencies` |
| `pnpm add -g sax`    | Instalar el paquete globalmente     |
| `pnpm add sax@next`  | Se instala desde el tag `next`      |
| `pnpm add sax@3.0.0` | Especificar versión `3.0.0`         |

## Supported package sources

pnpm supports installing packages from various sources. See the [Supported package sources](../package-sources.md) page for detailed documentation on:

- npm registry
- JSR registry
- Workspace packages
- Local file system (tarballs and directories)
- Remote tarballs
- Git repositories (with semver, subdirectories, and more)

## Opciones

### --save-prod, -P, -p

Instala los paquetes especificados como una dependencia común: `dependencies`.

### --save-dev, -D, -d

Instala los paquetes especificados como `devDependencies`.

### --save-optional, -O, -o

Instala los paquetes especificados como `optionalDependencies`.

### --save-exact, -E, -e

Las dependencias guardadas se configurarán con una versión exacta en lugar de utilizar el operador de rango semver por defecto de pnpm.

### --save-peer

El uso de `--save-peer` agregará uno o más paquetes a `peerDependencies` y los instalará como dependencias de desarrollo.

### --save-catalog

Added in: v10.12.1

Save the new dependency to the default [catalog][].

### --save-catalog-name &lt;catalog_name\>

Added in: v10.12.1

Save the new dependency to the specified [catalog][].

### --config

Added in: v10.8.0

Save the dependency to [configDependencies](config-dependencies.md).

### --ignore-workspace-root-check

Se produce un error al agregar una nueva dependencia al paquete del espacio de trabajo raíz, a menos que se utilice el parámetro `--ignore-workspace-root-check` o `-w`.

Por ejemplo, `pnpm add debug -w`.

### --global, -g

Instala un paquete globalmente.

### --workspace

Solo añade la nueva dependencia si se encuentra en el espacio de trabajo.


### --allow-build

Added in: v10.4.0

A list of package names that are allowed to run postinstall scripts during installation.

Ejemplo:

```
pnpm --allow-build=esbuild add my-bundler
```

This will run `esbuild`'s postinstall script and also add it to the `allowBuilds` field of `pnpm-workspace.yaml`. So, `esbuild` will always be allowed to run its scripts in the future.

### --filter &lt;selector_de_paquete\>

[Leer más sobre filtrado.](../filtering.md)

import CpuFlag from '../settings/_cpuFlag.mdx'

<CpuFlag />

import OsFlag from '../settings/_osFlag.mdx'

<OsFlag />

import LibcFlag from '../settings/_libcFlag.mdx'

<LibcFlag />

[catalog]: catalogs.md
