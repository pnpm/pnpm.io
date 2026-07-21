---
id: add
title: "pnpm add <pkg>"
---

Instalar el paquete y cualquier paquete que dependa de el.
Por defecto, cualquier nuevo paquete se instala como una dependencia de producción.

## TL;DR

| Comando              | Significado                     |
| -------------------- | ------------------------------- |
| `pnpm add sax`       | Save to `dependencies`          |
| `pnpm add -D sax`    | Save to `devDependencies`       |
| `pnpm add -O sax`    | Save to `optionalDependencies`  |
| `pnpm add -g sax `   | Instalar el paquete globalmente |
| `pnpm add sax@next`  | Install from the `next` tag     |
| `pnpm add sax@3.0.0` | Specify version `3.0.0`         |

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

Install the specified packages as regular `dependencies`.

### --save-dev, -D, -d

Install the specified packages as `devDependencies`.

### --save-optional, -O, -o

Install the specified packages as `optionalDependencies`.

### --save-exact, -E, -e

Las dependencias guardadas se configurarán con una versión exacta en lugar de utilizar el operador de rango semver por defecto de pnpm.

### --save-peer

Using `--save-peer` will add one or more packages to `peerDependencies` and
install them as dev dependencies.

### --save-catalog

Added in: v10.12.1

Save the new dependency to the default [catalog].

### --save-catalog-name &lt;catalog_name\>

Added in: v10.12.1

Save the new dependency to the specified [catalog].

[catalog]: catalogs.md

### --config

Added in: v10.8.0

Save the dependency to [configDependencies](config-dependencies.md).

### --ignore-workspace-root-check

Adding a new dependency to the root workspace package fails, unless the
`--ignore-workspace-root-check` or `-w` flag is used.

For instance, `pnpm add debug -w`.

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

### --filter &lt;package_selector\>

[Read more about filtering.](../filtering.md)

import CpuFlag from '../settings/_cpuFlag.mdx'

<CpuFlag />

import OsFlag from '../settings/_osFlag.mdx'

<OsFlag />

import LibcFlag from '../settings/_libcFlag.mdx'

<LibcFlag />
