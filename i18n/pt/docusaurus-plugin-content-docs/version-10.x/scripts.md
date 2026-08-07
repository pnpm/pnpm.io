---
id: scripts
title: Scripts
---

How pnpm handles the `scripts` field of `package.json`.

## Lifecycle Scripts

### `pnpm:devPreinstall`

Runs only on local `pnpm install`.

Executada antes que qualquer dependencia seja instalada.

This script is executed only when set in the root project's `package.json`.
