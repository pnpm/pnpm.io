---
id: hooks
title: Hooks
---

pnpm allows to step directly into the installation process via special functions called *hooks*.
Hooks can be declared in a file called `pnpmfile.js`. `pnpmfile.js` should live in the root of the project.

## tl;dr

|Option|Meaning|
|--|--|
|`hooks.readPackage(pkg, context): pkg` | Allows to mutate every dependency's `package.json` |
|`hooks.afterAllResolved(shrinkwrap, context): shrinkwrap` | Is called after resolution stage. Allows to mutate the shrinkwrap object. |

## `hooks.readPackage(pkg, context): pkg`

Allows to mutate every dependency's `package.json`.
An example of a `pnpmfile.js` that changes the dependencies field of a dependency:

```js
module.exports = {
  hooks: {
    readPackage
  }
}

// This hook will override the manifest of foo@1 after downloading it from the registry
// foo@1 will always be installed with the second version of bar
function readPackage (pkg, context) {
  if (pkg.name === 'foo' && pkg.version.startsWith('1.')) {
    pkg.dependencies = {
      bar: '^2.0.0'
    }
    context.log('bar@1 => bar@2 in dependencies of foo')
  }
  return pkg
}
```

### Arguments

* `pkg` - _Manifest_ - The manifest of the package. Either the response from the registry or the `package.json` content.
* `context.log(msg)` - _Function_ - Allows to log messages.

### Usage

#### Substitute a package with your fork

Lets' suppose you forked a package with an important fix and you want the fixed
version installed.

The following hook substitutes `resolve` with `@zkochan`'s fork.

```js
'use strict'
module.exports = {
  hooks: {
    readPackage
  }
}

function readPackage (pkg) {
  if (pkg.dependencies && pkg.dependencies.resolve) {
    pkg.dependencies.resolve = 'zkochan/node-resolve'
  }

  return pkg
}
```

#### Packages validation

You want only packages with MIT license in your `node_modules`? Check the licenses
and throw an exception if you don't like the package's license:

```js
'use strict'
module.exports = {
  hooks: {
    readPackage
  }
}

function readPackage (pkg) {
  if (pkg.license !== 'MIT') {
    throw new Error('Invalid license!')
  }

  return pkg
}
```

#### Renaming bins

You want to rename a package's bin? Just replace it:

```js
'use strict'
module.exports = {
  hooks: {
    readPackage
  }
}

function readPackage (pkg) {
  if (pkg.name === 'eslint') {
    pkg.bin = {jslint: pkg.bin}
  }

  return pkg
}
```

Now you can run `jslint fix` instead of `eslint fix`.

## `hooks.afterAllResolved(shrinkwrap, context): shrinkwrap`

Added in: v1.41.0

Is called after resolution stage. Allows to mutate the shrinkwrap object.

### Arguments

* `shrinkwrap` - _object_ - The object that is saved to `shrinkwrap.yaml`.
* `context.log(msg)` - _Function_ - Allows to log messages.

### Usage

```js
module.exports = {
  hooks: {
    afterAllResolved
  }
}

function afterAllResolved (shrinkwrap, context) {
  // ...
  return shrinkwrap
}
```
