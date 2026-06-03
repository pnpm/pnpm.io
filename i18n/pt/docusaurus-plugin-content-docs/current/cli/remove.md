---
id: remove
title: pnpm remove
---

Aliases: `rm`, `uninstall`, `un`

Remove pacotes de `node_modules` e do projeto `package.json`.

## Opções

### --recursive, -r

Quando usado dentro de um [workspace](../workspaces.md), remove uma dependência (ou dependências) de cada pacote do workspace.

Quando usado fora de um workspace, remove uma dependência (ou dependências) de cada pacote encontrado em subdiretórios.

### --global, -g

Remove um pacote global.

### --save-dev, -D

Remove a dependência apenas da propriedade `devDependencies`.

### --save-optional, -O

Remove a dependência apenas da propriedade `optionalDependencies`.

### --save-prod, -P

Remove a dependência apenas da propriedade `dependencies`.

### --filter &lt;package_selector\>

[Ler mais sobre filtração.](../filtering.md)
