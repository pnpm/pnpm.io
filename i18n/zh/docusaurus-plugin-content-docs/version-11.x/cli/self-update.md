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

### In a project that pins pnpm

When the project's `package.json` has a `packageManager` field set to pnpm (or a `devEngines.packageManager` entry for pnpm), `self-update` only updates the pinned version in `package.json` to the resolved one. 它不会全局安装 pnpm。 下次运行 pnpm 命令时，pnpm 将自动下载并切换到指定的版本。

### Outside a project (or when the pnpm pin is ignored)

If the project does not pin pnpm, or the pin is being ignored via [`pmOnFail: ignore`](../settings.md#pmonfail), `self-update` installs the resolved pnpm version globally and links it to `PNPM_HOME` so it becomes the active pnpm binary on your system.
