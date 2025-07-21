---
id: only-allow-pnpm
title: Only Allow PNPM
---

When many developers are working on the same project together, you need a failsafe in case someone accidentally runs commands with another package manager (like NPM, Yarn, Bun).

To prevent dependency management conflicts between package managers:

1. Create a file, if it doesn't already exist, named `.npmrc` at the root of your project.
2. Write the following content into your `.npmrc`:

```
engine-strict=true
```

3. Write the following content into your `package.json`:

```
{
  "devEngines": {
    "runtime": {
      "name": "node",
      "onFail": "error"
    },
    "packageManager": {
      "name": "pnpm",
      "onFail": "error"
    }
  },
  "engines": {
    "node": ">=18.18.0",
    "pnpm": ">=10.0.0"
  },
}
```

- Now, when you run `npm i`, `npm i -D` (or an equivalent), these commands return this error (before the preinstall script can run):

```
username@hostname some-project % npm i -D package
npm error code EBADDEVENGINES
npm error EBADDEVENGINES The developer of this package has specified the following through devEngines
npm error EBADDEVENGINES Invalid engine "packageManager"
npm error EBADDEVENGINES Invalid name "pnpm" does not match "npm" for "packageManager"
npm error EBADDEVENGINES {
npm error EBADDEVENGINES   current: { name: 'npm', version: '10.0.0' },
npm error EBADDEVENGINES   required: { name: 'pnpm', onFail: 'error' }
npm error EBADDEVENGINES }
npm error A complete log of this run can be found in: /Users/username/.npm/_logs/2021-08-21T00_00_00_000Z-debug-0.log
```
