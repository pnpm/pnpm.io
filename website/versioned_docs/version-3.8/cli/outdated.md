---
id: outdated
title: pnpm outdated
original_id: outdated
---

Check for outdated packages. The check can be limited to a subset of the installed
packages by providing arguments (patterns are supported).

## Synopsis

```text
pnpm outdated [-r] [--filter &lt;package selector>]
              [&lt;package pattern> ...]

pnpm recursive outdated [--filter &lt;package selector>]
                        [&lt;package pattern> ...]
```

## Examples

```
pnpm outdated
pnpm outdated gulp-* @babel/core
```

## Options

### --recursive, -r

Check for outdated dependencies in every package found in subdirectories
or in every workspace package, when executed inside a workspace.

### --filter &lt;package_selector>

[Read more about filtering.](../filtering)

### --global

List outdated global packages.
