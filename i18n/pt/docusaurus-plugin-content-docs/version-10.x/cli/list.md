---
id: list
title: pnpm list
---

Aliases: `ls`

Este comando irá exibir todas as versões dos pacotes que estão instalados, bem como suas
dependências, em uma estrutura de árvore.

Positional arguments are `name-pattern@version-range` identifiers, which will
limit the results to only the packages named. For example,
`pnpm list "babel-*" "eslint-*" semver@5`.

## Opções

### --recursive, -r

Execute o comando em cada pacote em subdiretórios ou em cada pacote do workspace, quando executado dentro de um workspace.

### --json

Exibe o log de saída no formato JSON.

### --long

Exibir informações extendidas.

### --lockfile-only

Added in: v10.23.0

Read package information from the lockfile instead of checking the actual `node_modules` directory. This is useful for quickly inspecting what would be installed without requiring a full installation.

### --parseable

Exibe os diretórios de pacotes em um formato parseable em vez de sua visualização de árvore.

### --global, -g

Liste os pacotes no diretório de instalação global em vez de no projeto atual.

### --depth &lt;number\>

A profundidade máxima da árvore de dependência.

`pnpm ls --depth 0` (default) will list direct dependencies only.
`pnpm ls --depth -1` will list projects only. Useful inside a workspace when
used with the `-r` option.
`pnpm ls --depth Infinity` will list all dependencies regardless of depth.

### --prod, -P

Display only the dependency graph for packages in `dependencies` and
`optionalDependencies`.

### --dev, -D

Display only the dependency graph for packages in `devDependencies`.

### --no-optional

Don't display packages from `optionalDependencies`.

### --only-projects

Exiba apenas dependências que também sejam projetos dentro do workspace.

### --exclude-peers

Exclude peer dependencies from the results (but dependencies of peer dependencies are not ignored).

### --filter &lt;package_selector\>

[Read more about filtering.](../filtering.md)

import FindBy from '../settings/_findBy.mdx'

<FindBy />
