---
id: motivation
title: Motivación
---

## Ahorro de espacio en disco

![Una ilustración de la tienda de contenido direccionable pnpm. En la ilustración hay dos proyectos con node_modules. Los archivos en los directorios node_modules son enlaces físicos a los mismos archivos en el almacén de contenido direccionable.](/img/pnpm-store.svg)

Cuando usas npm, las dependencias se instalan en almacenamientos individuales, lo que provoca que descargues la misma dependencia por cada proyecto que dependa de esta. Con pnpm, esa dependencia sera almacenada en un almacenamiento compartido, así:

1. Si dependes de diferentes versiones de una dependencia, solo los archivos que difieren serán agregados al almacenamiento. Por ejemplo, si tiene 100 archivos, y una nueva version ha cambiado un solo de esos archivos, `pnpm update` solo actualizará 1 nuevo archivo en el almacenamiento, en vez de clonar toda la dependencia solo para un cambio en particular.
1. Todos los archivos son guardados en un solo lugar del disco duro. Cuando los paquetes que son instalados, sus archivos son hard-linked a un solo lugar, sin consumir espacio adicional en su disco duro. Esto te permitirá compartir tus dependencias de la misma version en diferentes proyectos.

Como resultado, usted ahorra un montón de espacio en su disco duro proporcional al numero de proyectos y dependencias, y tu disfrutaras de instalaciones mas rápidas!

## Aumentar la velocidad de instalación

pnpm performs installation in three stages:

1. Resolución de dependencias. Todas las dependencias requeridas se identifican y se llevan al almacenamiento.
1. Cálculo de estructura de directorios. La estructura de directorios `node_modules` se calcula en función de las dependencias.
1. Enlazar dependencias. Todas las dependencias restantes se obtienen y vinculan directamente desde la tienda a `node_modules`.

![Una ilustración del proceso de instalación de pnpm. Los paquetes se resuelven, se captan y se vinculan lo antes posible.](/img/installation-stages-of-pnpm.svg)

Este enfoque es significativamente más rápido que el proceso de instalación tradicional de tres etapas de resolución, recuperación y escritura de todas las dependencias en `node_modules`.

![Una ilustración de cómo los administradores de paquetes como Yarn Classic o npm instalan dependencias.](/img/installation-stages-of-other-pms.svg)

## Creating a non-flat node_modules directory

When installing dependencies with npm or Yarn Classic, all packages are hoisted to the root of the modules directory. As a result, source code has access to dependencies that are not added as dependencies to the project.

By default, pnpm uses symlinks to add only the direct dependencies of the project into the root of the modules directory.

![Una ilustración de un directorio node_modules creado por pnpm. Los paquetes en la raíz node_modules son enlaces simbólicos a directorios dentro del directorio node_modules/.pnpm](/img/isolated-node-modules.svg)

If you'd like more details about the unique `node_modules` structure that pnpm creates and why it works fine with the Node.js ecosystem, read:
- [El node_modules plano no es la única forma](/blog/2020/05/27/flat-node-modules-is-not-the-only-way)
- [Estructura de `node_modules` con enlaces simbólicos](symlinked-node-modules-structure.md)

:::tip

If your tooling doesn't work well with symlinks, you may still use pnpm and set the [nodeLinker](settings#nodeLinker) setting to `hoisted`. This will instruct pnpm to create a node_modules directory that is similar to those created by npm and Yarn Classic.

:::
