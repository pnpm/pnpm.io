---
id: quick-start
title: Quick start
---

## Start the server

Run `pnpr` with the bundled default config:

```sh
pnpr
```

It listens on `127.0.0.1:4873` and proxies `https://registry.npmjs.org/` by
default.

## Point a client at it

Configure pnpm (or npm/yarn) to use the local server as its registry:

```sh
pnpm config set registry http://127.0.0.1:4873/
```

Now `pnpm install` fetches packages through pnpr. Packages proxied from the
upstream are cached, so subsequent installs are served locally.

## Publish a package

By default the bundled config requires authentication to publish. Create a user
and publish:

```sh
pnpm login --registry http://127.0.0.1:4873/
pnpm publish --registry http://127.0.0.1:4873/
```

## Where to go next

- [CLI reference](cli.md) — every flag `pnpr` accepts.
- [Configuration](configuration.md) — write your own config: uplinks, access
  rules, and auth.
- [Install acceleration](install-acceleration.md) — let pnpr resolve your
  dependency graph to speed up installs.
