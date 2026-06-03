---
id: how-peers-are-resolved
title: 对等依赖 (peers) 是如何被处理的
---

pnpm 的最佳特性之一是，在一个项目中，软件包的特定版本将始终具有同一组依赖项。 不过，这个规则 有一个例外 - 具有[对等依赖 (peer dependencies)][]的软件包。

对等依赖会从依赖图中更高的已安装的依赖项中解析，因为它们与父级共享相同的版本。 这意味着，如果 `foo@1.0.0` 有两个` peers `依赖（`bar@^1` 和 `baz@^1`），那么它可能在一个项目中有多个不同的依赖项集合。

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

在上面的示例中， `foo@1.0.0` 已安装在 `foo-parent-1` 和 `foo-parent-2` 中。 这两个包都有依赖包 baz 和 bar, 但是它们却依赖着不同版本的 baz。 因此， `foo@1.0.0` 有两组不同的依赖项：一组具有 `baz@1.0.0` ，另一组具有 `baz@1.1.0`。 若要支持这些用例，pnpm 必须有几组不同的依赖项，就去硬链接几次 `foo@1.0.0`。

通常，如果一个包没有对等依赖项，它会被硬链接到其依赖项的符号链接旁边的 `node_modules` 文件夹，如下所示：

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

但是，如果 `foo` 有对等依赖，那么它可能就会有多组依赖项，所以我们为不同的对等依赖项创建不同的解析：

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

我们创建 `foo@1.0.0_bar@1.0.0+baz@1.0.0` 或` foo@1.0.0_bar@1.0.0+baz@1.1.0 ` 内到 `foo` 的软链接。 因此，Node.js 模块解析器将找到正确的对等依赖。

*如果某个包没有对等依赖，但存在依赖项，其含有在途中被更高解析的对等依赖*，那么该传递包可以出现在具有不同依赖关系集的项目中。 例如，`a@1.0.0` 具有单个依赖项 `b@1.0.0`。 `b@1.0.0` 有一个对等依赖为 `c@^1`。 `a@1.0.0` 永远不会解析` b@1.0.0 `的 peer, 所以它也会依赖于 `b@1.0.0` 的对等。

该结构在 `node_modules` 中的样子如下。 在这个例子中，`a@1.0.0` 需要在项目的`node_modules` 中出现两次 - 其中一次是被 ` c@1.0.0` 解析，另一次被 `c@1.1.0` 再次解析。

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

[对等依赖 (peer dependencies)]: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#peerdependencies
