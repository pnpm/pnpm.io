---
id: remove
title: pnpm remove
---

别名：`rm`、`uninstall`、`un`

从 `node_modules` 和 `package.json` 中删除软件包。

## 配置项

### --recursive, -r

当在 [工作空间](../workspaces.md) 中使用时，从每个工作空间包中除去一个（或多个）依赖关系 。

当不在工作空间内使用时，将在子目录中找到的每个包中删除一个（或多个）依赖。

### --global, -g

删除全局软件包。

### --save-dev, -D

仅从 `devDependencies` 中删除依赖项。

### --save-optional, -O

仅从 `optionalDependencies` 中删除依赖项。

### --save-prod, -P

仅从 `dependencies` 中删除相关依赖项。

### --filter &lt;package_selector\>

[阅读更多有关过滤的内容。](../filtering.md)
