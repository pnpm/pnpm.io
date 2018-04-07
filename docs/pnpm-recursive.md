---
id: pnpm-recursive
title: pnpm recursive
---

## pnpm recursive install

Added in: v1.24.0

> Stability: Experimental

```sh
pnpm recursive install [arguments]
```

Concurrently runs install in all subdirectories with a `package.json` (excluding node_modules).

Usage examples:

```sh
pnpm recursive install
pnpm recursive 10 install --ignore-scripts
```

## pnpm recursive update

Added in: v1.24.0

> Stability: Experimental

```sh
pnpm recursive update [arguments]
```

Concurrently runs update in all subdirectories with a `package.json` (excluding node_modules).

Usage examples:

```sh
pnpm recursive update
pnpm recursive update --depth 100
```

## pnpm recursive link

Added in: v1.32.0

> Stability: Experimental

```sh
pnpm recursive link [arguments]
```

Concurrently runs installation in all subdirectories with a `package.json` (excluding node_modules).
If a package is available locally, the local version is linked.

Usage examples:

```sh
pnpm recursive link
pnpm recursive link --ignore-scripts
```

## pnpm recursive dislink

Added in: v1.32.0

> Stability: Experimental

```sh
pnpm recursive dislink [arguments]
```

Removes links to local packages and reinstalls them from the registry.

Usage examples:

```sh
pnpm recursive dislink
```
