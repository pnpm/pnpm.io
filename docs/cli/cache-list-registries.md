---
id: cache-list-registries
title: pnpm cache list-registries
---

:::warning

This command is experimental

:::

Lists all registries that have their metadata cache locally.

Since v12.4.0, the metadata cache is keyed by the registry's full URL, including its path and scheme, so two registries served from one host under different paths no longer share cached packuments and metadata fetched over HTTP is never reused for HTTPS. The command prints those full URLs. A script that parsed the old host-shaped directory names, here or in `pnpm cache list`, needs updating, and the first install after upgrading refetches registry metadata. The package store is untouched.
