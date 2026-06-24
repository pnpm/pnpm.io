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
    unpublish: $authenticated
    proxy: npmjs

  '**':
    access: $all
    publish: $authenticated
    unpublish: $authenticated
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
  store, resolver cache, lockfile-verdict cache, and S3 upload staging scratch.
  Safe to wipe at any time. Defaults to a `.pnpr-cache` subdirectory of
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
    maxage: 5m
    timeout: 30s
    max_fails: 2
    fail_timeout: 5m
    cache: true
```

Supported uplink keys:

| Key | Description |
| --- | --- |
| `url` | Upstream registry URL. |
| `auth` | Optional auth block. `type` is `bearer` or `basic`; provide `token`, or `token_env: true` to read `NPM_TOKEN`, or `token_env: NAME` to read a named environment variable. |
| `headers` | Extra request headers to send to the uplink. If `headers.Authorization` is set, it overrides the `auth`-derived header. |
| `maxage` | Per-uplink packument freshness window. Overrides pnpr's global packument TTL / `--packument-ttl-secs` for this uplink. |
| `timeout` | Per-request upstream deadline. Defaults to `30s`. |
| `max_fails` | Consecutive failures before the uplink circuit breaker opens. Defaults to `2`; `0` disables the breaker. |
| `fail_timeout` | Cooldown before an open uplink is probed again. Defaults to `5m`. |
| `cache` | Whether tarballs fetched from this uplink are written to the local mirror. Defaults to `true`; `false` streams verified tarballs through a temporary file. |

Interval values accept Verdaccio-style strings such as `30s`, `5m`, `1h30m`,
or a bare number of seconds.

## `packages`

Per-package access, publish, unpublish, and proxy rules are matched top to
bottom by glob. The first matching rule wins. Each entry can set `access`,
`publish`, `unpublish`, and a `proxy` uplink:

```yaml
packages:
  '@private/*':
    access: $authenticated
    publish: $authenticated
    unpublish: $authenticated

  '@*/*':
    access: $all
    publish: $authenticated
    unpublish: $authenticated
    proxy: npmjs

  '**':
    access: $all
    publish: $authenticated
    unpublish: $authenticated
    proxy: npmjs
```

Common access values are `$all` (anyone), `$authenticated` (logged-in users),
and `$anonymous`.

When a key is omitted, `access` defaults to `$all`, `publish` defaults to
`$authenticated`, and `unpublish` defaults to nobody. Omit `proxy` to make a
matching package storage-only.

## `auth`

By default users are stored in an htpasswd file and tokens in a local SQLite
database:

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    # Self-registration is disabled when omitted or set to -1.
    # Set a non-negative cap to allow new users.
    max_users: -1
  tokens:
    # Optional. Defaults to a tokens.db sibling of the htpasswd file.
    file: ./tokens.db
```

`max_users` is deliberately safer than Verdaccio's default: omitted means
registration disabled, not unlimited registration. Existing users can still log
in. When `auth.tokens.file` is omitted and `auth.htpasswd.file` is set, the
token database defaults to `tokens.db` next to the htpasswd file.

To share auth state across several stateless pnpr replicas, move users and
tokens into a shared SQL database — see [Auth backends](auth-backends.md).

## `registry` and `resolver`

pnpr exposes two configurable HTTP surfaces:

```yaml
registry:
  enabled: true

resolver:
  enabled: true
```

- **`registry`** mounts the npm-compatible registry routes: packument and
  tarball reads, publish, unpublish, dist-tags, search, and login/token
  endpoints.
- **`resolver`** mounts the pnpr install-accelerator routes:
  `GET /-/pnpr`, `POST /-/pnpr/v0/resolve`, and
  `POST /-/pnpr/v0/verify-lockfile`.

Both are enabled by default. At least one must stay enabled. The CLI flags
`--disable-registry` and `--disable-resolver` override these settings.

## `osv`

Local OSV checks can hide or reject known vulnerable npm versions without live
OSV API calls:

```yaml
osv:
  enabled: true
  path: ./osv/npm/all.zip
```

`path` may point to an OSV npm database zip or an extracted JSON directory. When
omitted, pnpr looks for `<cache>/osv/npm/all.zip`. The same feature can be
enabled from the CLI with `--osv` and `--osv-db`.

## `log`

```yaml
log:
  type: stdout
  format: pretty   # or `json`
  level: error     # trace, debug, http, info, warn, or error
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
