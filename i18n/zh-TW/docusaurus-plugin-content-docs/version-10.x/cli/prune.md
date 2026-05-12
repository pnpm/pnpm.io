---
id: prune
title: pnpm prune
---

移除不需要的套件

## Options

### --prod

Remove the packages specified in `devDependencies`.

### --no-optional

Remove the packages specified in `optionalDependencies`.

:::warning

prune 命令目前不支援在 monorepo 上遞迴執行。 To only install production-dependencies in a monorepo `node_modules` folders can be deleted and then re-installed with `pnpm install --prod`.

:::

