---
id: unlink
title: pnpm unlink
original_id: unlink
---

Alias: `dislink`

Unlinks a package. Like `yarn unlink` but pnpm re-installs the dependency
after removing the external link.

If called without arguments, all linked-in dependencies will be unlinked.

## Synopsis

```text
pnpm unlink [-r] [--filter &lt;package_selector>] [&lt;pkg>...]
pnpm recursive unlink [--filter &lt;package_selector>] [&lt;pkg>...]
pnpm multi unlink [--filter &lt;package_selector>] [&lt;pkg>...]
```

## Options

### --recursive, -r

Unlink in every package found in subdirectories
or in every workspace package, when executed inside a [workspace](../workspaces).

### --filter &lt;package_selector>

[Read more about filtering.](../filtering)
