---
id: fetch
title: pnpm fetch
---

Fetch packages from a lockfile into virtual store, package manifest is ignored.
Useful for building a docker image, see
[the correspinding guide](../boost-docker-build-with-pnpm-fetch).

:::warning

This is an experimental command. Breaking changes may be introduced in non-major versions of the CLI.

:::

## Options

### --dev

Only development packages will be fetched

### --prod

Development packages will not be fetched



