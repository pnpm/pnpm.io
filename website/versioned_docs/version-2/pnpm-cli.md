---
id: version-2-pnpm-cli
title: pnpm CLI
original_id: pnpm-cli
---

Just use pnpm in place of npm:

```sh
pnpm install lodash
```

npm commands that are re-implemented in pnpm:

* [install](pnpm-install)
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

Also, there are some commands unique to pnpm:

* [recursive](pnpm-recursive)
* [store](pnpm-store)
* [server](pnpm-server)
* [import](pnpm-import)

The rest of the commands pass through to npm.

For using the programmatic API, use pnpm's engine: [supi](https://github.com/pnpm/pnpm/tree/master/packages/supi).
