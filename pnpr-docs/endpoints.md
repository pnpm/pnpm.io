---
id: endpoints
title: HTTP endpoints
---

pnpr exposes one always-on health endpoint plus two configurable surfaces:

- **Registry surface** (`registry.enabled`) - npm-compatible package, auth, and
  publish endpoints.
- **Resolver surface** (`resolver.enabled`) - pnpr install-accelerator
  endpoints under `/-/pnpr`.

Both surfaces are enabled by default. See
[Configuration](configuration.md#registry-and-resolver) for the config keys and
[CLI reference](cli.md) for the command-line overrides.

## Always available

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/-/ping` | Health check. Returns `{}`. |

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
`authHeaders`, `overrides`, `lockfile`, `frozenLockfile`,
`preferFrozenLockfile`, `ignoreManifestCheck`, `trustLockfile`,
`minimumReleaseAge`, `minimumReleaseAgeExclude`,
`minimumReleaseAgeIgnoreMissingTime`, `trustPolicy`, `trustPolicyExclude`, and
`trustPolicyIgnoreAfter`.

The `resolve` response is an NDJSON stream:

| Frame | Description |
| --- | --- |
| `package` | One resolved tarball: `id`, `name`, `version`, `integrity`, `tarball`, and optional `unpackedSize` / `fileCount`. |
| `done` | Terminal success frame. For `resolve`, carries `lockfile` and `stats.totalPackages`; for `verify-lockfile`, only indicates success. |
| `violations` | Terminal policy failure frame. Carries rendered lockfile or OSV violations. |
| `error` | Terminal server-side resolution or verification error. |

## Registry read endpoints

These endpoints are mounted when `registry.enabled` is true. Package reads are
checked against the matching package rule's `access` list.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/{name}` | Unscoped package packument. |
| `GET` | `/@scope/{name}` | Scoped package packument. |
| `GET` | `/{name}/{version-or-tag}` | Unscoped version manifest by exact version or dist-tag. |
| `GET` | `/@scope/{name}/{version-or-tag}` | Scoped version manifest by exact version or dist-tag. |
| `GET` | `/{name}/-/{filename}` | Unscoped tarball. |
| `GET` | `/@scope/{name}/-/{filename}` | Scoped tarball. |
| `GET` | `/-/package/{package}/dist-tags` | Package `dist-tags` object. Use a percent-encoded scoped package name, for example `@scope%2Fname`. |
| `GET` | `/-/v1/search?text=<query>&size=<n>` | npm search v1 shape. Searches hosted packages by package-name substring and may add an exact upstream match. Results are filtered by access policy. |

Packument responses rewrite `dist.tarball` URLs to the configured
`public_url`. If the client sends
`Accept: application/vnd.npm.install-v1+json`, pnpr returns npm's abbreviated
install-v1 packument shape.

When OSV checks are enabled, vulnerable versions are removed from packuments
and dist-tags. Version manifests and tarballs for vulnerable versions are
denied.

## Registry write endpoints

These endpoints are mounted when `registry.enabled` is true. `PUT` and
`DELETE` requests require credentials. A read-only bearer token cannot use
write methods, and CIDR-restricted bearer tokens are checked against the peer
socket address.

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

These endpoints are mounted when `registry.enabled` is true.

| Method | Path | Description |
| --- | --- | --- |
| `PUT` | `/-/user/org.couchdb.user:{name}` | npm adduser/login endpoint. Creates a user only when `auth.htpasswd.max_users` allows registration; existing users can log in with the correct password. Returns a bearer token. |
| `GET` | `/-/whoami` | Returns `{"username": ...}` for the authenticated caller. |
| `GET` | `/-/npm/v1/user` | npm profile endpoint. Returns the authenticated username and placeholder profile fields. |
| `GET` | `/-/npm/v1/tokens` | Lists bearer tokens for the authenticated caller in npm-compatible shape. |
| `DELETE` | `/-/npm/v1/tokens/token/{key}` | Revokes one of the caller's tokens by listing-side token key. |
| `DELETE` | `/-/user/token/{token}` | npm logout endpoint. Revokes the raw bearer token in the path when it belongs to the authenticated caller. |
