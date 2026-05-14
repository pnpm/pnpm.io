---
id: symlinked-node-modules-structure
title: 基于符号链接的 `node_modules` 结构
---

:::info

本文仅描述 pnpm 的 `node_modules` 是如何在没有包含对等依赖关系的包时构建的。 对与有对等依赖的更复杂的场景，请看 [peer 是如何被解决的](how-peers-are-resolved.md)。

:::

pnpm 的 `node_modules` 布局使用符号链接来创建依赖项的嵌套结构。

`node_modules` 内每个包的每个文件都是到内容可寻址存储的硬链接。 假设你安装了依赖于 `bar@1.0.0` 的 `foo@1.0.0`。 pnpm 会将两个包硬链接到 node_modules 如下所示：

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

这些是 `node_modules` 中唯一的“真实”文件。 一旦所有包都硬链接到 `node_modules`，就会创建符号链接来构建嵌套的依赖关系图结构。

你可能已经注意到，这两个包都硬链接到一个 `node_modules` 文件夹（`foo@1.0.0/node_modules/foo`）内的子文件夹中。 这是为了：

1. **允许包自行导入自己。** foo 应该能够 `require('foo/package.json')` 或者 `import * as package from "foo/package.json"`。
2. **避免循环符号链接。** 依赖以及需要依赖的包被放置在一个文件夹下。 对于 Node.js 来说，依赖在包的内部 `node_modules` 中或在父目录中的任何其它 `node_modules` 中是没有区别的。

安装的下一阶段是符号链接依赖项。 `bar` 将被符号链接到 `foo@1.0.0/node_modules` 文件夹：

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

接下来，处理直接依赖关系。 `foo` 将被符号链接至根目录的 `node_modules` 文件夹，因为 `foo` 是项目的依赖项：

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

这是一个非常简单的例子。 但是，无论依赖项的数量和依赖关系图的深度如何，布局都会保持这种结构。

让我们添加 `qar@2.0.0` 作为 `bar` 和 `foo` 的依赖项。 这是新的结构的样子：

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

如你所见，即使图形现在更深（`foo > bar > qar`），但目录深度仍然相同。

这种布局乍一看可能很奇怪，但它与 Node 的模块解析算法完全兼容！ 解析模块时，Node 会忽略符号链接，因此当 `foo@1.0.0/node_modules/foo/index.js` 需要 `bar` 时，Node 不会使用在 `foo@1.0.0/node_modules/bar` 的 `ba`r，相反，bar 是被解析到其实际位置（`bar@1.0.0/node_modules/bar`）。 因此，`bar` 也可以解析其在 `bar@1.0.0/node_modules` 中的依赖项。

这种布局的一大好处是只有真正在依赖项中的包才能访问。 使用平铺的 `node_modules` 结构，所有被提升的包都可以访问。 要了解更多关于为什么这是一个优势的信息，
请参阅“[pnpm 的严格性有助于避免愚蠢的错误][bugs]”

不幸的是，生态系统中的许多软件包都已损坏——它们使用的依赖项未在其 package.json中列出。 为了最大限度地减少新用户遇到的问题，pnpm 默认将所有依赖项提升到 node\_modules/.pnpm/node\_modules。 要禁用此提升，请将 hoist 设置为 false。

[hoist]: settings.md#hoist
[bugs]: https://www.kochan.io/nodejs/pnpms-strictness-helps-to-avoid-silly-bugs.html
