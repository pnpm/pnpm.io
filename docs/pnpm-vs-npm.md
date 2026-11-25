---
id: pnpm-vs-npm
title: pnpm vs npm
---

## npm's flat tree

npm maintains a [flattened dependency tree]. This leads to less
disk space bloat, with a messy `node_modules` directory as a side effect.

On the other hand, pnpm manages `node_modules` by using hard linking and
symbolic linking to a global on-disk content-addressable store. This lets you get the benefits of far less disk space usage, while also keeping your
`node_modules` clean. There is documentation on the [store layout] if you wish
to learn more.

The good thing about pnpm's proper `node_modules` structure is that it
"[helps to avoid silly bugs]" by making it impossible to use modules that are not
specified in the project's `package.json`.

[flattened dependency tree]: https://github.com/npm/npm/issues/6912
[store layout]: symlinked-node-modules-structure
[helps to avoid silly bugs]: https://www.kochan.io/nodejs/pnpms-strictness-helps-to-avoid-silly-bugs.html

## Installation

pnpm does not allow installation of packages without saving them to
`package.json`. If no parameters are passed to `pnpm add`, packages are saved as
regular dependencies. Like with npm, `--save-dev` and `--save-optional` can be
used to install packages as dev or optional dependencies.

As a consequence of this limitation, projects won't have any extraneous packages
when they use pnpm unless they remove a dependency and leave it orphaned. That's
why pnpm's implementation of the [prune command] does not allow you to specify
packages to prune - it ALWAYS removes all extraneous and orphaned packages.

[prune command]: cli/prune

## Directory dependencies

A directory dependency points to a directory in the filesystem. pnpm handles
it according to its protocol:

* `link:` (also recorded by `pnpm add ./dir`) symlinks the directory into
  `node_modules`. pnpm does not install the directory's own dependencies.
* `file:` copies the directory into the virtual store as a package
  and installs its dependencies like any other package.

For example, if a package called `foo` (`<root>/foo`) has `bar@link:../bar` as a
dependency, pnpm does not install the dependencies of `<root>/bar` when you run
`pnpm install` on `foo`.

If you need to run installations in several packages at the same time, for
instance in the case of a monorepo, you should look at the documentation for
[`pnpm -r`].

[`pnpm -r`]: cli/recursive

## Workspaces

Pnpm deals with workspaces slightly differently than npm, starting with conflicting terminology:

Pnpm uses the term "workspace" to refer to a *collection* of packages, and sometimes the directory containing such packages. Pnpm uses the term "project" to refer to an individial package in the workspace tree (as contrasted to a package retrieved from a package repository like npm).

Npm uses the term "workspace" to refer to the individual packages being co-developed inside a monorepo. The "workspace root" is the package defining which packages are "workspaces" (in the npm sense).

In npm, there is a `package.json` file in the workspace root. The `"workspaces"` field in this file describes where to look for dependencies. Whenever a dependency matches the name of a workspace package, it resolves to the workspace package (regardless of the requested version).

In pnpm, the workspace root contains a `pnpm-workspaces.yaml` file. There may be a `package.json` in the same folder as `pnpm-workspaces.yaml`, but this is regarded as any other package. Workspace packages do not implicitly override registry packages by the same name - resolution depends on the package specifier.
