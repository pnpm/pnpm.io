---
id: prune
title: pnpm prune
---

Remove pacotes desnecessários.

## Opções

### --prod

Remove the packages specified in `devDependencies`.

### --no-optional

Remove the packages specified in `optionalDependencies`.

:::warning

O comando prune não suporta execução recursiva em um monorepo atualmente. To only install production-dependencies in a monorepo `node_modules` folders can be deleted and then re-installed with `pnpm install --prod`.

:::

