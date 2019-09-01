---
id: version-3.8-unlink
title: pnpm unlink
original_id: unlink
---

Unlinks a package. Like `yarn unlink` but pnpm re-installs the dependency
after removing the external link.

If called witout arguments, all linked-in dependencies will be unlinked.

```sh
pnpm unlink [-r] [--filter <package_selector>] [<pkg>...]
pnpm recursive unlink [--filter <package_selector>] [<pkg>...]
pnpm multi unlink [--filter <package_selector>] [<pkg>...]
```

Alias: dislink

## Options

### -r

Unlink in every package found in subdirectories
or in every workspace package, when executed inside a [workspace](../workspaces).

### --filter &lt;package_selector>

[Read more about filtering.](../filtering)
