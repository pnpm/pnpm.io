---
id: pm
title: pnpm pm
---

`pnpm pm <command>` 语法总是运行内置的 pnpm 命令，绕过 `package.json` 中任何同名的脚本。

一些内置命令可以被脚本覆盖。 例如，如果你的项目在 `package.json` 中定义了一个 `"clean"` 脚本，那么 `pnpm clean` 将运行该脚本而不是内置的 [`pnpm clean`](./clean.md)。 使用 `pnpm pm clean` 会强制运行内置命令。

## 示例

```json title="package.json"
{
  "scripts": {
    "clean": "rm -rf dist"
  }
}
```

```sh
# 运行 package.json 中的“clean”脚本
pnpm clean
# 或者显式地：
pnpm run clean

# 运行内置的 pnpm clean 命令（删除 node_modules 目录）
pnpm pm clean
```
