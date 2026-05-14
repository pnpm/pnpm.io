---
id: create
title: "pnpm create"
---

從 `create-*` 或 `@foo/create-*` 入門套件建立專案。

## 範例

```
pnpm create react-app my-app
```

## Options

### --allow-build

Added in: v10.2.0

A list of package names that are allowed to run postinstall scripts during installation.

## Security and trust policies

Since v11.0.0, `pnpm create` honors the project-level security and trust policy settings — [`minimumReleaseAge`](../settings.md#minimumreleaseage) (and its `Exclude`/`Strict` companions) and [`trustPolicy`](../settings.md#trustpolicy) (and its `Exclude`/`IgnoreAfter` companions) — when resolving and fetching the starter kit.

