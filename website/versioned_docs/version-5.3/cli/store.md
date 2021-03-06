---
id: store
title: pnpm store
original_id: store
---

Managing the [package store](../about-package-store).

## Commands

### pnpm store status

```text
pnpm store status
```

Checks for modified packages in the store.

Returns exit code 0 if the content of the package is the same as it was at the time of unpacking.

### pnpm store add

Added in: v2.12.0

```text
pnpm store add &lt;pkg>...
```

Adds new packages to the pnpm store directly. 
Does not modify any projects or files outside the store.

Usage examples:

```sh
pnpm store add express@4 typescript@2
```

### pnpm store prune

```sh
pnpm store prune
```

Removes unreferenced (extraneous, orphan) packages from the store.

Pruning the store is not harmful, but might slow down future installations.

Please read [the FAQ](faq.md#what-does-pnpm-store-prune-do-is-it-harmful) for more information on unreferenced packages and `pnpm store prune` best practices.

> This command is prohibited when a [store server](server) is running.
