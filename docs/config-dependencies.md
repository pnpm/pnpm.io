---
id: config-dependencies
title: Config dependencies
---

Config dependencies are installed before all the other types of dependencies (before "dependencies", "devDependencies", "optionalDependencies").

Config dependencies cannot have dependencies of their own or lifecycle scripts. They should be added using exact version and the integrity checksum. Example:

```yaml title="pnpm-workspace.yaml"
configDependencies:
  my-configs: "1.0.0+sha512-30iZtAPgz+LTIYoeivqYo853f02jBYSd5uGnGpkFV0M3xOt9aN73erkgYAmZU43x4VfqcnLxW9Kpg3R5LC4YYw=="
```

## Usage

### Loading an allow list of built dependencies

You may load a list of package names that are allowed to be built via config dependencies and the [`onlyBuiltDependenciesFile`] setting. For example, you may publish a package with an `allow.json` file in its root directory:

```json
[
  "esbuild",
  "fsevents"
]
```

Let's say this package is called `my-configs`, then your project's `pnpm-workspace.yaml` will look like this:

```yaml
configDependencies:
  my-configs: "1.0.0+sha512-30iZtAPgz+LTIYoeivqYo853f02jBYSd5uGnGpkFV0M3xOt9aN73erkgYAmZU43x4VfqcnLxW9Kpg3R5LC4YYw=="
onlyBuiltDependenciesFile: "node_modules/.pnpm-config/my-configs/allow.json"
```

This way your project will load the list of packages that are allowed to be built from `my-configs`.

[`onlyBuiltDependenciesFile`]: settings.md#onlybuiltdependenciesfile

### Installing dependencies used in hooks

Config dependencies are installed before the hooks from [`.pnpmfile.cjs`] are loaded, so you can use them as dependencies for your hooks.

For instance, you may have a config dependency called "my-hooks" that exports a `readPackage` hook. In this case, you can import it into your `.pnpmfile.cjs` like this:

```js
const { readPackage } = require('.pnpm-config/my-hooks')

module.exports = {
  hooks: {
    readPackage
  }
}
```

[`.pnpmfile.cjs`]: ./pnpmfile.md

#### Loading any type of settings

Using the [`updateConfig`] hook, you can dynamically update any configuration settings used by pnpm. Because hooks can be loaded from config dependencies, you can also share settings across projects by publishing them as config dependencies.

For example, the following pnpmfile defines a hook that adds a new [catalog] entry to pnpm's configuration. This allows you to refer to the catalog entry when specifying dependency versions:

```js title="my-catalogs/pnpmfile.cjs"
module.exports = {
  hooks: {
    updateConfig (config) {
      config.catalogs.default ??= {}
      config.catalogs.default['is-odd'] = '1.0.0'
      return config
    }
  }
}
```

You can publish this pnpmfile inside a config dependency. Once published and installed, you can load it by specifying the following settings in your `pnpm-workspace.yaml`:

```yaml
configDependencies:
  my-catalogs: "1.0.0+sha512-30iZtAPgz+LTIYoeivqYo853f02jBYSd5uGnGpkFV0M3xOt9aN73erkgYAmZU43x4VfqcnLxW9Kpg3R5LC4YYw=="
pnpmfile: "node_modules/.pnpm-config/my-catalogs/pnpmfile.cjs"
```

Now, you can run:

```
pnpm add is-odd@catalog:
```

This will install `is-odd@1.0.0` into your `node_modules`, and add the following entry to your `package.json`:

```json
{
  "dependencies": {
    "is-odd": "catalog:"
  }
}
```

This makes it easy to maintain and share centralized configuration and dependency versions across projects.

[updateConfig]: ./pnpmfile.md#hooksupdateconfigconfig-config--promiseconfig
[catalog]: ./catalogs.md

### Loading patches

You can reference [patch files] installed via config dependencies. For instance, if you have a config dependency called "my-patches", you can load patches from it:

```yaml
configDependencies:
  my-patches: "1.0.0+sha512-30iZtAPgz+LTIYoeivqYo853f02jBYSd5uGnGpkFV0M3xOt9aN73erkgYAmZU43x4VfqcnLxW9Kpg3R5LC4YYw=="
patchedDependencies:
  react: "node_modules/.pnpm-config/my-patches/react.patch"
```

[patch files]: ./cli/patch.md
