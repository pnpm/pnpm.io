---
id: config-dependencies
title: 配置依赖项
---

配置依赖项允许你在多个项目之间共享和集中配置文件、设置和钩子。 它们在所有常规依赖项（“dependencies”、“devDependencies”、“optionalDependencies”）之前安装，使其成为设置自定义钩子、补丁和目录条目的理想选择。

配置依赖项可帮助你将所有挂钩、设置、补丁、覆盖、目录、规则保存在一个地方，并在多个存储库中使用它们。

如果你的配置依赖项按照 `pnpm-plugin-*` 或 `@*/pnpm-plugin-*` 模式命名，pnpm 将自动从其根目录加载 `pnpmfile.cjs`。

## 如何添加配置依赖项

配置依赖关系定义在你的 `pnpm-workspace.yaml` 中，必须使用精确的版本和完整性校验和来安装。

例如，运行 `pnpm add --configmy-configs` 会将此条目添加到你的 `pnpm-workspace.yaml`：

```yaml title="pnpm-workspace.yaml"
configDependencies:
  my-configs: "1.0.0+sha512-30iZtAPgz+LTIYoeivqYo853f02jBYSd5uGnGpkFV0M3xOt9aN73erkgYAmZU43x4VfqcnLxW9Kpg3R5LC4YYw=="
```

**重要：**

- 配置依赖项**不能**有自己的依赖项。
- 配置依赖项**不能**定义生命周期脚本 (例如 `preinstall`, `postinstall` 等)。

## 使用方法

### 加载一个允许构建的依赖列表

你可以使用 [`onlyBuiltDependenciesFile`] 设置加载允许构建的包名称列表。

配置依赖项内的示例 `allow.json` 文件：

```json title="allow.json"
[
  "@airbnb/node-memwatch",
  "@apollo/protobufjs",
  ...
]
```

你的工作区配置：

```yaml title="pnpm-workspace.yaml"
configDependencies:
  '@myorg/trusted-deps': 0.1.0+sha512-IERT0uXPBnSZGsCmoSuPzYNWhXWWnKkuc9q78KzLdmDWJhnrmvc7N4qaHJmaNKIusdCH2riO3iE34Osohj6n8w==
onlyBuiltDependenciesFile: node_modules/.pnpm-config/@myorg/trusted-deps/allow.json
```

[`onlyBuiltDependenciesFile`]: settings.md#onlybuiltdependenciesfile

### 安装钩子中使用的依赖项

配置依赖项在加载 [`.pnpmfile.cjs`] 中的钩子之前安装，允许你从配置包导入逻辑。

示例：

```js title=".pnpmfile.cjs"
const { readPackage } = require('.pnpm-config/my-hooks')

module.exports = {
  hooks: {
    readPackage
  }
}
```

[`.pnpmfile.cjs`]: ./pnpmfile.md

### 动态更新 pnpm 设置

使用 [`updateConfig`] 钩子，你可以使用配置依赖项动态更新 pnpm 的设置。

例如，以下 `pnpmfile` 向 pnpm 的配置中添加了一个新的 [catalog] 条目：

```js title="@myorg/pnpm-plugin-my-catalogs/pnpmfile.cjs"
module.exports = {
  hooks: {
    updateConfig (config) {
      config.catalogs.default ??= {}
      config.catalogs.default['is-odd'] = '1.0.0'
      return config
    }
  }
}
```

如果将其作为配置依赖项安装：

```
pnpm add --config @myorg/pnpm-plugin-my-catalogs
```

那么你可以运行：

```
pnpm add is-odd@catalog:
```

这将安装 `is-odd@1.0.0` 并将以下内容添加到你的 `package.json` 中：

```json
{
  "dependencies": {
    "is-odd": "catalog:"
  }
}
```

这使得跨项目维护和共享集中配置和依赖项版本变得容易。

[`updateConfig`]: ./pnpmfile.md#hooksupdateconfigconfig-config--promiseconfig
[catalog]: ./catalogs.md

### 加载补丁文件

您可以引用存储在配置依赖项中的 \[patch files]\[补丁文件]。

示例：

```yaml title="pnpm-workspace.yaml"
configDependencies:
  my-patches: "1.0.0+sha512-30iZtAPgz+LTIYoeivqYo853f02jBYSd5uGnGpkFV0M3xOt9aN73erkgYAmZU43x4VfqcnLxW9Kpg3R5LC4YYw=="
patchedDependencies:
  react: "node_modules/.pnpm-config/my-patches/react.patch"
```

[patch files]: ./cli/patch.md
