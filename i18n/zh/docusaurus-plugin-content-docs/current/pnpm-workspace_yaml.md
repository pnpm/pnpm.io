---
id: pnpm-workspace_yaml
title: pnpm-workspace.yaml
---

`pnpm-workspace.yaml` 定义了 [工作空间][] 的根目录，并能够使你从工作空间中包含 / 排除目录 。 If the `packages` field is omitted, only the root package is included in the workspace.

例如：

```yaml title="pnpm-workspace.yaml"
packages:
  # 指定根目录直接子目录中的包
  - 'my-app'
  # packages/ 直接子目录中的所有包
  - 'packages/*'
  # components/ 子目录中的所有包
  - 'components/**'
  # 排除测试目录中的包
  - '!**/test/**'
```

即使使用了自定义目录位置通配符，根软件包也总是被包含.

目录也在 `pnpm-workspace.yaml` 文件中定义。 详情请参阅 [_目录_](./catalogs.md) 。

```yaml title="pnpm-workspace.yaml"
packages:
  - 'packages/*'

catalog:
  chalk: ^4.1.2

catalogs:
  react16:
    react: ^16.7.0
    react-dom: ^16.7.0
  react17:
    react: ^17.10.0
    react-dom: ^17.10.0
```

## packageConfigs

添加于：v11.0.0

允许为各个工作区包设置项目特定的配置。 这将替换工作区项目特定的 `.npmrc` 文件。

`packageConfigs` 可以指定为包名称到配置对象的映射：

```yaml title="pnpm-workspace.yaml"
packages:
  - "packages/project-1"
  - "packages/project-2"
packageConfigs:
  "project-1":
    saveExact: true
  "project-2":
    savePrefix: "~"
```

或者作为模式匹配规则的数组：

```yaml title="pnpm-workspace.yaml"
packages:
  - "packages/project-1"
  - "packages/project-2"
packageConfigs:
  - match: ["project-1", "project-2"]
    modulesDir: "node_modules"
    saveExact: true
```

[工作空间]: workspaces.md
