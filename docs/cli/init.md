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

Since v11, the pin is written as a [`devEngines.packageManager`](../package_json.md#devenginespackagemanager) entry (instead of the legacy `packageManager` field), so version ranges are supported and the resolved version is captured in `pnpm-lock.yaml`.

Since v11.23.0, the pin is the exact running version rather than a `^` range, and it is written to the `packageManager` field as well as to `devEngines.packageManager`. Corepack reads only `packageManager` and accepts nothing but an exact version, so it rejected the generated manifest with "expected a semver version" ([#13969](https://github.com/pnpm/pnpm/issues/13969)).

Inside a workspace subpackage this flag has no effect — the pin is only added to the workspace root's `package.json`, and the subpackage follows it. Pass `--no-init-package-manager` to scaffold a manifest with no pin at all.
