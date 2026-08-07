---
id: how-peers-are-resolved
title: Cómo se resuelven los peers
---

Una de las mejores características de pnpm es que en un proyecto, una versión específica de un paquete siempre tendrá un conjunto de dependencias. There is one exception from this rule, though - packages with [peer dependencies][].

Las Peer dependencies son resueltas desde dependencias instaladas más arriba en el árbol de dependencias, ya que comparten el mismo padre. Esto significa que si `foo@1.0.0` tiene dos pares (`bar@^1` y `baz@^1`) entonces podria tener difentes juegos de dependencias en el mismo proyecto.

```text
- foo-parent-1
  - bar@1.0.0
  - baz@1.0.0
  - foo@1.0.0
- foo-parent-2
  - bar@1.0.0
  - baz@1.1.0
  - foo@1.0.0
```

In the example above, `foo@1.0.0` is installed for `foo-parent-1` and `foo-parent-2`. Ambos paquetes también tienen `bar` y `baz` , pero dependen de versiones diferentes de `baz`. As a result, `foo@1.0.0` has two different sets of dependencies: one with `baz@1.0.0` and the other one with `baz@1.1.0`. To support these use cases, pnpm has to hard link `foo@1.0.0` as many times as there are different dependency sets.

Normally, if a package does not have peer dependencies, it is hard linked to a `node_modules` folder next to symlinks of its dependencies, like so:

```text
node_modules
└── .pnpm
    ├── foo@1.0.0
    │   └── node_modules
    │       ├── foo
    │       ├── qux   -> ../../qux@1.0.0/node_modules/qux
    │       └── plugh -> ../../plugh@1.0.0/node_modules/plugh
    ├── qux@1.0.0
    ├── plugh@1.0.0
```

However, if `foo` has peer dependencies, there may be multiple sets of dependencies for it, so we create different sets for different peer dependency resolutions:

```text
node_modules
└── .pnpm
    ├── foo@1.0.0_bar@1.0.0+baz@1.0.0
    │   └── node_modules
    │       ├── foo
    │       ├── bar   -> ../../bar@1.0.0/node_modules/bar
    │       ├── baz   -> ../../baz@1.0.0/node_modules/baz
    │       ├── qux   -> ../../qux@1.0.0/node_modules/qux
    │       └── plugh -> ../../plugh@1.0.0/node_modules/plugh
    ├── foo@1.0.0_bar@1.0.0+baz@1.1.0
    │   └── node_modules
    │       ├── foo
    │       ├── bar   -> ../../bar@1.0.0/node_modules/bar
    │       ├── baz   -> ../../baz@1.1.0/node_modules/baz
    │       ├── qux   -> ../../qux@1.0.0/node_modules/qux
    │       └── plugh -> ../../plugh@1.0.0/node_modules/plugh
    ├── bar@1.0.0
    ├── baz@1.0.0
    ├── baz@1.1.0
    ├── qux@1.0.0
    ├── plugh@1.0.0
```

We create symlinks either to the `foo` that is inside `foo@1.0.0_bar@1.0.0+baz@1.0.0` or to the one in `foo@1.0.0_bar@1.0.0+baz@1.1.0`. As a consequence, the Node.js module resolver will find the correct peers.

*If a package has no peer dependencies but has dependencies with peers that are resolved higher in the graph*, then that transitive package can appear in the project with different sets of dependencies. For instance, there's package `a@1.0.0` with a single dependency `b@1.0.0`. `b@1.0.0` has a peer dependency `c@^1`. `a@1.0.0` will never resolve the peers of `b@1.0.0`, so it becomes dependent from the peers of `b@1.0.0` as well.

Here's how that structure will look in `node_modules`. In this example, `a@1.0.0` will need to appear twice in the project's `node_modules` - resolved once with `c@1.0.0` and again with `c@1.1.0`.

```text
node_modules
└── .pnpm
    ├── a@1.0.0_c@1.0.0
    │   └── node_modules
    │       ├── a
    │       └── b -> ../../b@1.0.0_c@1.0.0/node_modules/b
    ├── a@1.0.0_c@1.1.0
    │   └── node_modules
    │       ├── a
    │       └── b -> ../../b@1.0.0_c@1.1.0/node_modules/b
    ├── b@1.0.0_c@1.0.0
    │   └── node_modules
    │       ├── b
    │       └── c -> ../../c@1.0.0/node_modules/c
    ├── b@1.0.0_c@1.1.0
    │   └── node_modules
    │       ├── b
    │       └── c -> ../../c@1.1.0/node_modules/c
    ├── c@1.0.0
    ├── c@1.1.0
```

[peer dependencies]: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#peerdependencies
