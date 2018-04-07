---
id: pnpm-cli
title: pnpm CLI
---

Just use pnpm in place of npm:

```sh
pnpm install lodash
```

npm commands that are re-implemented in pnpm:

* [install](pnpm-install.md)
* `update`
* `uninstall`
* `link`
* `prune`
* `list`
* `install-test`
* `outdated`
* `rebuild`
* `root`
* `help`

The rest of the commands pass through to npm.

For using the programmatic API, use pnpm's engine: [supi](https://github.com/pnpm/supi).
