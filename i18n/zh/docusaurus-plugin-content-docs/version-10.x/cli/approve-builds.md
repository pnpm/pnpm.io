---
id: approve-builds
title: pnpm approve-builds
---

添加于：v10.1.0

在安装期间批准依赖项运行脚本。

已批准的依赖项将添加到 `pnpm-workspace.yaml` 中的 [`onlyBuiltDependencies`] 数组中，而未批准的依赖项将保存到 [`ignoredBuiltDependencies`]。 如果你愿意，你也可以手动更新这些设置。

[`onlyBuiltDependencies`]: ../settings.md#onlybuiltdependencies
[`ignoredBuiltDependencies`]: ../settings.md#ignoredbuiltdependencies

## 配置项

### --all

添加于：v10.32.0

无需交互式提示即可批准所有待处理的构建。

### --global, -g

添加于：v10.4.0

批准全局安装的包的依赖关系。

