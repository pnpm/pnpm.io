---
id: cli
title: "CLI Settings"
sidebar_label: "CLI"
---

### [no-]color

* Default: **auto**
* Type: **auto**, **always**, **never**

Controls colors in the output.

* **auto** - output uses colors when the standard output is a terminal or TTY.
* **always** - ignore the difference between terminals and pipes. You’ll rarely
  want this; in most scenarios, if you want color codes in your redirected
  output, you can instead pass a `--color` flag to the pnpm command to force it
  to use color codes. The default setting is almost always what you’ll want.
* **never** - turns off colors. This is the setting used by `--no-color`.

### loglevel

* Default: **info**
* Type: **debug**, **info**, **warn**, **error**

Any logs at or higher than the given level will be shown.
You can instead pass `--silent` to turn off all output logs.

### useBetaCli

* Default: **false**
* Type: **Boolean**

Experimental option that enables beta features of the CLI. This means that you
may get some changes to the CLI functionality that are breaking changes, or
potentially bugs.

### recursiveInstall

* Default: **true**
* Type: **Boolean**

If this is enabled, the primary behaviour of `pnpm install` becomes that of
`pnpm install -r`, meaning the install is performed on all workspace or
subdirectory packages.

Else, `pnpm install` will exclusively build the package in the current
directory.

### engineStrict

* Default: **false**
* Type: **Boolean**

If this is enabled, pnpm will not install any package that claims to not be
compatible with the current Node version.

Regardless of this configuration, installation will always fail if a project
(not a dependency) specifies an incompatible version in its `engines` field.

### npmPath

* Type: **path**

The location of the npm binary that pnpm uses for some actions, like publishing.

### pmOnFail

Added in: v11.0.0

* Default: **download**
* Type: **download**, **error**, **warn**, **ignore**

Overrides the `onFail` behavior of both the `packageManager` field and `devEngines.packageManager` when the running pnpm version does not match the declared one.

* `download` — download and run the declared pnpm version (this is the default and matches the previous `managePackageManagerVersions: true` behavior).
* `error` — fail the command (equivalent to the previous `packageManagerStrictVersion: true`).
* `warn` — print a warning but continue (equivalent to the previous `packageManagerStrict: false` or `COREPACK_ENABLE_STRICT=0`).
* `ignore` — skip the check entirely (equivalent to the previous `managePackageManagerVersions: false`). Useful when version management is handled by an external tool such as asdf, mise, or Volta.

Can be set via CLI flag, environment variable, or `pnpm-workspace.yaml`:

```sh
pnpm install --pm-on-fail=ignore
pnpm_config_pm_on_fail=ignore pnpm install
```

```yaml title="pnpm-workspace.yaml"
pmOnFail: ignore
```

This setting replaces the removed `managePackageManagerVersions`, `packageManagerStrict`, and `packageManagerStrictVersion` settings, as well as the `COREPACK_ENABLE_STRICT` environment variable.

Migration:

| Removed setting                       | Replace with                   |
| ------------------------------------- | ------------------------------ |
| `managePackageManagerVersions: true`  | `pmOnFail: download` (default) |
| `managePackageManagerVersions: false` | `pmOnFail: ignore`             |
| `packageManagerStrict: false`         | `pmOnFail: warn`               |
| `packageManagerStrictVersion: true`   | `pmOnFail: error`              |
| `COREPACK_ENABLE_STRICT=0`            | `pmOnFail: warn`               |

See also [`pnpm with`](../cli/with.md) for running pnpm at a specific version without changing this setting.

### ignoreWorkspaceRootCheck

* Default: **false**
* Type: **Boolean**

If this is enabled, running `pnpm install`/`pnpm add` from the project's root 
folder will no longer error when `-w`/`--ignore-workspace-root-check` is not 
provided.
