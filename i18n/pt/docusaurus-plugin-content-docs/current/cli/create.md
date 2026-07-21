---
id: create
title: "pnpm create"
---

Cria um projeto a partir de um pacote `create-*` ou `@foo/create-*`.

## Exemplos

```
pnpm create react-app my-app
```

## Opções

### --allow-build

Added in: v10.2.0

A list of package names that are allowed to run postinstall scripts during installation.

## Security and trust policies

Since v11.0.0, `pnpm create` honors the project-level security and trust policy settings — [`minimumReleaseAge`](../settings.md#minimumreleaseage) (and its `Exclude`/`Strict` companions) and [`trustPolicy`](../settings.md#trustpolicy) (and its `Exclude`/`IgnoreAfter` companions) — when resolving and fetching the starter kit.

