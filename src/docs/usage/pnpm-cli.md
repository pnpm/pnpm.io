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

Also, pnpm has some custom commands.

## dislink

Unlinks a package. Like `yarn unlink` but pnpm re-installs the dependency
after removing the external link.

## store status

Returns a 0 exit code if packages in the store are not modified, i.e. the
content of the package is the same as it was at the time of unpacking.

## store prune

Removes unreferenced (extraneous, orphan) packages from the store.

## server start

Added in: v1.30.0

> Stability: Experimental

Starts a server that does all interactions with the store.
Other commands will delegate any store-related tasks to this server.

Related configs:

### background

Added in: v1.30.0

* Default: **false**
* Type: **Boolean**

Runs the server in the background.

### protocol

Added in: v1.30.0

* Default: **auto**
* Type: **auto**, **tcp**, **ipc**

The communication protocol used by the server.
When **auto** is used, **ipc** used on non-Windows servers and **tcp** on Windows.

### port

Added in: v1.30.0

* Default: **5813**
* Type: **port number**

The port number to use, when TCP is used for communication.
If port is specified and **protocol** is set to auto, **tcp** protocol is used.

Other configs that are used by `pnpm server`: **store**, **lock**.

### ignore-stop-requests

Added in: v1.30.0

* Default: **false**
* Type: **Boolean**

Disallows stopping the server using `pnpm server stop`.

### ignore-upload-requests

Added in: v1.31.0

* Default: **false**
* Type: **Boolean**

Disallows creating new side effect cache during install.

## server stop

Added in: v1.30.0

> Stability: Experimental

Stops the store server.

## recursive

Added in: v1.24.0

> Stability: Experimental

```
pnpm recursive [concurrency] <install [arguments] | update [arguments]>
```

Concurrently runs install or update in all subdirectories with a `package.json` (excluding node_modules).

Usage examples:

```
pnpm recursive 10 install --ignore-scripts
pnpm recursive update
pnpm recursive update --depth 100
```

***

The rest of the commands pass through to npm.

For using the programmatic API, use pnpm's engine: [supi](https://github.com/pnpm/supi).
