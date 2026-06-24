---
id: quick-start
title: Quick start
---

## Start the server

Run `pnpr` with the bundled default config:

```sh
pnpr
```

It listens on `127.0.0.1:7677` and proxies `https://registry.npmjs.org/` by
default.

## Point a client at it

Configure pnpm (or npm/yarn) to use the local server as its registry:

```sh
pnpm config set registry http://127.0.0.1:7677/
```

Now `pnpm install` fetches packages through pnpr. Packages proxied from the
upstream are cached, so subsequent installs are served locally.

## Publish a package

The bundled config requires authentication to publish and disables self-service
registration. To try publishing locally, run pnpr with a config that opts into
registration:

```yaml
storage: ./storage

auth:
  htpasswd:
    file: ./htpasswd
    max_users: 1

uplinks:
  npmjs:
    url: https://registry.npmjs.org/

packages:
  '**':
    access: $all
    publish: $authenticated
    unpublish: $authenticated
    proxy: npmjs
```

Start pnpr with that file, then create a user and publish:

```sh
pnpr -c ./pnpr.yaml
pnpm login --registry http://127.0.0.1:7677/
pnpm publish --registry http://127.0.0.1:7677/
```

## Where to go next

- [CLI reference](cli.md) — every flag `pnpr` accepts.
- [Configuration](configuration.md) — write your own config: uplinks, access
  rules, and auth.
- [Install acceleration](install-acceleration.md) — let pnpr resolve your
  dependency graph to speed up installs.
