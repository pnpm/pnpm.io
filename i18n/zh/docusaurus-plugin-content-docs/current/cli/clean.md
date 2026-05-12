---
id: clean
title: pnpm clean
---

别名：`purge`

安全地从所有工作区项目中移除 `node_modules` 内容。 使用 Node.js 删除目录，可以正确处理 Windows 上的 NTFS 连接点，而不会跟随它们进入目标目录。

在工作区中，根目录和每个工作区包中的 `node_modules` 目录都会被清理。 `node_modules` 中的非 pnpm 隐藏条目（例如，`.cache`）将被保留。

如果配置了自定义的 [`virtualStoreDir`](../settings.md#virtualstoredir) 并且它位于项目根目录内（但在 `node_modules` 目录外），则也会将其删除。

## 配置项

### --lockfile, -l

同时删除 `pnpm-lock.yaml` 文件。
