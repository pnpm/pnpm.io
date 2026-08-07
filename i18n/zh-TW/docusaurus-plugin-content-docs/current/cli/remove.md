---
id: remove
title: pnpm remove
---

指令別名：`rm`, `uninstall`, `un`

從 `node_modules` 和專案的 `package.json`中刪除依賴。

## 選項

### --recursive, -r

在 [工作區](../workspaces.md)中使用時，將從每個工作區包中刪除該依賴項。

When used not inside a workspace, removes a dependency (or dependencies) from every package found in subdirectories.

### --global, -g

刪除一個全域套件。

### --save-dev, -D

僅從 `devDependencies`中刪除依賴項。

### --save-optional, -O

僅從 `optionalDependencies`中刪除依賴項。

### --save-prod, -P

僅從 `dependencies`中刪除依賴項。

### --filter &lt;package_selector\>

[閱讀更多關於 filter 的資訊。](../filtering.md)
