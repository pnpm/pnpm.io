---
id: symlinked-node-modules-structure
title: Estructura de `node_modules` con enlaces simbólicos
---

:::info

This article only describes how pnpm's `node_modules` are structured when
there are no packages with peer dependencies. For the more complex scenario of
dependencies with peers, see [how peers are resolved](how-peers-are-resolved.md).

:::

pnpm's `node_modules` layout uses symbolic links to create a nested structure of
dependencies.

Every file of every package inside `node_modules` is a hard link to the
content-addressable store. Let's say you install `foo@1.0.0` that depends on
`bar@1.0.0`. pnpm will hard link both packages to `node_modules` like this:

```text
node_modules
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       └── bar
    │           ├── index.js     -> <store>/001
    │           └── package.json -> <store>/002
    └── foo@1.0.0
        └── node_modules
            └── foo
                ├── index.js     -> <store>/003
                └── package.json -> <store>/004
```

These are the only "real" files in `node_modules`. Once all the packages are
hard linked to `node_modules`, symbolic links are created to build the nested
dependency graph structure.

As you might have noticed, both packages are hard linked into a subfolder inside
a `node_modules` folder (`foo@1.0.0/node_modules/foo`). Esto es necesario para:

1. **allow packages to import themselves.** `foo` should be able to
   `require('foo/package.json')` or `import * as package from "foo/package.json"`.
2. **avoid circular symlinks.** Dependencies of packages are placed in the same
   folder in which the dependent packages are. For Node.js it doesn't make a
   difference whether dependencies are inside the package's `node_modules` or in
   any other `node_modules` in the parent directories.

La siguiente etapa de la instalación es la creación de los enlaces simbolicos de las dependencias. `bar` is going to be
symlinked to the `foo@1.0.0/node_modules` folder:

```text
node_modules
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       └── bar -> <store>
    └── foo@1.0.0
        └── node_modules
            ├── foo -> <store>
            └── bar -> ../../bar@1.0.0/node_modules/bar
```

A continuación, se manejan las dependencias directas. `foo` is going to be symlinked into the
root `node_modules` folder because `foo` is a dependency of the project:

```text
node_modules
├── foo -> ./.pnpm/foo@1.0.0/node_modules/foo
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       └── bar -> <store>
    └── foo@1.0.0
        └── node_modules
            ├── foo -> <store>
            └── bar -> ../../bar@1.0.0/node_modules/bar
```

Este es un ejemplo muy simple. Sin embargo, el diseño mantendrá esta estructura independientemente del número de dependencias y la profundidad del gráfico de dependencia.

Let's add `qar@2.0.0` as a dependency of `bar` and `foo`. Así es como se verá la nueva estructura:

```text
node_modules
├── foo -> ./.pnpm/foo@1.0.0/node_modules/foo
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       ├── bar -> <store>
    │       └── qar -> ../../qar@2.0.0/node_modules/qar
    ├── foo@1.0.0
    │   └── node_modules
    │       ├── foo -> <store>
    │       ├── bar -> ../../bar@1.0.0/node_modules/bar
    │       └── qar -> ../../qar@2.0.0/node_modules/qar
    └── qar@2.0.0
        └── node_modules
            └── qar -> <store>
```

As you may see, even though the graph is deeper now (`foo > bar > qar`), the
directory depth in the file system is still the same.

Este diseño puede parecer extraño a primera vista, ¡pero es completamente compatible con el algoritmo de resolución de módulos de Node! When resolving modules, Node ignores
symlinks, so when `bar` is required from `foo@1.0.0/node_modules/foo/index.js`,
Node does not use `bar` at `foo@1.0.0/node_modules/bar`, but instead, `bar` is
resolved to its real location (`bar@1.0.0/node_modules/bar`). As a consequence,
`bar` can also resolve its dependencies which are in `bar@1.0.0/node_modules`.

Una gran ventaja de este diseño es que solo los paquetes que realmente están en las dependencias son accesibles. With a flattened `node_modules` structure, all
hoisted packages are accessible. To read more about why this is an advantage,
see "[pnpm's strictness helps to avoid silly bugs][bugs]"

Unfortunately, many packages in the ecosystem are broken — they use dependencies that are not listed in their `package.json`. To minimize the number of issues new users encounter, pnpm hoists all dependencies by default into `node_modules/.pnpm/node_modules`. To disable this hoisting, set [hoist] to `false`.

[hoist]: settings.md#hoist
[bugs]: https://www.kochan.io/nodejs/pnpms-strictness-helps-to-avoid-silly-bugs.html
