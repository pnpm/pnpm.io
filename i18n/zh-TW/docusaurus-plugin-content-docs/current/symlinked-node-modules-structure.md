---
id: symlinked-node-modules-structure
title: 基於符號連接的 node_modules 結構
---

:::info

本文章只會介紹在沒有套件有 peer 依賴的情況下 pnpm 的 `node_modules` 是如何被構建的。 對於有 peer 依賴的更複雜的場景，請看[peer 是如何被解析的](how-peers-are-resolved.md)。

:::

pnpm 的 `node_modules` 結構使用符號連接來創建依賴項的嵌套結構。

`node_modules` 中每個套件的每個文件都是來自內容可尋址存儲的硬連接。 假設您安裝了依賴於 `bar@1.0.0` 的 `foo@1.0.0`。 pnpm 會將兩個包硬連接到 `node_modules`，如下所示：

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

這是 `node_modules` 中的唯一的“真實”文件。 一旦所有套件都硬連接到 `node_modules`，就會創建符號連接來構建嵌套的依賴關係圖結構。

As you might have noticed, both packages are hard linked into a subfolder inside a `node_modules` folder (`foo@1.0.0/node_modules/foo`). This is needed to:

1. **allow packages to import themselves.** `foo` should be able to `require('foo/package.json')` or `import * as package from "foo/package.json"`.
2. **avoid circular symlinks.** Dependencies of packages are placed in the same folder in which the dependent packages are. For Node.js it doesn't make a difference whether dependencies are inside the package's `node_modules` or in any other `node_modules` in the parent directories.

The next stage of installation is symlinking dependencies. `bar` is going to be symlinked to the `foo@1.0.0/node_modules` folder:

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

Next, direct dependencies are handled. `foo` is going to be symlinked into the root `node_modules` folder because `foo` is a dependency of the project:

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

This is a very simple example. However, the layout will maintain this structure regardless of the number of dependencies and the depth of the dependency graph.

Let's add `qar@2.0.0` as a dependency of `bar` and `foo`. This is how the new structure will look:

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

As you may see, even though the graph is deeper now (`foo > bar > qar`), the directory depth in the file system is still the same.

This layout might look weird at first glance, but it is completely compatible with Node's module resolution algorithm! When resolving modules, Node ignores symlinks, so when `bar` is required from `foo@1.0.0/node_modules/foo/index.js`, Node does not use `bar` at `foo@1.0.0/node_modules/bar`, but instead, `bar` is resolved to its real location (`bar@1.0.0/node_modules/bar`). As a consequence, `bar` can also resolve its dependencies which are in `bar@1.0.0/node_modules`.

A great bonus of this layout is that only packages that are really in the dependencies are accessible. With a flattened `node_modules` structure, all hoisted packages are accessible. To read more about why this is an advantage, see "[pnpm's strictness helps to avoid silly bugs][bugs]"

Unfortunately, many packages in the ecosystem are broken — they use dependencies that are not listed in their `package.json`. To minimize the number of issues new users encounter, pnpm hoists all dependencies by default into `node_modules/.pnpm/node_modules`. To disable this hoisting, set [hoist][] to `false`.

[hoist]: settings.md#hoist

[bugs]: https://www.kochan.io/nodejs/pnpms-strictness-helps-to-avoid-silly-bugs.html
