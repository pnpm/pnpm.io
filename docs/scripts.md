---
id: scripts
title: Scripts
---

How pnpm handles the `scripts` field of `package.json`.

## Lifecycle Scripts

### `pnpm:devPreinstall`

Runs only on local `pnpm install`.

Runs before any dependency is installed.

This script is executed only when set in the root project's `package.json`.

*Note: `pre` or `post` scripts is not supported, but standard lifecycle scripts like `postinstall` or `prepublishOnly` are not affected. If you would like to enable this feature, configure `enable-pre-post-scripts=true` in `.npmrc`.*
