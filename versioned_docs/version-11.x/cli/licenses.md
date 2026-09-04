---
id: licenses
title: pnpm licenses
---

## Commands

### list

Aliases: `ls`

List licenses for installed packages.

Since v11.20.0, a package resolved from a [named registry](../settings/dependency-resolution.md#namedregistries) is reported separately from a package of the same name and version that came from another registry. The registry alias is shown next to the package name in the table output and is exposed as the `registryName` field with `--json`.

## Options

### --dev, -D

Check only "devDependencies".

### --json

Show information in JSON format.

### --long

Show more details (such as a link to the repo) are not displayed. To display the details, pass this option.

### --no-optional

Don't check packages from `optionalDependencies`.

### --prod, -P

Check only `dependencies` and `optionalDependencies`.

### --filter &lt;package_selector\>

[Read more about filtering.](../filtering.md)
