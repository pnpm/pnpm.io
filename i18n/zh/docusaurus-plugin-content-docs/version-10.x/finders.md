---
id: finders
title: 查找器
---

添加于：v10.16.0

查找器函数允许你通过包的任何属性，而不仅仅是它的名字来**搜索你的依赖关系图**。
它们可以在 [.pnpmfile.cjs] 中声明并与 [pnpm list] 和 [pnpm why] 一起使用。

[.pnpmfile.cjs]: ./pnpmfile.md
[pnpm list]: ./cli/list.md
[pnpm why]: ./cli/why.md

## 定义查找器函数

查找器函数在项目的 [.pnpmfile.cjs] 文件中的 finders 导出下声明。
每个函数接收一个上下文对象并且必须返回以下任一结果：

- `true` → 在结果中包含此依赖项，
- `false` → 跳过它，
- 或“字符串”→包括此依赖项并将字符串打印为附加信息。

示例：一个与 `peerDependencies` 中具有 **React 17** 的任何依赖项匹配的查找器：

```js title=".pnpmfile.cjs"
module.exports = {
  finders: {
    react17: (ctx) => {
      return ctx.readManifest().peerDependencies?.react === "^17.0.0"
    }
  }
}
```

### 查找器上下文 (ctx)

每个查找器函数接收一个上下文对象，描述正在访问的依赖节点。

| 字段               | 类型/示例                | 描述                                                                                   |
| ---------------- | -------------------- | ------------------------------------------------------------------------------------ |
| `name`           | `"minimist"`         | 包名称。                                                                                 |
| `version`        | `"1.2.8"`            | 软件包版本。                                                                               |
| `readManifest()` | 返回 `package.json` 对象 | 加载软件包清单 (对于诸如 `peerDependencies`, `license`, `engines` 等字段使用此选项)。 |

## 使用查找器

你可以使用 `--find-by=<functionName>` 标志调用查找器：

```
pnpm why --find-by=react17
```

输出：

```
@apollo/client 4.0.4
├── @graphql-typed-document-node/core 3.2.0
└── graphql-tag 2.12.6
```

## 返回额外的元数据

查找器还可以返回一个字符串。 该字符串将与输出中匹配的软件包一起显示。

示例：打印包许可证：

```js
module.exports = {
  finders: {
    react17: (ctx) => {
      const manifest = ctx.readManifest()
      if (manifest.peerDependencies?.react === "^17.0.0") {
        return `license: ${manifest.license}`
      }
      return false
    }
  }
}
```

输出：

```
@apollo/client 4.0.4
├── @graphql-typed-document-node/core 3.2.0
│   license: MIT
└── graphql-tag 2.12.6
    license: MIT
```

其他示例用例：

- 查找具有特定许可证的所有软件包。
- 检测需要最低Node.js版本的包。
- 列出所有暴露二进制的依赖项。
- 打印所有包的资助 URL。

