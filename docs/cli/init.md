---
id: init
title: "pnpm init"
---

Create a `package.json` file.

## Options

### --bare

Added in: v10.25.0

Creates a `package.json` with only the required fields.

### --init-type &lt;type\>

* Default: **module**
* Type: **commonjs**, **module**

Set the module system for the package.

### --init-package-manager

Pin the project to the current pnpm version.

Since v11, the pin is written as a [`devEngines.packageManager`](../package_json.md#devenginespackagemanager) entry, so the resolved version is captured in `pnpm-lock.yaml`. Since v11.23.0 it is also written to the legacy `packageManager` field, as the exact running version rather than a `^` range, because Corepack reads only `packageManager` and accepts nothing but an exact version.

Inside a workspace subpackage this flag has no effect — the pin is only added to the workspace root's `package.json`, and the subpackage follows it. Pass `--no-init-package-manager` to scaffold a manifest with no pin at all.
