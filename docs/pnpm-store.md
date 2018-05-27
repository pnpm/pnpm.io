---
id: pnpm-store
title: pnpm store
---

## pnpm store status

Returns a 0 exit code if packages in the store are not modified, i.e. the
content of the package is the same as it was at the time of unpacking.

## pnpm store prune

Removes unreferenced (extraneous, orphan) packages from the store.

> This command is prohibited when a [store server](pnpm-server.md) is running.
