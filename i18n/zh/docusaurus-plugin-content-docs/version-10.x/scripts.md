---
id: scripts
title: 脚本
---

pnpm 如何处理 `package.json` 的 `scripts` 字段。

## 生命周期脚本

### `pnpm:devPreinstall`

仅在本地 `pnpm install` 时运行。

在安装任何依赖项之前运行。

此脚本仅设置在根项目的 `package.json` 时才执行。
