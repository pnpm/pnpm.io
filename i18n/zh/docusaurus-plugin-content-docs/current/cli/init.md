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

* 默认值： **module**
* 类型： **commonjs**, **module**

设置软件包的模块系统。

### --init-package-manager

Pin the project to the current pnpm version.

Since v11, the pin is written as a [`devEngines.packageManager`](../package_json.md#devenginespackagemanager) entry (instead of the legacy `packageManager` field), so version ranges are supported and the resolved version is captured in `pnpm-lock.yaml`.

Inside a workspace subpackage this flag has no effect — the `devEngines.packageManager` field is only added to the workspace root's `package.json`.
