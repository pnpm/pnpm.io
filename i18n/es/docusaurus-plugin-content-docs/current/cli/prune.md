---
id: prune
title: pnpm prune
---

Elimina paquetes innecesarios.

## Opciones

### --prod

Elimina los paquetes que figuran en `devDependencies`.

### --no-optional

Elimina los paquetes que figuran en `optionalDependencies`.

:::warning

Actualmente, el comando prune no admite la ejecución recursiva en un monorepo. Para instalar solamente dependencias de producción en un monorepo, los directorios `node_modules` pueden ser eliminados y luego reinstalados con `pnpm install --prod`.

:::

