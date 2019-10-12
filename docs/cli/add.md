---
id: add
title: pnpm add <pkg>
---

Installs a package and any packages that it depends on.
By default, any new package is installed as a prod dependency.

![](/img/demos/pnpm-install-package.svg)

## tl;dr

|Command|Meaning|
|--|--|
|`pnpm add sax`                          |save to `dependencies`              |
|`pnpm add -D sax`                       |save to `devDependencies`           |
|`pnpm add -O sax`                       |save to `optionalDependencies`      |
|`pnpm add sax@next`                     |Specify tag `next`                  |
|`pnpm add sax@3.0.0`                    |Specify version `3.0.0`             |

## Supported package locations

A package can be installed from different locations:

### Install from npm registry

`pnpm add package-name` will install the latest version
of `package-name` from the [npm registry](https://www.npmjs.com/).

You may also install packages by:

* tag: `pnpm add express@nightly`
* version: `pnpm add express@1.0.0`
* version range: `pnpm add express@2 react@">=0.1.0 <0.2.0"`

### Install from local file system

There are two ways to install from the local file system:

1. from a tarball file (`.tar`, `.tar.gz`, or `.tgz`)
2. from a directory

Examples:

```sh
pnpm add ./package.tgz
pnpm add ./some-directory
```

When you install from a directory, a symlink will be created in the
current project's `node_modules`, so it is the same as running
`pnpm link`.

### Install from remote gzipped tarball

The argument must start with "http://" or "https://".

Example:

```sh
pnpm add https://github.com/indexzero/forever/tarball/v0.5.6
```

### Install from Git repository

```sh
pnpm add <git remote url>
```

Installs the package from the hosted Git provider, cloning it with Git.

You may install from Git by:

* latest commit from master: `pnpm add kevva/is-positive`
* commit: `pnpm add kevva/is-positive#97edff6f525f192a3f83cea1944765f769ae2678`
* branch: `pnpm add kevva/is-positive#master`
* version range: `pnpm add kevva/is-positive#semver:^2.0.0`

## Options

### --save-prod, -P

This will install one or more packages in your `dependencies`.

### --save-dev, -D

Using `--save-dev` or `-D` will install one or more packages in your `devDependencies`.

### --save-optional, -O

Using `--save-optional` or `-O` will install one or more packages in your `optionalDependencies`.

### --save-exact, -E

Saved dependencies will be configured with an exact version rather than using pnpm's default semver range operator.

### --save-peer

Added in: v3.2.0

Using `--save-peer` will add one or more packages to `peerDependencies` and install them as dev dependencies.

### --ignore-workspace-root-check, -W

Added in: v3.6.0

Adding a new dependency to the root workspace package fails, unless the `--ignore-workspace-root-check` or `-W` flag is used.
For instance, `pnpm add debug -W`.

### --global

Install a package globally.

### --filter &lt;package_selector>

[Read more about filtering.](../filtering)
