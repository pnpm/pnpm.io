---
id: init
title: "pnpm init"
---

Create a `package.json` file.

## Opciones

### --bare

Added in: v10.25.0

Creates a `package.json` with only the required fields.

### --init-type &lt;type\>

- Default: **module**
- Type: **commonjs**, **module**

Set the module system for the package.

### --init-package-manager

Pin the project to the current pnpm version.

Since v11, the pin is written as a [`devEngines.packageManager`](../package_json.md#devenginespackagemanager) entry (instead of the legacy `packageManager` field), so version ranges are supported and the resolved version is captured in `pnpm-lock.yaml`.

Inside a workspace subpackage this flag has no effect — the `devEngines.packageManager` field is only added to the workspace root's `package.json`.
