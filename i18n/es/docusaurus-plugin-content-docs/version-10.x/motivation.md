---
id: motivation
title: Motivación
---

## Ahorro de espacio en disco

![An illustration of the pnpm content-addressable store. En la ilustración hay dos proyectos con node_modules. The files in the node_modules directories are hard links to the same files in the content-addressable store.](/img/pnpm-store.svg)

Cuando usas npm, las dependencias se instalan en almacenamientos individuales, lo que provoca que descargues la misma dependencia por cada proyecto que dependa de esta. Con pnpm, esa dependencia sera almacenada en un almacenamiento compartido, así:

1. Si dependes de diferentes versiones de una dependencia, solo los archivos que difieren serán agregados al almacenamiento. For instance, if it has 100 files, and a new
   version has a change in only one of those files, `pnpm update` will only add 1
   new file to the store, instead of cloning the entire dependency just for the
   singular change.
2. Todos los archivos son guardados en un solo lugar del disco duro. Cuando los paquetes que son instalados, sus archivos son hard-linked a un solo lugar, sin consumir espacio adicional en su disco duro. Esto te permitirá compartir tus dependencias de la misma version en diferentes proyectos.

Como resultado, usted ahorra un montón de espacio en su disco duro proporcional al numero de proyectos y dependencias, y tu disfrutaras de instalaciones mas rápidas!

## Aumentar la velocidad de instalación

pnpm performs installation in three stages:

1. Resolución de dependencias. Todas las dependencias requeridas se identifican y se llevan al almacenamiento.
2. Cálculo de estructura de directorios. The `node_modules` directory structure is calculated based on the dependencies.
3. Enlazar dependencias. All remaining dependencies are fetched and hard linked from the store to `node_modules`.

![An illustration of the pnpm install process. Packages are resolved, fetched, and hard linked as soon as possible.](/img/installation-stages-of-pnpm.svg)

This approach is significantly faster than the traditional three-stage installation process of resolving, fetching, and writing all dependencies to `node_modules`.

![An illustration of how package managers like Yarn Classic or npm install dependencies.](/img/installation-stages-of-other-pms.svg)

## Creating a non-flat node_modules directory

When installing dependencies with npm or Yarn Classic, all packages are hoisted to the root of the
modules directory. As a result, source code has access to dependencies that are
not added as dependencies to the project.

By default, pnpm uses symlinks to add only the direct dependencies of the project into the root of the modules directory.

![An illustration of a node_modules directory created by pnpm. Packages in the root node_modules are symlinks to directories inside the node_modules/.pnpm directory](/img/isolated-node-modules.svg)

If you'd like more details about the unique `node_modules` structure that pnpm
creates and why it works fine with the Node.js ecosystem, read:

- [Flat node_modules is not the only way](/blog/2020/05/27/flat-node-modules-is-not-the-only-way)
- [Symlinked node_modules structure](symlinked-node-modules-structure.md)

:::tip

If your tooling doesn't work well with symlinks, you may still use pnpm and set the [nodeLinker](settings#nodeLinker) setting to `hoisted`. This will instruct pnpm to create a node_modules directory that is similar to those created by npm and Yarn Classic.

:::
