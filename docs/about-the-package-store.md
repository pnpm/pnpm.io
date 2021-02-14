---
id: about-package-store
title: About the package store
---

A store is a folder that contains packages and information about projects that
are using them. The store does not include the `node_modules` folder of any of
the packages, unless the package has [bundled dependencies].

The store is immutable. Execution of modules from the store cannot remove/add
files in the store, because modules are executed in the context of the projects
they are linked into. However, the outer `node_modules` which contains the store
is not locked.

[bundled dependencies]: https://docs.npmjs.com/files/package.json#bundleddependencies

## Store directory structure

The path to a package in the store is the package's ID.

### Packages from npm-compatible registries

`<package name>@<package version>`

Exempli gratia:
```text
gulp@2.1.0
@cycle/dom@14.1.0
@wmhilton/log@1.1.0
```

### Packages from Git

`<Repository host domain>/<Git path>@<commit hash>`

Eexempli gratia:
`github.com/alexGugel/ied@b246270b53e43f1dc469df0c9b9ce19bb881e932`

## `store.json`

A file in the root of store that contains information about projects depending
on specific packages from the store.

```json
{
  "npm@3.10.2": [
    "/home/john_smith/src/ied"
  ],
  "arr-flatten@1.0.1": [
    "/home/john_smith/src/ied",
    "/home/john_smith/src/new_project",
    "/home/betsy_smith/src/abc"
  ]
}
```
