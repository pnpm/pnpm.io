---
id: prune
title: pnpm prune
---

Remove pacotes desnecessários.

## Opções

### --prod

Remova os pacotes especificados em `devDependencies`.

### --no-optional

Remova os pacotes especificados em `optionalDependencies`.

:::warning

O comando prune não suporta execução recursiva em um monorepo atualmente. Para instalar apenas dependências de produção em um monorepo as pastas de `node_modules` podem ser excluídas e reinstaladas com `pnpm install --prod`.

:::

