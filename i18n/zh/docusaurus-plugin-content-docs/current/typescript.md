---
id: typescript
title: 使用 TypeScript
---

大多数情况下，pnpm 应该可以与 TypeScript 很好地配合使用。

## 不保留符号链接

你不应该使用 [`preserveSymlinks`](https://www.typescriptlang.org/tsconfig/#preserveSymlinks) 设置为 `true` 的 TypeScript。 TypeScript 将无法正确解析链接的 `node_modules` 中的类型依赖关系。 如果你确实需要维护符号链接，那么你应该设置 pnpm 的 `nodeLinker` 设置为 `hoisted` 。

## 工作区使用

如果工作区中存在不同版本的 `@types/` 依赖项，有时可能会遇到问题。 当包需要这些类型而依赖项中没有类型依赖时，就会发生这些问题。 例如，如果你的依赖项中有 `antd`，它依赖于 `@types/react`，那么当你的工作区中有多个版本的 `@types/react` 时，你可能会收到编译错误。 这实际上是 `antd` 端的问题，因为它应该将 `@types/react` 添加到 `peerDependencies`。 幸运的是，你可以通过在 `antd` 中扩展缺失的对等依赖来解决这个问题。 你可以通过将此添加到你的 `pnpm-workspace.yaml`来做到这一点：

```yaml
packageExtensions:
  antd:
    peerDependencies:
      '@types/react': '*'
```

或者，你可以安装我们为处理这些问题而创建的配置依赖项 \['@pnpm/plugin-types-fixer']。 运行：

```sh
pnpm add @pnpm/plugin-types-fixer --config
```

[`@pnpm/plugin-types-fixer`]: https://github.com/pnpm/plugin-types-fixer

