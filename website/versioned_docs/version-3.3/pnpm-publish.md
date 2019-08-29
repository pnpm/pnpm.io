---
id: version-3.3-pnpm-publish
title: pnpm publish
original_id: pnpm-publish
---

Publishes a package to the registry.

```
pnpm publish [<tarball>|<folder>] [--tag <tag>] [--access <public|restricted>]
```

When publishing a package inside a [workspace](workspace), the LICENSE file from the
root of the workspace is packed with the package (unless the package has a license of its own).

## --tag &lt;tag>

Publishes the package with the given tag. By default, `pnpm publish` updates the `latest` tag.

For example:

```sh
# inside the foo package directory
pnpm publish --tag next
# in a project where you want to use the next version of foo
pnpm add foo@next
```

## --access &lt;public|restricted>

Tells the registry whether the published package should be public or restricted.
