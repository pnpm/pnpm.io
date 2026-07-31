---
id: nodejs
title: "Node.js Settings"
sidebar_label: "Node.js"
---

### nodeVersion

* Default: the value returned by **node -v**, without the v prefix
* Type: **exact semver version (not a range)**

The Node.js version to use when checking a package's `engines` setting.

If you want to prevent contributors of your project from adding new incompatible dependencies, use `nodeVersion` and `engineStrict` in a `pnpm-workspace.yaml` file at the root of the project:

```ini
nodeVersion: 12.22.0
engineStrict: true
```

This way, even if someone is using Node.js v16, they will not be able to install a new dependency that doesn't support Node.js v12.22.0.

### runtimeOnFail

Added in: v11.0.0

* Default: **undefined**
* Type: **download**, **error**, **warn**, **ignore**

Overrides the `onFail` field of [`devEngines.runtime`](../package_json.md#devenginesruntime) (and `engines.runtime`) in the root project's `package.json`. This is useful when you want a different local behavior than what is written in the manifest — for instance, forcing pnpm to download the declared runtime even when the manifest sets `onFail: "warn"`:

```yaml title="pnpm-workspace.yaml"
runtimeOnFail: download
```

### nodeDownloadMirrors

Added in: v11.0.0

* Default: **undefined**
* Type: **Record&lt;string, string&gt;**

Configure custom Node.js download mirrors in `pnpm-workspace.yaml`. The keys are release channels (`release`, `rc`, `nightly`, `v8-canary`, etc.) and the values are base URLs.

Here is how pnpm may be configured to download Node.js from a mirror in China:

```yaml
nodeDownloadMirrors:
  release: https://npmmirror.com/mirrors/node/
  rc: https://npmmirror.com/mirrors/node-rc/
  nightly: https://npmmirror.com/mirrors/node-nightly/
```
