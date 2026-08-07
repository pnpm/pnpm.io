---
id: pnpm-vs-npm
title: pnpm vs npm
---

## npm's flat tree

npm maintains a [flattened dependency tree][] as of version 3. This leads to less disk space bloat, with a messy `node_modules` directory as a side effect.

On the other hand, pnpm manages `node_modules` by using hard linking and symbolic linking to a global on-disk content-addressable store. This lets you get the benefits of far less disk space usage, while also keeping your `node_modules` clean. There is documentation on the [store layout][] if you wish to learn more.

The good thing about pnpm's proper `node_modules` structure is that it "[helps to avoid silly bugs][]" by making it impossible to use modules that are not specified in the project's `package.json`.

## Instalación

pnpm no permite la instalación de paquetes sin guardarlos en el `package.json`. If no parameters are passed to `pnpm add`, packages are saved as regular dependencies. Al igual que con npm, `--save-dev` y `--save-optional` pueden usarse para instalar paquetes como dependencias de desarrollo o dependencias opcionales.

As a consequence of this limitation, projects won't have any extraneous packages when they use pnpm unless they remove a dependency and leave it orphaned. That's why pnpm's implementation of the [prune command][] does not allow you to specify packages to prune - it ALWAYS removes all extraneous and orphaned packages.

## Directory dependencies

Directory dependencies start with the `file:` prefix and point to a directory in the filesystem. Like npm, pnpm symlinks those dependencies. Unlike npm, pnpm does not perform installation for the file dependencies.

This means that if you have a package called `foo` (`<root>/foo`) that has `bar@file:../bar` as a dependency, pnpm won't perform installation for `<root>/bar` when you run `pnpm install` on `foo`.

If you need to run installations in several packages at the same time, for instance in the case of a monorepo, you should look at the documentation for [`pnpm -r`][].

[flattened dependency tree]: https://github.com/npm/npm/issues/6912
[store layout]: symlinked-node-modules-structure
[helps to avoid silly bugs]: https://www.kochan.io/nodejs/pnpms-strictness-helps-to-avoid-silly-bugs.html

[prune command]: cli/prune

[`pnpm -r`]: cli/recursive
