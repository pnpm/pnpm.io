---
id: remove
title: pnpm remove
---

Aliases: `rm`, `uninstall`, `un`

Removes packages from `node_modules` and from the project's `package.json`.

## Opções

### --recursive, -r

When used inside a [workspace](../workspaces.md), removes a dependency (or
dependencies) from every workspace package.

Quando usado fora de um workspace, remove uma dependência (ou dependências) de cada pacote encontrado em subdiretórios.

### --global, -g

Remove um pacote global.

### --save-dev, -D

Only remove the dependency from `devDependencies`.

### --save-optional, -O

Only remove the dependency from `optionalDependencies`.

### --save-prod, -P

Only remove the dependency from `dependencies`.

### --filter &lt;package_selector\>

[Read more about filtering.](../filtering.md)
