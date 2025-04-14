---
id: pnpmfile
title: .pnpmfile.cjs
---

pnpm lets you hook directly into the installation process via special functions
(hooks). Hooks can be declared in a file called `.pnpmfile.cjs`.

By default, `.pnpmfile.cjs` should be located in the same directory as the
lockfile. For instance, in a [workspace](workspaces.md) with a shared lockfile,
`.pnpmfile.cjs` should be in the root of the monorepo.

## Hooks

### TL;DR

| Hook Function                                         | Process                                                     | Uses                                                      |
|-------------------------------------------------------|-------------------------------------------------------------|-----------------------------------------------------------|
| `hooks.afterAllResolved(lockfile, context): lockfile` | Called after the dependencies have been resolved.           | Mutate the lockfile.                                      |
| `hooks.readPackage(pkg, context): pkg`                | Called after pnpm parses the dependency's package manifest. | Mutate a dependency's `package.json`                      |
| `hooks.filterLog(log): boolean`                       | Called before a log is printed.                             | Filter logs by level and/or message content.              |
| `hooks.fetchers[*](opts): fetcher`                    | Called to construct package fetcher.                        | Fully customize how packages are brought into the store.  |
| `hooks.importPackage(to, opts): string?`              | Called to import a package into `node_modules`.             | Fully customize how packages are imported from the store. |
| `hooks.preResolution(context, logger): void`          | Called before dependencies have been resolved.              | Run code before dependency resolution starts.             |

### `hooks.readPackage(pkg, context): pkg | Promise<pkg>` (global then local)

Allows you to mutate a dependency's `package.json` after parsing and prior to
resolution. These mutations are not saved to the filesystem, however, they will
affect what gets resolved in the lockfile and therefore what gets installed.

Note that you will need to delete the `pnpm-lock.yaml` if you have already
resolved the dependency you want to modify.

:::tip

If you need changes to `package.json` saved to the filesystem, you need to use the [`pnpm patch`] command and patch the `package.json` file.
This might be useful if you want to remove the `bin` field of a dependency for instance.

:::

#### Arguments

* `pkg` - The manifest of the package. Either the response from the registry or
the `package.json` content.
* `context` - Context object for the step. Method `#log(msg)` allows you to use
a debug log for the step.

#### Usage example

Example `.pnpmfile.cjs` (changes the dependencies of a dependency):

```js title=".pnpmfile.cjs"
function readPackage(pkg, context) {
  // Override the manifest of foo@1.x after downloading it from the registry
  if (pkg.name === 'foo' && pkg.version.startsWith('1.')) {
    // Replace bar@x.x.x with bar@2.0.0
    pkg.dependencies = {
      ...pkg.dependencies,
      bar: '^2.0.0'
    }
    context.log('bar@1 => bar@2 in dependencies of foo')
  }
  
  // This will change any packages using baz@x.x.x to use baz@1.2.3
  if (pkg.dependencies.baz) {
    pkg.dependencies.baz = '1.2.3';
  }
  
  return pkg
}

module.exports = {
  hooks: {
    readPackage
  }
}
```

#### Known limitations

Removing the `scripts` field from a dependency's manifest via `readPackage` will
not prevent pnpm from building the dependency. When building a dependency, pnpm
reads the `package.json` of the package from the package's archive, which is not
affected by the hook. In order to ignore a package's build, use the
[neverBuiltDependencies](settings.md#neverbuiltdependencies) field.

### `hooks.updateConfig(config): config | Promise<config>`

Added in: v10.8.0

Allows you to modify the configuration settings used by pnpm. This hook is most useful when paired with [configDependencies](config-dependencies), allowing you to share and reuse settings across different Git repositories.

For example, [@pnpm/better-defaults](https://github.com/pnpm/better-defaults) uses the `updateConfig` hook to apply a curated set of recommended settings.

#### Usage example

```js title=".pnpmfile.cjs"
module.exports = {
  hooks: {
    updateConfig (config) {
      return Object.assign(config, {
        enablePrePostScripts: false,
        optimisticRepeatInstall: true,
        resolutionMode: 'lowest-direct',
        verifyDepsBeforeRun: 'install',
      })
    }
  }
}
```

### `hooks.afterAllResolved(lockfile, context): lockfile | Promise<lockfile>` (global then local)

Allows you to mutate the lockfile output before it is serialized.

#### Arguments

* `lockfile` - The lockfile resolutions object that is serialized to
`pnpm-lock.yaml`.
* `context` - Context object for the step. Method `#log(msg)` allows you to use
a debug log for the step.

#### Usage example

```js title=".pnpmfile.cjs"
function afterAllResolved(lockfile, context) {
  // ...
  return lockfile
}

module.exports = {
  hooks: {
    afterAllResolved
  }
}
```

#### Known Limitations

There are none - anything that can be done with the lockfile can be modified via
this function, and you can even extend the lockfile's functionality.

### `hooks.filterLog(log): boolean` (global then local)

Allows you to granularly filter console logging.

#### Arguments

* `log` - The log data object with properties such as;
  * `name`
  * `level`
  * `prefix`
  * `message`

#### Usage example

```js title=".pnpmfile.cjs"
function filterLog(log) {
  return log.message?.includes('common-error') ?? false;
}

module.exports = {
  hooks: {
    filterLog
  }
}
```

### `hooks.fetchers[*](opts): fetcher` (global)

Allows you to completely customize how packages are fetched.

#### Types

* `localTarball`
* `remoteTarball`
* `gitHostedTarball`
* `directory`
* `git`

#### Arguments

* `opts` - Options object passed to the fetcher factory.
  * `defaultFetchers` - Object containing all default fetcher implementations.

#### Usage example

```js title="~/.pnpm/global_pnpmfile.cjs"
const fetchers = {
  directory({ defaultFetchers }) {
    // Wrapping the default fetcher with custom logic
    return (cafs, resolution, opts) => {
      // ...
      return defaultFetchers.directory(cafs, resolution, opts)
    }
  }
}

module.exports = {
  hooks: {
    fetchers
  }
}
```

### `hooks.importPackage(to, opts): string|undefined|Promise<string|undefined>` (global)

Allows you to completely customize how packages are imported into `node_modules` from the store.

This overrides the `package-import-method` configuration.

#### Arguments

* `to` - The absolute path where the package should be imported to.
* `opts` - Options object specifying what to import and some some related configuration.
  * `disableRelinkLocalDirDeps`
  * `filesMap`
  * `force`
  * `resolvedFrom`
  * `keepModulesDir`

#### Example usage

```js title="~/.pnpm/global_pnpmfile.cjs"
const path = require('node:path')
const fs = require('node:fs')

// Naive copy implementation
function importPackage(to, opts) {
  const pkgJsonPath = path.join(to, 'package.json')

  if (opts.resolvedFrom !== 'store' || opts.force || !fs.existsSync(pkgJsonPath)) {
    for (const [f, src] of Object.entries(opts.filesMap)) {
      const dest = path.join(to, f)
      fs.mkdirSync(path.join(dest, '..'), { recursive: true })
      fs.copyFileSync(src, dest)
    }
    return 'naive-copy'
  }
  return undefined
}

module.exports = {
  hooks: {
    importPackage
  }
}
```

### `hooks.preResolution(context, logger): void | Promise<void>` (global)

Allows you to run code before dependency resolution starts.

#### Arguments

* `context` - Object containing various pre-resolution values.
  * `wantedLockfile` - `pnpm-lock.yaml` with conflicts and related issues resolved.
  * `currentLockfile` - `node_modules/.pnpm/lock.yaml` or a generated fallback.
  * `existsWantedLockfile` - Whether `pnpm-lock.yaml` exists.
  * `existsCurrentLockfile` - Whether `node_modules/.pnpm/lock.yaml` exists.
  * `lockfileDir` - Directory containing wanted lockfile.
  * `storeDir` - Store directory, e.g. `~/.local/share/pnpm/store/v3`.
  * `registries` - Object containing the default and scoped registries.
* `logger` - Logger object with `info` and `warn` logging methods.

#### Example usage

```js title="~/.pnpm/global_pnpmfile.cjs"
function preResolution(context, logger) {
  logger.info(`Registries: ${Object.values(context.registries).join(', ')}`)
}

module.exports = {
  hooks: {
    preResolution
  }
}
```

## Related Configuration

### ignore-pnpmfile

* Default: **false**
* Type: **Boolean**

`.pnpmfile.cjs` will be ignored. Useful together with `--ignore-scripts` when you
want to make sure that no script gets executed during install.

### pnpmfile

* Default: **.pnpmfile.cjs**
* Type: **path**
* Example: **.pnpm/.pnpmfile.cjs**

The location of the local pnpmfile.

### global-pnpmfile

* Default: **null**
* Type: **path**
* Example: **~/.pnpm/global_pnpmfile.cjs**

The location of a global pnpmfile. A global pnpmfile is used by all projects
during installation.

:::note

It is recommended to use local pnpmfiles. Only use a global pnpmfile
if you use pnpm on projects that don't use pnpm as the primary package manager.

:::

[`pnpm patch`]: ./cli/patch.md
