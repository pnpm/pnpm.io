---
id: pnpm-recursive
title: pnpm recursive
---

## pnpm recursive install

Added in: v1.24.0

> Stability: Experimental

```
pnpm recursive [concurrency] install [arguments]
```

Concurrently runs install in all subdirectories with a `package.json` (excluding node_modules).

Usage examples:

```
pnpm recursive install
pnpm recursive 10 install --ignore-scripts
```

## pnpm recursive update

Added in: v1.24.0

> Stability: Experimental

```
pnpm recursive [concurrency] update [arguments]
```

Concurrently runs update in all subdirectories with a `package.json` (excluding node_modules).

Usage examples:

```
pnpm recursive update
pnpm recursive update --depth 100
```

## pnpm recursive link

Added in: v1.32.0

> Stability: Experimental

```
pnpm recursive [concurrency] link [arguments]
```

Concurrently runs installation in all subdirectories with a `package.json` (excluding node_modules).
If a package is available locally, the local version is linked.

Usage examples:

```
pnpm recursive link
pnpm recursive link --ignore-scripts
```

## pnpm recursive dislink

Added in: v1.32.0

> Stability: Experimental

```
pnpm recursive [concurrency] dislink [arguments]
```

Removes links to local packages and reinstalls them from the registry.

Usage examples:

```
pnpm recursive dislink
```

***

The rest of the commands pass through to npm.

For using the programmatic API, use pnpm's engine: [supi](https://github.com/pnpm/supi).
