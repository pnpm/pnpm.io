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
