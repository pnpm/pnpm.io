---
id: quick-start
title: Quick start
---

## Write a config

pnpr routes packages through [registry mounts](configuration.md#mounts-and-defaulttarget):
every origin — a locally-hosted registry, an upstream like npmjs — is declared
explicitly, and a router maps package names to exactly one of them. Save this
as `pnpr.yaml`:

```yaml
storage: ./storage

auth:
  htpasswd:
    file: ./htpasswd
    # Allow one user to self-register, for the publish step below.
    max_users: 1

mounts:
  # Packages published to this server.
  local:
    type: hosted

  # The public npm registry.
  npmjs:
    type: upstream
    url: https://registry.npmjs.org/
    public: true

  # Route your scope to the local registry, everything else to npm.
  main:
    type: router
    routes:
      - patterns: ['@mycompany/*']
        source: local
      - patterns: ['**']
        source: npmjs

# The bare server URL serves the router.
defaultTarget: main
```

Replace `@mycompany` with your own scope. There is no fall-through between
mounts: a `@mycompany/*` package that isn't published locally is a definitive
404, never a request to npmjs — which is exactly what closes dependency
confusion.

## Start the server

```sh
pnpr -c ./pnpr.yaml
```

It listens on `127.0.0.1:7677`. (Running plain `pnpr` with no config works
too, but the bundled default config is shaped for pnpm's own test registry —
for anything real, pass your own config.)

## Point a client at it

Configure pnpm (or npm/yarn) to use the local server as its registry:

```sh
pnpm config set registry http://127.0.0.1:7677/
```

Now `pnpm install` fetches packages through pnpr. Packages proxied from the
upstream are cached, so subsequent installs are served locally.

Each mount is also directly addressable as a registry at
`http://127.0.0.1:7677/~<mount>/` — for example, you can point just your scope
at the hosted mount instead of using the router.

## Publish a package

Create a user and publish:

```sh
pnpm login --registry http://127.0.0.1:7677/
pnpm publish --registry http://127.0.0.1:7677/
```

The publish routes through the router to the `local` hosted mount — publishing
a package that routes to an upstream mount is rejected.

## Where to go next

- [CLI reference](cli.md) — every flag `pnpr` accepts.
- [Configuration](configuration.md) — write your own config: mounts, access
  rules, and auth.
- [Install acceleration](install-acceleration.md) — let pnpr resolve your
  dependency graph to speed up installs.
