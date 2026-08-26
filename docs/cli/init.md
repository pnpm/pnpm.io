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

Pin the project to a pnpm version.

Since v11, the pin is written as a [`devEngines.packageManager`](../package_json.md#devenginespackagemanager) entry, so the resolved version is captured in `pnpm-lock.yaml`. Since v11.23.0 it is also written to the legacy `packageManager` field, as an exact version rather than a `^` range, because Corepack reads only `packageManager` and accepts nothing but an exact version.

Since v12.0.0, the pinned version is the **latest** released pnpm, not the pnpm that ran the command, so a project scaffolded by an outdated pnpm no longer inherits that staleness through its own pin ([#7490](https://github.com/pnpm/pnpm/issues/7490)). The version is read from the `latest` tag on the package-manager registries. When that lookup cannot answer — no network, an unreachable or slow registry, `--offline`, or a `latest` that [`minimumReleaseAge`](../settings/dependency-resolution.md#minimumreleaseage) or [`trustPolicy`](../settings/dependency-resolution.md#trustpolicy) rejects — the running version is pinned as before. The lookup never fails or hangs the command, and a `latest` older than the running pnpm is never pinned.

Inside a workspace subpackage this flag has no effect — the pin is only added to the workspace root's `package.json`, and the subpackage follows it. Pass `--no-init-package-manager` to scaffold a manifest with no pin at all.

## Configuration

These settings fill in fields of the scaffolded `package.json`. They may be set in `pnpm-workspace.yaml`, in the [global configuration file](./config.md), or through the environment as `PNPM_CONFIG_INIT_VERSION` and friends.

### initVersion

* Default: **1.0.0**
* Type: **String**

The `version` written into the new `package.json`.

### initLicense

* Default: **ISC**
* Type: **String**

The `license` written into the new `package.json`.

### initAuthorName, initAuthorEmail, initAuthorUrl

* Type: **String**

Assembled into the `author` field, in npm's `Name <email> (url)` form. A field left unset is left out of the string; with none of the three set, no `author` field is written.

```yaml title="pnpm-workspace.yaml"
initLicense: MIT
initAuthorName: Zoltan Kochan
initAuthorUrl: https://kochan.io
```

:::note

pnpm 11 reads these settings; the Rust CLI recognized but ignored them until v12.0.0.

:::
