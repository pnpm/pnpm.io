---
id: version-3.8-publish
title: pnpm publish
original_id: publish
---

Publishes a package to the registry.

```text
pnpm publish [&lt;tarball>|&lt;folder>] [--tag &lt;tag>] [--access &lt;public|restricted>]
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

## package.json publishConfig

Added in: v3.4.0

It is possible to override some fields in the manifest, before the package is packed.
The following fields may be overriden: `typings`, `types`, `main` and `module`.
To override a field, add the publish version of the field to `publishConfig`.

For instance, the following `package.json`:

```json
{
    "name": "foo",
    "version": "1.0.0",
    "main": "src/index.ts",
    "publishConfig": {
        "main": "lib/index.js",
        "typings": "lib/index.d.ts"
    }
}
```

Will be published as:

```json
{
    "name": "foo",
    "version": "1.0.0",
    "main": "lib/index.js",
    "typings": "lib/index.d.ts"
}
```
