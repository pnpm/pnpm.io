---
id: why
title: pnpm why
---

Mostra todos os pacotes que dependem do pacote especificado.

The output is a reverse dependency tree: the searched package appears at the root, with its dependents as branches, walking back to workspace roots.

Duplicate subtrees are deduplicated in the output and shown as "deduped".

## Opções

### --recursive, -r

Show the dependency tree for the specified package on every package in subdirectories or on every workspace package when executed inside a workspace.

### --json

Show information in JSON format.

### --long

Show verbose output.

### --parseable

Show parseable output instead of tree view.

### --global, -g

Liste os pacotes no diretório de instalação global em vez de no projeto atual.

### --prod, -P

Only display the dependency tree for packages in `dependencies`.

### --dev, -D

Only display the dependency tree for packages in `devDependencies`.

### --depth &lt;number\>

Display only dependencies within a specific depth.

### --only-projects

Exiba apenas dependências que também sejam projetos dentro do workspace.

### --exclude-peers

Exclude peer dependencies from the results (but dependencies of peer dependencies are not ignored).

### --filter &lt;package_selector\>

[Leia mais sobre filtragem.](../filtering.md)

import FindBy from '../settings/_findBy.mdx'

<FindBy />
