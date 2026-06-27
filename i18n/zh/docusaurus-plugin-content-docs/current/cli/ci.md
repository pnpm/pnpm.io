---
id: ci
title: pnpm ci
---

添加于：v11.0.0

别名：`clean-install`、`ic`、`install-clean`

执行一个清洁安装。 此命令运行 [`pnpm clean`](./clean.md)，然后运行 [`pnpm install --frozen-lockfile`](./install.md)。

专为 CI/CD 环境设计，在这些环境中，可复现的构建至关重要。

```sh
pnpm ci
```
