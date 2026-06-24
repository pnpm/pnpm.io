---
id: install-acceleration
title: Install acceleration
---

Besides acting as a registry, pnpr can speed up `pnpm install` by resolving a
project's dependency graph **server-side** and handing pnpm a ready-to-use
lockfile. pnpm then runs a normal headless install, fetching every tarball
directly from the registries in parallel.

## Why it's faster

The slow part of installing a fresh project (one with no lockfile, or with new
dependencies) is **resolution**, not downloading tarballs. To resolve a
dependency graph, pnpm has to walk it: fetch a package's metadata (its
"packument"), read its dependency ranges, fetch the packuments for those, and so
on, level by level. Each level depends on the answers from the previous one, so
the requests can't all be parallelized — the total time is roughly the
**depth of the graph × the round-trip latency** to the registry. From a laptop
or a CI runner that sits far from the registry, that round-trip depth dominates
the install.

pnpr collapses that depth:

- **It runs the resolution close to the registry**, with low latency to the
  upstream, so each of those sequential round-trips is cheap.
- **It keeps a warm, shared cache** of packuments and verified resolution
  results across every client that uses it. A team or CI fleet pointed at one
  pnpr server resolves against a cache that's already hot from everyone else's
  installs.
- **It returns the whole resolved lockfile in a single response**, so the client
  pays one round-trip for resolution instead of one per graph level.

Crucially, pnpr only does the resolution. The tarballs are still fetched by the
client, **directly from the registries in parallel** — exactly like a normal
install, which a single connection through the server could never match. The
accelerated path removes the latency-bound resolution waterfall without turning
tarball downloads into a single server-mediated stream.

When the project already has an up-to-date lockfile, there's nothing to resolve,
so this path doesn't apply — the speedup is for cold installs and dependency
changes.

## How it works

1. pnpm checks `GET /-/pnpr` to verify that the server speaks a compatible pnpr
   resolver protocol version.
2. pnpm sends `POST /-/pnpr/v0/resolve` with the project's dependencies,
   registry settings, forwarded upstream credentials, policy settings, and the
   existing lockfile when one is available.
3. The server resolves against the client's registries, verifies the input
   lockfile under the client's policy, and streams an `application/x-ndjson`
   response. `package` frames announce resolved tarballs as the tree walk
   progresses, and a terminal `done` frame carries the resolved lockfile and
   stats. A terminal `violations` or `error` frame aborts the install.
4. pnpm writes the resolved lockfile and fetches tarballs directly from the
   registries, like a normal install.

For frozen restores with an already-fresh lockfile, pnpm can use
`POST /-/pnpr/v0/verify-lockfile` to get only the server-side trust verdict
instead of resolving again.

The resolver surface is stateless for package contents: it stores no tarballs
and serves no file content. See
[pnpm/pnpm#12230](https://github.com/pnpm/pnpm/issues/12230) and
[pnpm/pnpm#12234](https://github.com/pnpm/pnpm/issues/12234) for background.

## Enabling it

Set `pnprServer` in your `pnpm-workspace.yaml` to the URL of a pnpr server:

```yaml
pnprServer: http://127.0.0.1:7677
```

pnpm will offload resolution to that server during `pnpm install`. The resolver
`POST` endpoints require a valid pnpr `Authorization` header. pnpm forwards the
auth configured for the `pnprServer` URL; if the same pnpr server is also your
registry, a normal `pnpm login --registry <server-url>` writes the token pnpm
uses for both registry and resolver requests.
