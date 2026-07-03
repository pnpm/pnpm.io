---
id: endpoints
title: HTTP endpoints
---

pnpr exposes a set of always-on endpoints (health, user accounts, and tokens)
plus two surfaces:

- **Registry surface** - npm-compatible package and publish endpoints. Served
  exactly when at least one registry is declared under
  [`registries:`](configuration.md#registries-and-defaultregistry);
  `--disable-registry` turns it off for one process.
- **Resolver surface** (`resolver.enabled`) - pnpr install-accelerator
  endpoints under `/-/pnpr`.

See [Configuration](configuration.md#the-registry-surface-and-resolver) for
the config keys and [CLI reference](cli.md) for the command-line overrides.

## Always available

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/-/ping` | Health check. Returns `{}`. |

The [user and token endpoints](#user-and-token-endpoints) below are also
always available, whichever surfaces are enabled.

## Registry bases: `/` and `/~<name>/`

Every [registry](configuration.md#registries-and-defaultregistry) is served as
a full npm registry at `/~<name>/` — packument and tarball reads, version
manifests, dist-tags, search, publish, unpublish, and the login/whoami
endpoints all work under a registry prefix. The `~` prefix keeps registry
names out of the package-name namespace (a package name can never begin with
`~`).

The path-less base (`/`) aliases the registry named by `defaultRegistry`; with
no `defaultRegistry` configured, the bare host serves no registry and only the
`/~<name>/` bases answer.

Every request routes through the registry graph:

- A request to a **router** is answered by the first listed source whose
  declared [`packages:`](configuration.md#the-packages-map) claim the name. A
  name that no source claims is a definitive `404` — there is no fall-through
  to another origin. A matched source that is unavailable is an error, never a
  `404`.
- A registry's declared namespace is enforced **on every path to it**: a read
  of a name outside the namespace is a definitive `404` answered before
  storage or the upstream is consulted — through a router, on the path-less
  base, and at the registry's own `/~<name>/` URL alike — and an off-namespace
  publish is rejected.
- **Writes** (publish, dist-tags, unpublish) must resolve to a hosted
  registry; a write that routes to an upstream is rejected.
- The serving registry's matching `packages:` rule is enforced on every read
  and write.
- Served `dist.tarball` URLs are rewritten onto the configured `public_url`
  and stay canonical for the base the client addressed (path-less or
  `/~<name>/`), so lockfiles don't bake in a registry name.

The endpoint tables below show path-less shapes; each is equally available
under a `/~<name>/` prefix.

## Resolver endpoints

The resolver endpoints are mounted when `resolver.enabled` is true. The
`POST` endpoints require a valid pnpr `Authorization` header.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/-/pnpr` | Capability handshake. Returns supported protocol versions, currently `{"pnpr":{"versions":[0]}}`. A 404 means the server has no compatible resolver surface. |
| `POST` | `/-/pnpr/v0/resolve` | Resolves one project or workspace against the registries and policy sent by the client. Returns `application/x-ndjson` frames. |
| `POST` | `/-/pnpr/v0/verify-lockfile` | Verifies an existing lockfile under the client's registry and policy settings without resolving again. Returns `application/x-ndjson` frames. |

`POST /-/pnpr/v0/resolve` accepts fields such as `projects`, `dependencies`,
`devDependencies`, `optionalDependencies`, `registry`, `namedRegistries`,
`overrides`, `lockfile`, `frozenLockfile`, `preferFrozenLockfile`,
`ignoreManifestCheck`, `trustLockfile`, `minimumReleaseAge`,
`minimumReleaseAgeExclude`, `minimumReleaseAgeIgnoreMissingTime`,
`trustPolicy`, `trustPolicyExclude`, and `trustPolicyIgnoreAfter`.

Every registry the request would make pnpr fetch from — the `registry` and
`namedRegistries` origins, plus any direct `http(s)`/`git` URL in a dependency
spec, an override, or an input-lockfile tarball — must be on the server's fetch
allowlist (the configured registries, declared public routes, the built-in npm
registry, and pnpr's own origin). An off-allowlist origin is rejected up front,
before any server-side fetch. Upstream credentials are never taken from the
client: pnpr selects its own server-owned credential per route (see
[Install acceleration](install-acceleration.md#private-registries)), and a URL
carrying inline `user:pass@` credentials is rejected.

The `resolve` response is an NDJSON stream:

| Frame | Description |
| --- | --- |
| `package` | One resolved tarball: `id`, `name`, `version`, `integrity`, `tarball`, and optional `unpackedSize` / `fileCount`. |
| `done` | Terminal success frame. For `resolve`, carries `lockfile` and `stats.totalPackages`; for `verify-lockfile`, only indicates success. |
| `violations` | Terminal policy failure frame. Carries rendered lockfile or OSV violations. |
| `error` | Terminal server-side resolution or verification error. |

## Registry read endpoints

These endpoints are mounted when the registry surface is served. Package reads
are checked against the serving registry's matching
[`packages:`](configuration.md#the-packages-map) rule.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/{name}` | Unscoped package packument. |
| `GET` | `/@scope/{name}` | Scoped package packument. |
| `GET` | `/{name}/{version-or-tag}` | Unscoped version manifest by exact version or dist-tag. |
| `GET` | `/@scope/{name}/{version-or-tag}` | Scoped version manifest by exact version or dist-tag. |
| `GET` | `/{name}/-/{filename}` | Unscoped tarball. |
| `GET` | `/@scope/{name}/-/{filename}` | Scoped tarball. |
| `GET` | `/-/package/{package}/dist-tags` | Package `dist-tags` object. Use a percent-encoded scoped package name, for example `@scope%2Fname`. |
| `GET` | `/-/v1/search?text=<query>&size=<n>` | npm search v1 shape. Searches locally hosted packages by package-name substring; search is local-only and never proxied upstream. Results are filtered by access policy. |

If the client sends `Accept: application/vnd.npm.install-v1+json`, pnpr
returns npm's abbreviated install-v1 packument shape.

When OSV checks are enabled, vulnerable versions are removed from packuments
and dist-tags. Version manifests and tarballs for vulnerable versions are
denied.

## Registry write endpoints

These endpoints are mounted when the registry surface is served. `PUT` and
`DELETE` requests require credentials. A read-only bearer token cannot use
write methods, and CIDR-restricted bearer tokens are checked against the peer
socket address. Every write routes through the registry graph and must land on
a hosted registry.

| Method | Path | Description |
| --- | --- | --- |
| `PUT` | `/{name}` | Publish an unscoped package. Body is the npm publish document with `_attachments`. Requires `publish`. |
| `PUT` | `/@scope/{name}` | Publish a scoped package. Body is the npm publish document with `_attachments`. Requires `publish`. |
| `PUT` | `/-/pnpm/v1/publish` | pnpm batch publish. Body is `{"packages":[<publish document>, ...]}`. The batch is all-or-nothing and each package requires `publish`. |
| `PUT` | `/{package}/-rev/{rev}` | Replace a packument, used by partial unpublish. Requires both `publish` and `unpublish`. Use a percent-encoded scoped package name, for example `@scope%2Fname`. |
| `DELETE` | `/{package}/-rev/{rev}` | Remove an entire package, used by force unpublish. Requires `unpublish`. Use a percent-encoded scoped package name for scoped packages. |
| `DELETE` | `/{name}/-/{filename}/-rev/{rev}` | Remove an unscoped tarball. Requires `unpublish`. |
| `DELETE` | `/@scope/{name}/-/{filename}/-rev/{rev}` | Remove a scoped tarball. Requires `unpublish`. |
| `PUT` | `/-/package/{package}/dist-tags/{tag}` | Add or update a dist-tag. Body is a JSON string version, for example `"1.0.0"`. Requires `publish`. |
| `DELETE` | `/-/package/{package}/dist-tags/{tag}` | Remove a dist-tag. Requires `publish`. |

## User and token endpoints

These endpoints are **always mounted**, whichever surfaces are enabled, and
they are global — served identically on the path-less base and under any
`/~<name>/` prefix. `pnpm login` therefore works against any pnpr URL,
including a resolver-only server that exposes no registry surface.

| Method | Path | Description |
| --- | --- | --- |
| `PUT` | `/-/user/org.couchdb.user:{name}` | npm adduser/login endpoint. Creates a user only when `auth.htpasswd.max_users` allows registration; existing users can log in with the correct password. Returns a bearer token. |
| `GET` | `/-/whoami` | Returns `{"username": ...}` for the authenticated caller. |
| `GET` | `/-/npm/v1/user` | npm profile endpoint. Returns the authenticated username and placeholder profile fields. |
| `GET` | `/-/npm/v1/tokens` | Lists bearer tokens for the authenticated caller in npm-compatible shape. |
| `DELETE` | `/-/npm/v1/tokens/token/{key}` | Revokes one of the caller's tokens by listing-side token key. |
| `DELETE` | `/-/user/token/{token}` | npm logout endpoint. Revokes the raw bearer token in the path when it belongs to the authenticated caller. |
