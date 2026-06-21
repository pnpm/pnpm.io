---
id: install-acceleration
title: Install acceleration
---

Besides acting as a registry, pnpr can speed up `pnpm install` by resolving a
project's dependency graph **server-side** and handing pnpm a ready-to-use
lockfile. pnpm then runs a normal headless install, fetching every tarball
directly from the registries in parallel.

## How it works

1. pnpm sends `POST /v1/install` to the pnpr server with the project's
   dependencies (and the existing lockfile, if any, for incremental
   resolution).
2. The server resolves against the client's registries, verifies the input
   lockfile under the client's policy, and answers with one gzipped JSON object
   carrying the resolved lockfile and stats.
3. pnpm uses the resolved lockfile for its headless install, fetching tarballs
   directly from the registries — like a normal install.

pnpr acts as a stateless resolver here: it stores no tarballs and serves no file
content. See [pnpm/pnpm#12230](https://github.com/pnpm/pnpm/issues/12230) for
background.

## Enabling it

Set `pnprServer` in your `pnpm-workspace.yaml` to the URL of a pnpr server:

```yaml
pnprServer: http://localhost:4000
```

pnpm will offload resolution to that server during `pnpm install`.

## Using the client programmatically

The [`@pnpm/pnpr.client`](https://www.npmjs.com/package/@pnpm/pnpr.client)
package is used internally by pnpm, but can be called directly:

```typescript
import { fetchFromPnpmRegistry } from '@pnpm/pnpr.client'

const { lockfile, stats } = await fetchFromPnpmRegistry({
  registryUrl: 'http://localhost:4000',
  dependencies: { react: '^19.0.0' },
  devDependencies: { typescript: '^5.0.0' },
})

console.log(`Resolved ${stats.totalPackages} packages`)
// lockfile is ready for headless install
```
