---
id: configuration
title: Configuration
---

pnpr uses a [verdaccio](https://verdaccio.org/docs/configuration)-shaped YAML
config. When you don't pass `-c`, pnpr looks for a global `config.yaml` in its
config directory and otherwise falls back to a bundled default.

A minimal config:

```yaml
storage: ./storage

uplinks:
  npmjs:
    url: https://registry.npmjs.org/

packages:
  '@*/*':
    access: $all
    publish: $authenticated
    proxy: npmjs

  '**':
    access: $all
    publish: $authenticated
    proxy: npmjs
```

Pass it with `-c`:

```sh
pnpr -c ./pnpr.yaml
```

## `storage` and `cache`

pnpr keeps two kinds of data:

- **`storage`** — the source of truth: packages published to this server plus
  anything served in static mode. Back this up and keep it on a durable volume.
- **`cache`** — the disposable mirror of upstream registries plus the resolver
  cache. Safe to wipe at any time. Defaults to a `.pnpr-cache` subdirectory of
  `storage`; point it at a separate, ephemeral volume to keep cached upstream
  content off the durable disk.

```yaml
storage: ./storage
#cache: ./cache
```

The hosted store can instead live in an S3-compatible object store — see
[Storage backends](storage.md).

## `uplinks`

Upstream registries pnpr can proxy from:

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
```

## `packages`

Per-package access and publish rules, matched top to bottom by glob. Each entry
can set `access`, `publish`, and a `proxy` uplink:

```yaml
packages:
  '@private/*':
    access: $authenticated
    publish: $authenticated

  '@*/*':
    access: $all
    publish: $authenticated
    proxy: npmjs

  '**':
    access: $all
    publish: $authenticated
    proxy: npmjs
```

Common access values are `$all` (anyone), `$authenticated` (logged-in users),
and `$anonymous`.

## `auth`

By default users are stored in an htpasswd file and tokens in a local SQLite
database:

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    # Maximum number of users allowed to register. Defaults to "+inf".
    # Set to -1 to disable registration.
    #max_users: 1000
```

To share auth state across several stateless pnpr replicas, move users and
tokens into a shared SQL database — see [Auth backends](auth-backends.md).

## `log`

```yaml
log:
  type: stdout
  format: pretty   # or `json`
  level: error
```

`RUST_LOG` always overrides the configured level. See the
[CLI reference](cli.md#logging).

## Environment variable substitution

Any `${ENV_VAR}` in the config is substituted from the environment before
parsing, so secrets can be kept out of the file:

```yaml
s3:
  accessKeyId: ${PNPR_S3_ACCESS_KEY_ID}
  secretAccessKey: ${PNPR_S3_SECRET_ACCESS_KEY}
```
