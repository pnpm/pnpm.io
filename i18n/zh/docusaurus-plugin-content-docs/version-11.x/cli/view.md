---
id: view
title: pnpm view
---

添加于：v11.0.0

别名：`info`、`show`

从注册源中查看软件包元数据。

```sh
pnpm view <pkg>
pnpm view <pkg> [field]
```

## 使用方法

显示软件包的所有元数据：

```sh
pnpm view express
```

显示特定字段：

```sh
pnpm view express version
pnpm view express dependencies
pnpm view express dist-tags
```

显示特定版本的元数据：

```sh
pnpm view express@4.18.0
```

## 配置项

### --json

以 JSON 格式输出元数据。
