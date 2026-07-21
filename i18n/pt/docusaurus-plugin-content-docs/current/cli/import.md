---
id: import
title: pnpm import
---

`pnpm import` gera um `pnpm-lock.yaml` a partir de um lockfile de outro gerenciador de pacotes. Arquivos de origem suportados:
* `package-lock.json`
* `npm-shrinkwrap.json`
* `yarn.lock`

Observe que se você tiver workspaces para os quais deseja importar dependências, eles precisarão ser declarados em um arquivo [pnpm-workspace.yaml](../pnpm-workspace_yaml.md) previamente.
