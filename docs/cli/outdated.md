---
id: outdated
title: pnpm outdated
---

Checks for outdated packages. The check can be limited to a subset of the
installed packages by providing arguments (patterns are supported).

Examples:
```sh
pnpm outdated
pnpm outdated "*gulp-*" @babel/core
```

## Options

### --recursive, -r

Check for outdated dependencies in every package found in subdirectories, or in
every workspace package when executed inside a workspace.

### --filter &lt;package_selector\>

[Read more about filtering.](../filtering.md)

### --global

List outdated global packages.

### --long

Print details.

### --no-table

Prints the outdated dependencies in a list format instead of the default table.
Good for small consoles.

### --compatible

Prints only versions that satisfy specifications in `package.json`.

### --dev, -D

Checks only `devDependencies`.

### --prod, -P

Checks only `dependencies` and `optionalDependencies`.

### --no-optional

Doesn't check `optionalDependencies`.
