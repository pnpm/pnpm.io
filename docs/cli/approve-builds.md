---
id: approve-builds
title: pnpm approve-builds
---

Added in: v10.1.0

Approve dependencies for running scripts during installation.

The approved dependencies are added to the [`allowBuilds`] map in `pnpm-workspace.yaml` with a value of `true`, while unapproved ones are saved with a value of `false`. You can also update these settings manually if you prefer.

[`allowBuilds`]: ../settings.md#allowbuilds

## Options

### --global, -g

Added in: v10.4.0

Approve dependencies of globally installed packages.

