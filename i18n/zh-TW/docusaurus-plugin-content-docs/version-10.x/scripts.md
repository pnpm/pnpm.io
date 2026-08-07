---
id: scripts
title: Scripts
---

How pnpm handles the `scripts` field of `package.json`.

## Lifecycle Scripts

### `pnpm:devPreinstall`

Runs only on local `pnpm install`.

會在安裝任何依賴套件之前執行。

This script is executed only when set in the root project's `package.json`.
