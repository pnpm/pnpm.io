---
id: pnpm-cli
title: pnpm CLI
---

Just use pnpm in place of npm:

```sh
pnpm install lodash
```

npm commands that are re-implemented in pnpm:

* [install](cli/install)
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

* [recursive](cli/recursive)
* [store](cli/store)
* [server](cli/server)
* [import](cli/import)

The rest of the commands pass through to npm.

For using the programmatic API, use pnpm's engine: [supi](https://github.com/pnpm/pnpm/tree/master/packages/supi).
