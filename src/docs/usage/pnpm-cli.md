# pnpm CLI

Just use pnpm in place of npm:

```
pnpm install lodash
```

npm commands that are re-implemented in pnpm:

* `install`
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

Also, pnpm has some custom commands:

* `dislink`

  Unlinks a package. Like `yarn unlink` but pnpm re-installs the dependency
  after removing the external link.
* `store status`

  Returns a 0 exit code if packages in the store are not modified, i.e. the
  content of the package is the same as it was at the time of unpacking.
* `store prune`

  Removes unreferenced (extraneous, orphan) packages from the store.

The rest of the commands pass through to npm.

For using the programmatic API, use pnpm's engine: [supi](https://github.com/pnpm/supi).
