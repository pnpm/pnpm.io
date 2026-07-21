---
id: update
title: pnpm update
---

别名：`up`、`upgrade`

`pnpm update` 基于指定的范围更新包到它们的最新版本。

在不带参数的情况下使用时，将更新所有依赖关系。

## 摘要：

| 命令                   | 含义                               |
| -------------------- | -------------------------------- |
| `pnpm up`            | 更新所有依赖项，遵守 `package.json` 中指定的范围 |
| `pnpm up --latest`   | 将所有依赖项更新到最新版本                    |
| `pnpm up foo@2`      | 将 `foo` 更新到 v2 上的最新版本            |
| `pnpm up "@babel/*"` | 更新 `@babel` 范围内的所有依赖项            |

## 使用模式匹配选择依赖项

你可以使用模式来更新特定的依赖项。

更新所有 `babel` 包:

```sh
pnpm update "@babel/*"
```

更新所有依赖项，除了 `webpack`:

```sh
pnpm update "\!webpack"
```

模式也可以组合，因此下一个命令将更新所有 `babel` 包，除了 `core`：

```sh
pnpm update "@babel/*" "\!@babel/core"
```

## 配置项

### --recursive, -r

同时在所有子目录中使用 `package.json` (不包括
`node_modules`) 运行更新。

用法示例：

```sh
pnpm --recursive update
# 更新子目录深度为 100 以内的所有包
pnpm --recursive update --depth 100
# 将每个包中的 typescript 更新为最新版本
pnpm --recursive update typescript@latest
```

### --latest, -L

将依赖项更新至由 `latest` 标签决定的最新稳定版本（有可能会跨越主版本号），只要 `package.json` 中指定的版本范围低于 `latest` 标签的版本号（即不会对预发布版本降级）。

### --global, -g

更新全局安装的依赖包。

### --workspace

尝试从工作空间链接所有软件包。 版本将更新至与工作空间内的包匹配的版本。

如果更新了特定的包，而在工作空间内也找不到任何可更新的依赖项，则命令将会失败。 例如，如果 `express` 不是工作空间内的包，那么以下命令将失败：

```sh
pnpm up -r --workspace express
```

### --prod, -P

仅更新在 `dependencies` 和 `optionalDependencies` 中的依赖项。

### --dev, -D

仅更新在 `devDependencies` 中的依赖项。

### --no-optional

忽略在 `optionalDependencies` 中的依赖项。

### --interactive, -i

显示过时的依赖项并选择要更新的依赖项。

### --no-save

不更新 `package.json` 中的范围。

### --filter &lt;package_selector\>

[阅读更多有关过滤的内容。](../filtering.md)
