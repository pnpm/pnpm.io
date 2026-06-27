---
id: scripts
title: Scripts
---

How pnpm handles the `scripts` field of `package.json`.

## Scripts de ciclo de vida

### `pnpm:devPreinstall`

Runs only on local `pnpm install`.

Se ejecuta antes de que se instale cualquier dependencia.

This script is executed only when set in the root project's `package.json`.
