---
id: configuration
title: Configuration
---

pnpr uses a YAML config. When you don't pass `-c`, pnpr looks for a global
`config.yaml` in its config directory and otherwise falls back to a bundled
default (which is shaped for pnpm's own test registry — write your own config
for real use).

A minimal config that hosts a private scope locally and routes everything else
to the public npm registry:

```yaml
storage: ./storage

mounts:
  local:
    type: hosted

  npmjs:
    type: upstream
    url: https://registry.npmjs.org/
    public: true

  main:
    type: router
    routes:
      - patterns: ['@mycompany/*']
        source: local
      - patterns: ['**']
        source: npmjs

defaultTarget: main
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

## `mounts` and `defaultTarget`

Registry mounts are pnpr's **only routing surface**. Every addressable registry
origin is a mount, exposed as an npm registry at `https://<pnpr>/~<mount>/`.
There are three kinds:

- **`hosted`** — a registry pnpr itself is the authoritative origin for. The
  only kind that accepts writes (publish, dist-tags, unpublish).
- **`upstream`** — exactly one external registry origin, proxied and cached.
- **`router`** — maps package-name patterns to exactly one concrete source
  mount, first match wins.

The model is governed by one invariant: **provenance is declared, never
inferred**. A package resolves to exactly one declared origin, and no
configuration can express a cross-origin fall-through — not on "not found" and
not on "unavailable". A router that matches no route answers a definitive 404,
and a matched-but-unreachable source is an error, never a silent fallback to
another origin. This closes the dependency-confusion class of attacks by
construction.

`defaultTarget` names the mount that the path-less base URL
(`https://<pnpr>/`) aliases — usually a router. When omitted, the bare host
serves no registry and clients must address a `/~<mount>/` URL.

A mount name is served as the single URL path segment `/~<name>/`, so it must
be one URL-safe segment: it cannot be empty, `.` or `..`, start with `.`, or
contain `/`, `\`, `:`, `%`, `?`, `#`, whitespace, or control characters.

### Hosted mounts

```yaml
mounts:
  private:
    type: hosted
    org: mycompany
    access: $authenticated
```

| Key | Description |
| --- | --- |
| `org` | Storage namespace for this mount's packages, so two hosted mounts can hold the same `name@version` without colliding. Omitted means the flat `storage` root. Must be a single path-safe segment. |
| `access` | Who may read this mount's packages. Defaults to `$all`. |

Two hosted mounts cannot share an `org` namespace — that's rejected at config
load. Publishes routed to a hosted mount land in its namespace; an unauthorized
read of a private hosted mount returns 404 (not 403), so it doesn't leak which
packages exist.

### Upstream mounts

An upstream mount is one external origin — one URL, one credential, one cache
namespace. It is either `public` (fetched anonymously, no credential, readable
by anyone) or private (carries a server-owned credential and an `access:`
policy naming who may use it):

```yaml
mounts:
  npmjs:
    type: upstream
    url: https://registry.npmjs.org/
    public: true

  corp:
    type: upstream
    url: https://npm.corp.example.com/
    auth:
      type: bearer
      token_env: CORP_NPM_TOKEN
    access: $authenticated
```

| Key | Description |
| --- | --- |
| `url` | Upstream registry URL. |
| `public` | Marks an anonymous, world-readable origin (e.g. the public npm registry). A public mount sends no credential and no custom headers; declaring `auth`, `access`, or `headers` alongside `public: true` is a config error. |
| `auth` | Server-owned credential for a private origin. `type` is `bearer` or `basic`; provide `token`, or `token_env: true` to read `NPM_TOKEN`, or `token_env: NAME` to read a named environment variable. |
| `headers` | Extra request headers to send upstream. If `headers.Authorization` is set, it overrides the `auth`-derived header. |
| `access` | Which pnpr users may reach this mount at `/~<mount>/` (and resolve through it). Required for a non-`public` upstream. |
| `maxage` | Per-mount packument freshness window. Overrides pnpr's global packument TTL / `--packument-ttl-secs` for this mount. |
| `timeout` | Per-request upstream deadline. Defaults to `30s`. |
| `max_fails` | Consecutive failures before the upstream circuit breaker opens. Defaults to `2`; `0` disables the breaker. |
| `fail_timeout` | Cooldown before an open circuit is probed again. Defaults to `5m`. |
| `cache` | Whether tarballs fetched from this mount are cached locally. Defaults to `true`; `false` streams verified tarballs through a temporary file. |

Interval values accept strings such as `30s`, `5m`, `1h30m`, or a bare number
of seconds.

A private upstream mount is more than a proxy: it is a **pnpr-managed
credential** for that origin. One upstream token, held by the server, is fanned
out to a whole team through the mount's `access:` policy — clients authenticate
to pnpr with their own tokens and never see the upstream credential. pnpr never
forwards a client's credentials upstream, and the server-owned credential is
only ever attached over the upstream's own scheme (an `https://` mount's token
is never sent over plain `http://`).

Each mount gets its own cache namespace: a `public` upstream uses a stable,
secret-free namespace shared across restarts, while a private mount's cache is
keyed by an HMAC of the mount and its credential — so rotating the upstream
token automatically moves to a fresh namespace, and a private mount's content
can never be served on a public path or through another mount.

### Router mounts

A router maps package-name patterns to concrete source mounts. Routes are
evaluated in declared order and the **first matching route is authoritative**
— later routes are never consulted:

```yaml
mounts:
  main:
    type: router
    routes:
      - patterns: ['@mycompany/*']
        source: private
      - patterns: ['@partner/sdk']
        source: corp
      - patterns: ['**']
        source: npmjs
```

The pattern language is deliberately small so that route coverage can be
checked statically:

| Pattern | Matches |
| --- | --- |
| `**` | Every package name. |
| `@*/*` | Every scoped package, any scope. |
| `@scope/*` | Every package in one scope. |
| `foo`, `@scope/foo` | Exactly that package. |

Any other wildcard is a config error rather than a silently-never-matching
literal.

Because route order is load-bearing — a misordered router is the one way a
mistake could send a private scope to a public origin — pnpr **refuses to
start** (and fails a config reload) on an invalid router:

- a route that is fully shadowed by earlier routes (including a `**` catch-all
  that isn't last);
- a single pattern already covered by an earlier route's pattern;
- a duplicate pattern;
- a source that is undefined, the router itself, or another router (routes
  must target a hosted or upstream mount — no nesting, no cycles);
- a router or route with no patterns.

## `packages`

`packages:` is a pure **access-control layer** — routing a package to its
origin is the mount graph's job. Rules are matched top to bottom by glob; the
first matching rule wins. Each entry can set `access`, `publish`, and
`unpublish`, and the rule is enforced on every mount-served read and write,
hosted or upstream:

```yaml
packages:
  '@mycompany/*':
    access: $authenticated
    publish: $authenticated
    unpublish: $authenticated

  '**':
    access: $all
    publish: $authenticated
```

Common access values are `$all` (anyone), `$authenticated` (logged-in users),
and `$anonymous`; a list can also name users and [groups](#groups).

When a key is omitted, `access` defaults to `$all`, `publish` defaults to
`$authenticated`, and `unpublish` defaults to nobody.

## `groups`

Static group/team memberships. Every access list accepts group names anywhere
it accepts usernames — the per-package `packages:` rules and the mount-level
`access:` lists alike:

```yaml
groups:
  platform: alice bob
  frontend: [carol, dave]

mounts:
  corp:
    type: upstream
    url: https://npm.corp.example.com/
    auth:
      type: bearer
      token_env: CORP_NPM_TOKEN
    access: platform
```

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

Omitted `max_users` means registration disabled, not unlimited registration.
Existing users can still log in. When `auth.tokens.file` is omitted and
`auth.htpasswd.file` is set, the token database defaults to `tokens.db` next to
the htpasswd file.

To share auth state across several stateless pnpr replicas, move users and
tokens into a shared SQL database — see [Auth backends](auth-backends.md).

## `secret`

```yaml
secret: ${PNPR_SECRET}
```

The HMAC key for pnpr's private cache namespaces — private resolution-cache
entries and private per-mount cache directories are keyed with it, so on-disk
paths reveal neither mount names nor credentials. It must be at least 16 bytes.
When omitted, a fresh random secret is generated per process, which means
private cache entries only survive for that process's lifetime — set an
explicit secret to keep private caches warm across restarts.

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
  endpoints — on the path-less base and on every `/~<mount>/` endpoint.
- **`resolver`** mounts the pnpr install-accelerator routes:
  `GET /-/pnpr`, `POST /-/pnpr/v0/resolve`, and
  `POST /-/pnpr/v0/verify-lockfile`.

Both are enabled by default. At least one must stay enabled. The CLI flags
`--disable-registry` and `--disable-resolver` override these settings.

## `routes`

Resolver route classification (see
[Install acceleration](install-acceleration.md#private-registries)) treats the
official npm registry as public out of the box. If clients resolve against
other registries that serve anonymously-readable content, declare them as
public routes so their resolutions can be cached and shared across all callers:

```yaml
routes:
  public:
    - registry: https://registry.mirror.example.com/
    - registry: https://npm.corp.example.com/
      package: '@oss/*'
```

Each rule may name a `registry` origin, a `package` glob, or both. Rules fail
closed on a typo: a present-but-unparsable `registry` URL or `package` glob
drops the whole rule (with a warning) rather than widening it.

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
