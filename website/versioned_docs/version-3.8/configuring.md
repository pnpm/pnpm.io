---
id: version-3.8-configuring
title: Configuring
original_id: configuring
---

pnpm uses [npm's configs](https://docs.npmjs.com/misc/config). Hence, you should set configs the same way you would for npm. For example,

```
npm config set store /path/to/.pnpm-store
```

If no store is configured, then pnpm will automatically create a store on the same drive.
If configuring pnpm to work across multiple hard drives or filesystems, please read [the FAQ](faq.md#does-pnpm-work-across-multiple-hard-drives-or-filesystems).

Furthermore, pnpm uses the same configs that npm uses for doing installations. If you have a private registry and npm is configured
to work with it, pnpm should be able to authorize requests as well, with no additional configuration.

In addition to those options, pnpm also allows you to use all parameters that are flags (for example `--filter` or `--workspace-concurrency`) as option:
```
workspace-concurrency = 1
filter = @my-scope/*
```

## Configs

### store

* Default: **~/.pnpm-store**
* Type: **path**

The location where all the packages are saved on the disk.

The store should be always on the same disk on which installation is happening. So there will be one store per disk.
If there is a home directory on the current disk, then the store is created in `<home dir>/.pnpm-store`. If there is no
homedir on the disk, then the store is created in the root. For example, if installation is happening on disk `D`
then the store will be created in `D:\.pnpm-store`.

It is possible to set a store from a different disk but in that case pnpm will copy, not link, packages from the store.
Hard links are possible only inside a filesystem.

### network-concurrency

* Default: **16**
* Type: **Number**

Controls the maximum number of HTTP requests that can be done simultaneously.

### child-concurrency

* Default: **5**
* Type: **Number**

Controls the number of child processes run parallelly to build node modules.

### lock

* Default: **true**
* Type: **Boolean**

Dangerous! If false, the store is not locked. It means that several installations using the same
store can run simultaneously.

Can be passed in via a CLI option. `--no-lock` to set it to false. E.g.: `pnpm install --no-lock`.

> If you experience issues similar to the ones described in [#594](https://github.com/pnpm/pnpm/issues/594), use this option to disable locking.
> In the meanwhile, we'll try to find a solution that will make locking work for everyone.

### independent-leaves

* Default: **false**
* Type: **Boolean**

If true, symlinks leaf dependencies directly from the global store. Leaf dependencies are
packages that have no dependencies of their own. Setting this config to `true` might break some packages
that rely on location but gives an average of **8% installation speed improvement**.

### verify-store-integrity

Added in: v1.8.0

* Default: **true**
* Type: **Boolean**

If false, doesn't check whether packages in the store were mutated.

### package-import-method

Added in: v1.25.0

* Default: **auto**
* Type: **auto**, **hardlink**, **copy**, **reflink**

Controls the way packages are imported from the store.

* **auto** - try to hardlink packages from the store. If it fails, fallback to copy
* **hardlink** - hardlink packages from the store
* **copy** - copy packages from the store
* **reflink** - reflink (aka copy-on-write) packages from the store

### lockfile

Added in: v1.32.0 (initially named `shrinkwrap`)

* Default: **true**
* Type: **Boolean**

When set to `false`, pnpm won't read or generate a `pnpm-lock.yaml` file.

### prefer-frozen-lockfile

Added in: v1.37.1 (initially named `prefer-frozen-shrinkwrap`)

* Default: **true** (from v1.38.0)
* Type: **Boolean**

When `true` and the available `pnpm-lock.yaml` satisfies the `package.json`
then a headless installation is performed. A headless installation is faster than a regular one
because it skips dependencies resolution and peers resolution.

### use-running-store-server

Added in: v2.5.0

* Default: **false**
* Type: **Boolean**

Only allows installation with a store server. If no store server is running, installation will fail.

### side-effects-cache

Added in: v1.31.0

> Stability: Experimental

* Default: **false**
* Type: **Boolean**

Use and cache the results of (pre/post)install hooks.

### side-effects-cache-readonly

Added in: v1.31.0

> Stability: Experimental

* Default: **false**
* Type: **Boolean**

Only use the side effects cache if present, do not create it for new packages.

### shamefully-flatten

Added in: v1.34.0

* Default: **false**
* Type: **Boolean**

If true, pnpm creates a flat `node_modules` that look almost like a `node_modules` created by npm or Yarn.
Please only use this option when there is no other way to make a project work with pnpm.
The strict `node_modules` created by pnpm should always work, if it does not, most likely a dependency is
missing from `package.json`. Use this config only as a temporary fix.

### strict-peer-dependencies

Added in: v2.15.0

* Default: **false**
* Type: **Boolean**

If true, commands fail on missing or invalid peer dependencies.

### resolution-strategy

Added in: v3.1.0

* Default: **fast**
* Type: **fast**, **fewer-dependencies**

Sets the resolutions strategy used during installation.

* **fast** - the default resolution strategy. Speed is preferred over deduplication
* **fewer-dependencies** - already installed dependencies are preferred even if newer versions satisfy a range

### use-beta-cli

Added in: v3.6.0

* Default: **false**
* Type: **Boolean**

When `true`, beta features of the CLI are used. This means that you may get some changes to the CLI functionality
that are breaking changes.
