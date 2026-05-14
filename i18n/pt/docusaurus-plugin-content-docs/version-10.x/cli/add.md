---
id: add
title: "pnpm add <pkg>"
---

Instala um pacote e todos os outros pacotes dos quais ele depende.
Por padrão, qualquer novo pacote é instalado como uma dependência de produção.

## Resumo

| Comando              | Resultado                      |
| -------------------- | ------------------------------ |
| `pnpm add sax`       | Save to `dependencies`         |
| `pnpm add -D sax`    | Save to `devDependencies`      |
| `pnpm add -O sax`    | Save to `optionalDependencies` |
| `pnpm add -g sax `   | Instalar pacote globalmente    |
| `pnpm add sax@next`  | Install from the `next` tag    |
| `pnpm add sax@3.0.0` | Specify version `3.0.0`        |

## Supported package sources

pnpm supports installing packages from various sources. See the [Supported package sources](../package-sources.md) page for detailed documentation on:

- npm registry
- JSR registry
- Workspace packages
- Local file system (tarballs and directories)
- Remote tarballs
- Git repositories (with semver, subdirectories, and more)

## Opções

### --save-prod, -P

Install the specified packages as regular `dependencies`.

### --save-dev, -D

Install the specified packages as `devDependencies`.

### --save-optional, -O

Install the specified packages as `optionalDependencies`.

### --save-exact, -E

Dependências instaladas serão configuradas para usar uma versão exata em vez de usar o intervalo de versões padrão do pnpm.

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

Instala um pacote globalmente.

### --workspace

Adiciona a nova dependência apenas se ela for encontrada no workspace.

### --allow-build

Added in: v10.4.0

A list of package names that are allowed to run postinstall scripts during installation.

Exemplo:

```
pnpm --allow-build=esbuild add my-bundler
```

This will run `esbuild`'s postinstall script and also add it to the `onlyBuiltDependencies` field of `pnpm-workspace.yaml`. So, `esbuild` will always be allowed to run its scripts in the future.

### --filter &lt;package_selector\>

[Read more about filtering.](../filtering.md)

import CpuFlag from '../settings/_cpuFlag.mdx'

<CpuFlag />

import OsFlag from '../settings/_osFlag.mdx'

<OsFlag />

import LibcFlag from '../settings/_libcFlag.mdx'

<LibcFlag />
