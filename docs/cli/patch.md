---
id: patch
title: "pnpm patch <pkg>"
---

Added in: v7.4.0

Prepare a package for patching (inspired by a similar command in Yarn).

This command will cause a package to be extracted in a temporary directory. Within here you have a `\source` and a `\user` directory. The `\user` directory is intended to be editable at will.

Once you're done with your changes, run `pnpm patch-commit <path>` (with `<path>` being the path to the `\user` directory within the temporary location you received) to generate a patchfile and register it into your top-level manifest via the [`patchedDependencies`] field.

Usage:

```
pnpm patch <pkg name>@<version>
```

[`patchedDependencies`]: ../package_json.md#pnpmpatcheddependencies

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/0GjLqRGRbcY" title="The pnpm patch command demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Options

### --edit-dir &lt;dir>

Added in v7.11.0

The package that needs to be patched will be extracted to this directory.

