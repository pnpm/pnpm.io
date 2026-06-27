---
id: approve-builds
title: pnpm approve-builds
---

添加于：v10.1.0

在安装期间批准依赖项运行脚本。

已批准的依赖项会被添加到 `pnpm-workspace.yaml` 文件中的 \[allowBuilds] 映射里，取值为 `true`；而未批准的依赖项则取值为 `false`。 如果你愿意，你也可以手动更新这些设置。

[`allowBuilds`]: ../settings.md#allowbuilds

## 使用方法

你可以不带任何参数运行 `pnpm approve-builds` 来获得交互式提示，或者将包名作为位置参数传递：

```sh
pnpm approve-builds esbuild fsevents !core-js
```

在软件包名称前加上 `!` 即可拒绝该软件包。 只有上述提及的包会受到影响；其余包不受影响。

安装过程中，尚未在 `allowBuilds` 中列出的、具有被忽略的构建的软件包会自动添加到 `pnpm-workspace.yaml` 中，并带有占位符值，因此您可以手动将其设置为 `true` 或 `false`。

## 配置项

### --all

添加于：v10.32.0

无需交互式提示即可批准所有待处理的构建。

### ~~--global, -g~~

:::warning 已在 v11.0.0 版本中移除

`pnpm approve-builds -g` 不再支持隔离的全局包。 相反，在全局安装时使用 `--allow-build` （如：`pnpm add -g --allow-build=esbuild`），或者通过pnpm在全局安装期间显示的交互式提示来批准构建，。

:::

