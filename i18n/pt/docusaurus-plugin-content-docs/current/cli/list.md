---
id: list
title: pnpm list
---

Aliases: `ls`

Este comando irá exibir todas as versões dos pacotes que estão instalados, bem como suas dependências, em uma estrutura de árvore.

Os argumentos posicionais são `identificadores name-pattern@version-range`, que limitarão os resultados apenas aos pacotes nomeados. Por exemplo, `pnpm list "babel-*" "eslint-*" semver@5`.

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

`pnpm ls --depth 0` (padrão) vai listar apenas as dependências diretas. `pnpm ls --depth -1` listará apenas projetos. Útil dentro de um workspace quando usado com a opção `-r`. `pnpm ls --depth Infinity` vai listar todas as dependências independentemente da profundidade.

### --prod, -P

Exibe apenas o gráfico de dependência para pacotes em `dependencies` e `optionalDependencies`.

### --dev, -D

Exibe apenas o gráfico de dependência para pacotes em `devDependencies`.

### --no-optional

Não exibe pacotes listados em `optionalDependencies`.

### --only-projects

Exiba apenas dependências que também sejam projetos dentro do workspace.

### --exclude-peers

Exclude peer dependencies from the results (but dependencies of peer dependencies are not ignored).

### --filter &lt;package_selector\>

[Leia mais sobre filtragem.](../filtering.md)

import FindBy from '../settings/_findBy.mdx'

<FindBy />
