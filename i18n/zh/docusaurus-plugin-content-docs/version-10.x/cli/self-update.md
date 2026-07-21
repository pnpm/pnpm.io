---
id: self-update
title: pnpm self-update
---

将 pnpm 更新到最新版本或指定版本。

```
pnpm self-update [<version>]
```

用法示例：

```
pnpm self-update
pnpm self-update 10
pnpm self-update next-10
pnpm self-update 10.6.5
```

## 行为

`pnpm self-update` 的行为取决于项目上下文：

### 在设置了 `managePackageManagerVersions=true` 的项目中

当启用 [`managePackageManagerVersions`](../settings.md#managepackagemanagerversions) 并且项目的 `package.json` 中有 `packageManager` 字段设置为 pnpm 时，`self-update` 只会将 `package.json` 中的 `packageManager` 字段更新为已解析的版本。 它不会全局安装 pnpm。 下次运行 pnpm 命令时，pnpm 将自动下载并切换到指定的版本。

### 如果没有 `managePackageManagerVersions` 或在项目之外，

否则，`self-update` 会将解析后的 pnpm 版本全局安装，并将其链接到 `PNPM_HOME`，使其成为系统上活动的 pnpm 二进制文件。
