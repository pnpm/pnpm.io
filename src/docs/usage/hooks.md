# Hooks

pnpm allows to step directly into the installation process via special functions called *hooks*.
Hooks can be declared in a file called `pnpmfile.js`. `pnpmfile.js` should live in the root of the project.

An example of a `pnpmfile.js` that changes the dependencies field of a dependency:

```js
module.exports = {
  hooks: {
    readPackage
  }
}

// This hook will override the manifest of foo@1 after downloading it from the registry
// foo@1 will always be installed with the second version of bar
function readPackage (pkg) {
  if (pkg.name === 'foo' && pkg.version.startsWith('1.')) {
    pkg.dependencies = {
      bar: '^2.0.0'
    }
  }
  return pkg
}
```

## Substitute a package with your fork

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

### Tips 

If the package you want to replace is a transitive dep (dep of a dep), 
you will need to find the packages that depend on this package, 
as you will need to modify their dependency manifests.

```
$ pnpm ls metro-resolver

└─┬ react-native@0.54.2
  └─┬ metro@0.28.0
    └── metro-resolver@0.28.0
```

Notice how `metro` depends on `metro-resolver`.

Your hook function would then look like this:

```js
function readPackage(pkg) {
  if (pkg.name === 'metro') {
    Object.assign(pkg.dependencies, {
      // Use a local symlink for testing.
      'metro-resolver': 'link:~/dev/metro/packages/metro-resolver',
      // Use a npm published package after you have checked it works.
      //'metro-resolver': 'metro-resolver-patch',
    })
  }
}
```

After making changes to your `pnpmfile.js`, you may need to run 
`pnpm up --depth=100` to ensure your fork is used.

## Packages validation

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

## Renaming bins

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
