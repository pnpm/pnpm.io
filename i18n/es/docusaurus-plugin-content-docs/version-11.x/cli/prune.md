---
id: prune
title: pnpm prune
---

Elimina paquetes innecesarios.

## Opciones

### --prod

Remove the packages specified in `devDependencies`.

### --no-optional

Remove the packages specified in `optionalDependencies`.

:::warning

Actualmente, el comando prune no admite la ejecución recursiva en un monorepo. To only install production-dependencies in a monorepo `node_modules` folders can be deleted and then re-installed with `pnpm install --prod`.

:::

