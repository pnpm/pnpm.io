---
id: package_json
title: package.json
---

The manifest file of a package. It contains all the package's metadata,
including dependencies, title, author, et cetera. This is a standard preserved
across all major Node.js package managers, including pnpm.

## engines

You can specify the version of Node and pnpm that your software works on:

If you find that your use of a certain package doesn’t require one of its dependencies, you may use `-` to remove it. For example, if package `foo@1.0.0` requires a large package named `bar` for a function that you don’t use, removing it could reduce install time:

```json
{
  "pnpm": {
    "overrides": {
      "foo@1.0.0>bar": "-"
    }
  }
}
```

This feature is especially useful with `optionalDependencies`, where most optional packages can be safely skipped.

## pnpm.packageExtensions

The `packageExtensions` fields offer a way to extend the existing package definitions with additional information. For example, if `react-redux` should have `react-dom` in its `peerDependencies` but it has not, it is possible to patch `react-redux` using `packageExtensions`:

```json
{
  "pnpm": {
    "packageExtensions": {
      "react-redux": {
        "peerDependencies": {
          "react-dom": "*"
        }
      }
    }
  }
}
```

The keys in `packageExtensions` are package names or package names and semver ranges, so it is possible to patch only some versions of a package:

```json
{
  "pnpm": {
    "packageExtensions": {
      "react-redux@1": {
        "peerDependencies": {
          "react-dom": "*"
        }
      }
    }
  }
}
```

The following fields may be extended using `packageExtensions`: `dependencies`, `optionalDependencies`, `peerDependencies`, and `peerDependenciesMeta`.

A bigger example:

```json
{
  "pnpm": {
    "packageExtensions": {
      "express@1": {
        "optionalDependencies": {
          "typescript": "2"
        }
      },
      "fork-ts-checker-webpack-plugin": {
        "dependencies": {
          "@babel/core": "1"
        },
        "peerDependencies": {
          "eslint": ">= 6"
        },
        "peerDependenciesMeta": {
          "eslint": {
            "optional": true
          }
        }
      }
    }
  }
}
```

:::tip

Together with Yarn, we maintain a database of `packageExtensions` to patch broken packages in the ecosystem.
If you use `packageExtensions`, consider sending a PR upstream and contributing your extension to the [`@yarnpkg/extensions`] database.

:::

[`@yarnpkg/extensions`]: https://github.com/yarnpkg/berry/blob/master/packages/yarnpkg-extensions/sources/index.ts

## pnpm.peerDependencyRules

### pnpm.peerDependencyRules.ignoreMissing

pnpm will not print warnings about missing peer dependencies from this list.

For instance, with the following configuration, pnpm will not print warnings if a dependency needs `react` but `react` is not installed:

```json
{
  "pnpm": {
    "peerDependencyRules": {
      "ignoreMissing": ["react"]
    }
  }
}
```

Package name patterns may also be used:

```json
{
  "pnpm": {
    "peerDependencyRules": {
      "ignoreMissing": ["@babel/*", "@eslint/*"]
    }
  }
}
```

### pnpm.peerDependencyRules.allowedVersions

Unmet peer dependency warnings will not be printed for peer dependencies of the specified range.

For instance, if you have some dependencies that need `react@16` but you know that they work fine with `react@17`, then you may use the following configuration:

```json
{
  "pnpm": {
    "peerDependencyRules": {
      "allowedVersions": {
        "react": "17"
      }
    }
  }
}
```

This will tell pnpm that any dependency that has react in its peer dependencies should allow `react` v17 to be installed.

It is also possible to suppress the warnings only for peer dependencies of specific packages. For instance, with the following configuration `react` v17 will be only allowed when it is in the peer dependencies of the `button` v2 package or in the dependencies of any `card` package:

```json
{
  "pnpm": {
    "peerDependencyRules": {
      "allowedVersions": {
        "button@2>react": "17",
        "card>react": "17"
      }
    }
  }
}
```

### pnpm.peerDependencyRules.allowAny

`allowAny` is an array of package name patterns, any peer dependency matching the pattern will be resolved from any version, regardless of the range specified in `peerDependencies`. For instance:

```json
{
  "pnpm": {
    "peerDependencyRules": {
      "allowAny": ["@babel/*", "eslint"]
    }
  }
}
```

The above setting will mute any warnings about peer dependency version mismatches related to `@babel/` packages or `eslint`.

## pnpm.neverBuiltDependencies

This field allows to ignore the builds of specific dependencies.
The "preinstall", "install", and "postinstall" scripts of the listed packages will not be executed during installation.

An example of the `"pnpm"."neverBuiltDependencies"` field:

```json
{
  "pnpm": {
    "neverBuiltDependencies": ["fsevents", "level"]
  }
}
```

## pnpm.onlyBuiltDependencies

A list of package names that are allowed to be executed during installation. If this field exists, only the listed packages will be able to run install scripts.

Example:

```json
{
  "pnpm": {
    "onlyBuiltDependencies": ["fsevents"]
  }
}
```

## pnpm.onlyBuiltDependenciesFile

This configuration option allows users to specify a JSON file that lists the only packages permitted to run installation scripts during the pnpm install process. By using this, you can enhance security or ensure that only specific dependencies execute scripts during installation.

Example:

```json
{
  "dependencies": {
    "@my-org/policy": "1.0.0"
  },
  "pnpm": {
    "onlyBuiltDependenciesFile": "node_modules/@my-org/policy/onlyBuiltDependencies.json"
  }
}
```

The JSON file itself should contain an array of package names:

```json title="node_modules/@my-org/policy/onlyBuiltDependencies.json"
[
  "fsevents"
]
```

## pnpm.allowedDeprecatedVersions

This setting allows muting deprecation warnings of specific packages.

Example:

```json
{
  "pnpm": {
    "allowedDeprecatedVersions": {
      "express": "1",
      "request": "*"
    }
  }
}
```

With the above configuration pnpm will not print deprecation warnings about any version of `request` and about v1 of `express`.

## pnpm.patchedDependencies

This field is added/updated automatically when you run [pnpm patch-commit]. It is a dictionary where the key should be the package name and exact version. The value should be a relative path to a patch file.

Example:

```json
{
  "pnpm": {
    "patchedDependencies": {
      "express@4.18.1": "patches/express@4.18.1.patch"
    }
  }
}
```

## pnpm.allowNonAppliedPatches

When `true`, installation won't fail if some of the patches from the `patchedDependencies` field were not applied.

```json
{
  "pnpm": {
    "patchedDependencies": {
      "express@4.18.1": "patches/express@4.18.1.patch"
    },
    "allowNonAppliedPatches": true
}
```

## pnpm.updateConfig

### pnpm.updateConfig.ignoreDependencies

Sometimes you can't update a dependency. For instance, the latest version of the dependency started to use ESM but your project is not yet in ESM. Annoyingly, such a package will be always printed out by the `pnpm outdated` command and updated, when running `pnpm update --latest`. However, you may list packages that you don't want to upgrade in the `ignoreDependencies` field:

```json
{
  "pnpm": {
    "updateConfig": {
      "ignoreDependencies": ["load-json-file"]
    }
  }
}
```

Patterns are also supported, so you may ignore any packages from a scope: `@babel/*`.

## pnpm.auditConfig

### pnpm.auditConfig.ignoreCves

A list of CVE IDs that will be ignored by the [`pnpm audit`] command.

```json
{
  "pnpm": {
    "auditConfig": {
      "ignoreCves": [
        "CVE-2022-36313"
      ]
    }
  }
}
```

[`pnpm audit`]: ./cli/audit.md

### pnpm.auditConfig.ignoreGhsas

A list of GHSA Codes that will be ignored by the [`pnpm audit`] command.

```json
{
  "pnpm": {
    "auditConfig": {
      "ignoreGhsas": [
        "GHSA-42xw-2xvc-qx8m",
        "GHSA-4w2v-q235-vp99",
        "GHSA-cph5-m8f7-6c5x",
        "GHSA-vh95-rmgr-6w4m"
      ]
    }
  }
}
```

[`pnpm audit`]: ./cli/audit.md

## pnpm.requiredScripts

Scripts listed in this array will be required in each project of the workspace. Otherwise, `pnpm -r run <script name>` will fail.

```
{
  "pnpm": {
    "requiredScripts": ["build"]
  }
}
```

## pnpm.supportedArchitectures

You can specify architectures for which you'd like to install optional dependencies, even if they don't match the architecture of the system running the install.

For example, the following configuration tells to install optional dependencies for Windows x64:

```json
{
  "pnpm": {
    "supportedArchitectures": {
      "os": ["win32"],
      "cpu": ["x64"]
    }
  }
}
```

Whereas this configuration will install optional dependencies for Windows, macOS, and the architecture of the system currently running the install. It includes artifacts for both x64 and arm64 CPUs:

```json
{
  "pnpm": {
    "supportedArchitectures": {
      "os": ["win32", "darwin", "current"],
      "cpu": ["x64", "arm64"]
    }
  }
}
```

Additionally, `supportedArchitectures` also supports specifying the `libc` of the system.

## pnpm.ignoredOptionalDependencies

If an optional dependency has its name included in this array, it will be skipped. For example:

```json
{
  "pnpm": {
    "ignoredOptionalDependencies": ["fsevents", "@esbuild/*"]
  }
}
```

## pnpm.executionEnv.nodeVersion

Specifies which exact Node.js version should be used for the project's runtime.
pnpm will automatically install the specified version of Node.js and use it for
running `pnpm run` commands or the `pnpm node` command.

For example:

```json
{
  "pnpm": {
    "executionEnv": {
      "nodeVersion": "16.16.0"
    }
  }
}
```

## resolutions

Functionally identical to [`pnpm.overrides`], this field is intended to make it easier to migrate from Yarn.

`resolutions` and `pnpm.overrides` get merged before package resolution (with `pnpm.overrides` taking precedence), which can be useful when you're migrating from Yarn and need to tweak a few packages just for pnpm.

[pnpm patch-commit]: ./cli/patch-commit.md
[`pnpm.overrides`]: #pnpmoverrides
