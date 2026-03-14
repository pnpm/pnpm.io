---
id: clean
title: pnpm clean
---

Safely remove `node_modules` directories from all workspace projects. Uses Node.js to remove directories, which correctly handles NTFS junctions on Windows without following them into their targets.

## Options

### --lockfile, -l

Also remove `pnpm-lock.yaml` files.
