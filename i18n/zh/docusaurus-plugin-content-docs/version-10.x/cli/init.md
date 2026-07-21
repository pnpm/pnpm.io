---
id: init
title: "pnpm init"
---

创建一个 `package.json` 文件。

## 配置项

### --bare

添加于：v10.25.0

创建一个只包含必填字段的 `package.json`。

### --init-type &lt;type\>

- 默认值：**commonjs**
- 类型：**commonjs**，**module**

设置软件包的模块系统。

### --init-package-manager

通过在 package.json 中添加“packageManager”字段，将项目锁定到当前的 pnpm 版本。
