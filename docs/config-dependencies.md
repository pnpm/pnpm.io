---
id: config-dependencies
title: Configurational dependencies
---

Configurational dependencies are installed before all the other types of dependencies (before "dependencies", "devDependencies", "optionalDependencies").

Configurational dependencies cannot have dependencies of their own or lifecycle scripts. They should be added using exact version and the integrity checksum. Example:

```json
{
  "pnpm": {
    "configDependencies": {
      "my-configs": "1.0.0+sha512-30iZtAPgz+LTIYoeivqYo853f02jBYSd5uGnGpkFV0M3xOt9aN73erkgYAmZU43x4VfqcnLxW9Kpg3R5LC4YYw=="
    }
  }
}
```

## Usage

### Loading an allow list of built dependencies

You may load a list of package names that are allowed to be built via configurational dependencies and the [`pnpm.onlyBuiltDependenciesFile`] setting. For example, you may publish a package with an `allow.json` file in its root directory:

```json
[
  "esbuild",
  "fsevents"
]
```

Let's say this package is called `my-configs`, then your project's `package.json` will look like this:

```json
{
  "pnpm": {
    "configDependencies": {
      "my-configs": "1.0.0+sha512-30iZtAPgz+LTIYoeivqYo853f02jBYSd5uGnGpkFV0M3xOt9aN73erkgYAmZU43x4VfqcnLxW9Kpg3R5LC4YYw=="
    },
    "onlyBuiltDependenciesFile": "node_modules/.pnpm-config/my-configs/allow.json"
  }
}
```

This way your project will load the list of packages that are allowed to be built from `my-configs`.

[`pnpm.onlyBuiltDependenciesFile`]: package_json.md#pnpmonlybuiltdependenciesfile
