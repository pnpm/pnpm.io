---
id: pnpm-vs-npm
title: pnpm vs npm
---

## A estrutura plana do npm

npm maintains a [flattened dependency tree] as of version 3. This leads to less
disk space bloat, with a messy `node_modules` directory as a side effect.

On the other hand, pnpm manages `node_modules` by using hard linking and
symbolic linking to a global on-disk content-addressable store. This lets you get the benefits of far less disk space usage, while also keeping your
`node_modules` clean. There is documentation on the [store layout] if you wish
to learn more.

The good thing about pnpm's proper `node_modules` structure is that it
"[helps to avoid silly bugs]" by making it impossible to use modules that are not
specified in the project's `package.json`.

[flattened dependency tree]: https://github.com/npm/npm/issues/6912
[store layout]: symlinked-node-modules-structure
[helps to avoid silly bugs]: https://www.kochan.io/nodejs/pnpms-strictness-helps-to-avoid-silly-bugs.html

## Instalação

pnpm does not allow installation of packages without saving them to
`package.json`. If no parameters are passed to `pnpm add`, packages are saved as
regular dependencies. Like with npm, `--save-dev` and `--save-optional` can be
used to install packages as dev or optional dependencies.

Como consequência dessa limitação, projetos não terão nenhum pacote estranho ao usarem pnpm, a não ser que removam uma dependência e deixem-na órfã. That's
why pnpm's implementation of the [prune command] does not allow you to specify
packages to prune - it ALWAYS removes all extraneous and orphaned packages.

[prune command]: cli/prune

## Dependências de diretório

Directory dependencies start with the `file:` prefix and point to a directory in
the filesystem. Assim como o npm, pnpm cria um link simbólico para essas dependências. Ao contrário do npm, pnpm não instala as dependências do arquivo.

This means that if you have a package called `foo` (`<root>/foo`) that has
`bar@file:../bar` as a dependency, pnpm won't perform installation for
`<root>/bar` when you run `pnpm install` on `foo`.

If you need to run installations in several packages at the same time, for
instance in the case of a monorepo, you should look at the documentation for
[`pnpm -r`].

[`pnpm -r`]: cli/recursive
