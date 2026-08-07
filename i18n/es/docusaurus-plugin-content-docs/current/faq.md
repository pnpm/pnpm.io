---
id: faq
title: Preguntas Frecuentes
---

## ¿Por qué mi `node_modules` usa espacio en disco si los paquetes se almacenan en una tienda global?

pnpm crea [enlaces duros][] desde el almacén global a las carpetas `node_modules`. Los enlaces duros apuntan al mismo lugar en el disco donde se encuentran los archivos originales. Entonces, por ejemplo, si tiene `foo` en su proyecto como una dependencia y ocupa 1 Mb de espacio, entonces parecerá que ocupa 1 Mb de espacio en `node_modules` del proyecto y la misma cantidad de espacio en el almacén global. Sin embargo, ese 1 Mb es *el mismo espacio* en el disco direccionado desde dos ubicaciones diferentes. Entonces, en total, `foo` ocupa 1 Mb, no 2 Mb.

Para más sobre este tema:

* [¿Por qué los enlaces duros parecen ocupar el mismo espacio que los originales?](https://unix.stackexchange.com/questions/88423/why-do-hard-links-seem-to-take-the-same-space-as-the-originals)
* [Un hilo de la sala de chat de pnpm](https://gist.github.com/zkochan/106cfef49f8476b753a9cbbf9c65aff1)
* [Un issue en el repositorio de pnpm](https://github.com/pnpm/pnpm/issues/794)

## ¿Funciona en Windows?

Respuesta corta: Sí. Respuesta larga: el uso de enlaces simbólicos en Windows es problemático, por decir lo menos, sin embargo, pnpm tiene una solución. Para Windows, usamos [junctions][] en su lugar.

## ¿Pero el anidado de `node_modules` es incompatible con Windows?

Las primeras versiones de npm tenían problemas debido al anidamiento de todos los directorios `node_modules` (consulte [este issue](https://github. com/nodejs/node-v0. x-archive/issues/6960)). Sin embargo, pnpm no crea carpetas profundas, almacena todos los paquetes de forma plana y usa enlaces simbólicos para crear la estructura de árbol de dependencia.

## ¿Qué pasa con los enlaces simbólicos circulares?

Aunque pnpm utiliza enlaces para poner dependencias en carpetas `node_modules`, se evita el uso enlaces simbólicos circulares porque los paquetes principales se colocan en el mismo `node_modules` en el que están sus dependencias. Así que las dependencias de `foo` no están en `foo/node_modules`, sino que `foo` está en `node_modules` junto con sus propias dependencias.

## ¿Por qué tener enlaces duros en absoluto? ¿Por qué no enlazar directamente con el almacén global?

Un paquete puede tener diferentes conjuntos de dependencias en una máquina.

In project **A** `foo@1.0.0` can have a dependency resolved to `bar@1.0.0`, but in project **B** the same dependency of `foo` might resolve to `bar@1.1.0`; so, pnpm hard links `foo@1.0.0` to every project where it is used, in order to create different sets of dependencies for it.

Direct symlinking to the global store would work with Node's `--preserve-symlinks` flag, however, that approach comes with a plethora of its own issues, so we decided to stick with hard links. For more details about why this decision was made, see [this issue][eps-issue].

## Does pnpm work across different subvolumes in one Btrfs partition?

While Btrfs does not allow cross-device hardlinks between different subvolumes in a single partition, it does permit reflinks. As a result, pnpm utilizes reflinks to share data between these subvolumes.

## Does pnpm work across multiple drives or filesystems?

The package store should be on the same drive and filesystem as installations, otherwise packages will be copied, not linked. This is due to a limitation in how hard linking works, in that a file on one filesystem cannot address a location in another. See [Issue #712][] for more details.

pnpm functions differently in the 2 cases below:

### Store path is specified

If the store path is specified via [the store config](configuring.md), then copying occurs between the store and any projects that are on a different disk.

If you run `pnpm install` on disk `A`, then the pnpm store must be on disk `A`. If the pnpm store is located on disk `B`, then all required packages will be directly copied to the project location instead of being linked. This severely inhibits the storage and performance benefits of pnpm.

### Store path is NOT specified

If the store path is not set, then multiple stores are created (one per drive or filesystem).

If installation is run on disk `A`, the store will be created on `A` `.pnpm-store` under the filesystem root.  If later the installation is run on disk `B`, an independent store will be created on `B` at `.pnpm-store`. The projects would still maintain the benefits of pnpm, but each drive may have redundant packages.

## What does `pnpm` stand for?

`pnpm` stands for `performant npm`. [@rstacruz](https://github.com/rstacruz/) came up with the name.

## `pnpm` does not work with &lt;YOUR-PROJECT-HERE>?

In most cases it means that one of the dependencies require packages not declared in `package.json`. It is a common mistake caused by flat `node_modules`. If this happens, this is an error in the dependency and the dependency should be fixed. That might take time though, so pnpm supports workarounds to make the buggy packages work.

### Solución 1

In case there are issues, you can use the [`nodeLinker: hoisted`][] setting. This creates a flat `node_modules` structure similar to the one created by `npm`.

### Solución 2

In the following example, a dependency does **not** have the `iterall` module in its own list of deps.

The easiest solution to resolve missing dependencies of the buggy packages is to **add `iterall` as a dependency to our project's `package.json`**.

You can do so, by installing it via `pnpm add iterall`, and will be automatically added to your project's `package.json`.

```json
  "dependencies": {
    ...
    "iterall": "^1.2.2",
    ...
  }
```

### Solución 3

One of the solutions is to use [hooks](pnpmfile.md#hooks) for adding the missing dependencies to the package's `package.json`.

An example was [Webpack Dashboard][] which wasn't working with `pnpm`. It has since been resolved such that it works with `pnpm` now.

It used to throw an error:

```console
Error: Cannot find module 'babel-traverse'
  at /node_modules/inspectpack@2.2.3/node_modules/inspectpack/lib/actions/parse
```

The problem was that `babel-traverse` was used in `inspectpack` which was used by `webpack-dashboard`, but `babel-traverse` wasn't specified in `inspectpack`'s `package.json`. It still worked with `npm` and `yarn` because they create flat `node_modules`.

The solution was to create a `.pnpmfile.mjs` with the following contents:

```js
export const hooks = {
  readPackage: (pkg) => {
    if (pkg.name === "inspectpack") {
      pkg.dependencies['babel-traverse'] = '^6.26.0';
    }
    return pkg;
  }
}
```

After creating a `.pnpmfile.mjs`, delete `pnpm-lock.yaml` only - there is no need to delete `node_modules`, as pnpm hooks only affect module resolution. Then, rebuild the dependencies & it should be working.

[enlaces duros]: https://en.wikipedia.org/wiki/Hard_link

[junctions]: https://docs.microsoft.com/en-us/windows/win32/fileio/hard-links-and-junctions

[eps-issue]: https://github.com/nodejs/node-eps/issues/46

[Issue #712]: https://github.com/pnpm/pnpm/issues/712

[`nodeLinker: hoisted`]: settings#nodeLinker

[Webpack Dashboard]: https://github.com/pnpm/pnpm/issues/1043
