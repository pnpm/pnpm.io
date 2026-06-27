---
id: prune
title: pnpm prune
---

移除不需要的套件

## 選項

### --prod

移除在 `devDependencies` 中指定的套件。

### --no-optional

移除在 `optionalDependencies` 中指定的套件。

:::warning

prune 命令目前不支援在 monorepo 上遞迴執行。 要僅在 monorepo 中安裝 production 依賴項，可以刪除 `node_modules` 文件夾，然後使用 `pnpm install --prod`重新安裝。

:::

