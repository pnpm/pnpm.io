---
id: add
title: "pnpm add <pkg>"
---

Instala um pacote e todos os outros pacotes dos quais ele depende. Por padrão, qualquer novo pacote é instalado como uma dependência de produção.

## TL;DR

| Comando              | Significado                     |
| -------------------- | ------------------------------- |
| `pnpm add sax`       | Salva em `dependencies`         |
| `pnpm add -D sax`    | Sava em `devDependencies`       |
| `pnpm add -O sax`    | Salva em `optionalDependencies` |
| `pnpm add -g sax`    | Instalar pacote globalmente     |
| `pnpm add sax@next`  | Instalar a partir da tag `next` |
| `pnpm add sax@3.0.0` | Especifica a versão `3.0.0`     |

## Supported package sources

pnpm supports installing packages from various sources. See the [Supported package sources](../package-sources.md) page for detailed documentation on:

- npm registry
- JSR registry
- Workspace packages
- Local file system (tarballs and directories)
- Remote tarballs
- Git repositories (with semver, subdirectories, and more)

## Opções

### --save-prod, -P, -p

Instale os pacotes especificados em `dependencies` como uma dependência comum.

### --save-dev, -D, -d

Instale os pacotes especificados em `devDependencies` como uma dependência de desenvolvimento.

### --save-optional, -O, -o

Instala os pacotes especificados em `optionalDependencies` como dependências opcionais.

### --save-exact, -E, -e

Dependências instaladas serão configuradas para usar uma versão exata em vez de usar o intervalo de versões padrão do pnpm.

### --save-peer

Usar `--save-peer` adicionará um ou mais pacotes a `peerDependencies` e instalará-os como dependências de desenvolvimento.

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

Adicionar uma nova dependência ao diretório raiz do workspace falhe, ao menos o `--ignore-workspace-root-check` ou `-w` flag seja usado.

Por exemplo, `pnpm add debug -W`.

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

This will run `esbuild`'s postinstall script and also add it to the `allowBuilds` field of `pnpm-workspace.yaml`. So, `esbuild` will always be allowed to run its scripts in the future.

### --filter &lt;package_selector\>

[Leia mais sobre filtragem.](../filtering.md)

import CpuFlag from '../settings/_cpuFlag.mdx'

<CpuFlag />

import OsFlag from '../settings/_osFlag.mdx'

<OsFlag />

import LibcFlag from '../settings/_libcFlag.mdx'

<LibcFlag />

[catalog]: catalogs.md
