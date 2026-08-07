---
id: scripts
title: 脚本
---

pnpm 如何处理 `package.json` 的 `scripts` 字段。

## 隐藏脚本

添加于：v11.0.0

名称以 `.` 开头的脚本将被隐藏。 它们不能通过 `pnpm run` 直接运行，并且会从 `pnpm run` 列表中省略。 隐藏脚本只能从其他脚本调用。

```json
{
  "scripts": {
    ".helper": "echo 'I am hidden'",
    "build": "pnpm run .helper && tsc"
  }
}
```

在这个例子中，`pnpm run .helper` 会失败，但 `pnpm run build` 会成功，因为 `.helper` 是从另一个脚本调用的。

## 环境变量

pnpm 在生命周期脚本执行期间设置以下环境变量：

- `npm_package_name` — 包名
- `npm_package_version` — 包版本
- `npm_lifecycle_event` — 正在运行的脚本的名称（例如，`postinstall`）

:::note

自 v11 起，pnpm 不再从 pnpm 配置中填充 `npm_config_*` 环境变量。 仅设置了上述众所周知的 `npm_*` 变量，与 Yarn 的行为一致。

:::

## 内置命令和脚本名称冲突

添加于：v11.0.0

以下内置命令优先使用用户脚本：`clean`、`setup`、`deploy` 和 `rebuild`。 如果你的 `package.json` 定义了一个具有这些名称之一的脚本，`pnpm <name>` 将执行该脚本而不是内置命令。

要强制使用内置命令，请使用 [`pnpm pm <name>`](./cli/pm.md)。

## 生命周期脚本

### `pnpm:devPreinstall`

仅在本地 `pnpm install` 时运行。

在安装任何依赖项之前运行。

此脚本仅设置在根项目的 `package.json` 时才执行。
