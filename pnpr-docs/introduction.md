---
id: introduction
title: Introduction
slug: /
---

**pnpr** is a pnpm-compatible npm registry server, written in Rust. It speaks the
npm registry protocol, so any npm-compatible client (pnpm, npm, yarn) can talk to
it. It hosts your own packages and proxies upstream registries such as
`registry.npmjs.org`, with its own authentication and access controls — roughly
the role [verdaccio](https://verdaccio.org/) plays in the JavaScript ecosystem.

Every registry origin pnpr serves is declared as a
[registry mount](configuration.md#mounts-and-defaulttarget), and a router maps
each package name to exactly one origin — there is no cross-origin
fall-through, which closes dependency-confusion attacks by construction.

pnpr lives in the [pnpm monorepo](https://github.com/pnpm/pnpm) under
[`pnpr/`](https://github.com/pnpm/pnpm/tree/main/pnpr).

:::caution Experimental

pnpr is experimental and still in active development. Its behavior,
configuration, and APIs may change between releases.

:::

## What you can use it for

- **A private registry** — host your organization's private packages, with
  per-package access and publish rules.
- **A caching proxy** — mirror an upstream registry (e.g. npmjs.org) to speed up
  installs and stay resilient to upstream outages.
- **A credential gateway** — hold one upstream registry token server-side and
  fan it out to a whole team through pnpr's own authentication, so clients
  never handle the upstream credential.
- **An install accelerator** — resolve a project's dependency graph server-side
  and hand pnpm a ready-to-use lockfile. See
  [Install acceleration](install-acceleration.md).

## How it relates to pnpm

pnpr is a **separate product** from the pnpm CLI. The pnpm CLI installs packages
on your machine; pnpr is a server you run to host and proxy them. You can use
either one without the other — but they're designed to work well together, and
pnpm can offload dependency resolution to a pnpr server to make installs faster.

## License

pnpr is **source-available**, not open source. It is licensed under the
[PolyForm Shield License 1.0.0](license.md) — you may run, modify, and self-host
pnpr for any purpose except providing a product that competes with it. This is
the only part of the pnpm monorepo that is not MIT licensed. See
[License](license.md) for details.
