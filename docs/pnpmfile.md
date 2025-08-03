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

| Hook Function                                         | Process                                                    | Uses                                               |
|-------------------------------------------------------|------------------------------------------------------------|----------------------------------------------------|
| `hooks.readPackage(pkg, context): pkg`                | Called after pnpm parses the dependency's package manifest | Allows you to mutate a dependency's `package.json` |
| `hooks.afterAllResolved(lockfile, context): lockfile` | Called after the dependencies have been resolved.          | Allows you to mutate the lockfile.                 |

### `hooks.readPackage(pkg, context): pkg | Promise<pkg>`

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

#### Usage

Example `.pnpmfile.cjs` (changes the dependencies of a dependency):

```js
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

For example, [@pnpm/plugin-better-defaults](https://github.com/pnpm/plugin-better-defaults) uses the `updateConfig` hook to apply a curated set of recommended settings.

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

### `hooks.afterAllResolved(lockfile, context): lockfile | Promise<lockfile>`

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

### `hooks.preResolution(options): Promise<void>`

This hook is executed after reading and parsing the lockfiles of the project, but before resolving dependencies. It allows modifications to the lockfile objects.

#### Arguments

* `options.existsCurrentLockfile` - A boolean that is true if the lockfile at `node_modules/.pnpm/lock.yaml` exists.
* `options.currentLockfile` - The lockfile object from `node_modules/.pnpm/lock.yaml`.
* `options.existsNonEmptyWantedLockfile` - A boolean that is true if the lockfile at `pnpm-lock.yaml` exists.
* `options.wantedLockfile` - The lockfile object from `pnpm-lock.yaml`.
* `options.lockfileDir` - The directory where the wanted lockfile is found.
* `options.storeDir` - The location of the store directory.
* `options.registries` - A map of scopes to registry URLs.

### `hooks.importPackage(destinationDir, options): Promise<string | undefined>`

This hook allows to change how packages are written to `node_modules`. The return value is optional and states what method was used for importing the dependency, e.g.: clone, hardlink.

#### Arguments

* `destinationDir` - The destination directory where the package should be written.
* `options.disableRelinkLocalDirDeps`
* `options.filesMap`
* `options.force`
* `options.resolvedFrom`
* `options.keepModulesDir`

### `hooks.fetchers`

This hook allows to override the fetchers that are used for different types of dependencies. It is an object that may have the following fields:

* `localTarball`
* `remoteTarball`
* `gitHostedTarball`
* `directory`
* `git`

## Related Configuration

import IgnorePnpmfile from './settings/_ignorePnpmfile.mdx'

<IgnorePnpmfile />

import Pnpmfile from './settings/_pnpmfile.mdx'

<Pnpmfile />

import GlobalPnpmfile from './settings/_globalPnpmfile.mdx'

<GlobalPnpmfile />

[`pnpm patch`]: ./cli/patch.md
