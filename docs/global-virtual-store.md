---
id: global-virtual-store
title: Global Virtual Store
---

By default, pnpm creates a `.pnpm` directory inside each project's `node_modules` — this is the "virtual store". It contains hardlinks to files in the [content-addressable store](./settings.md#storedir). Every project gets its own projection of this virtual store — pnpm hardlinks files from the content-addressable store into the `.pnpm` directory structure. The actual file contents exist only once on disk, but the directory structure is recreated for each project so that Node.js's module resolution algorithm can find the right dependencies for each package.

The **global virtual store** (`enableGlobalVirtualStore: true`) changes this. Instead of each project having its own `node_modules/.pnpm` directory, pnpm maintains a single shared virtual store (located at `<store-path>/links/`, run `pnpm store path` to find `<store-path>`). Each project's `node_modules` contains only symlinks pointing into this shared location.

## Default behavior vs global virtual store

### Default (per-project virtual store)

```
project-a/
└── node_modules/
    ├── lodash → .pnpm/lodash@4.17.21/node_modules/lodash
    └── .pnpm/
        └── lodash@4.17.21/
            └── node_modules/
                └── lodash/            ← hardlinks to content-addressable store
project-b/
└── node_modules/
    ├── lodash → .pnpm/lodash@4.17.21/node_modules/lodash
    └── .pnpm/
        └── lodash@4.17.21/
            └── node_modules/
                └── lodash/            ← same hardlinks, duplicated directory structure
```

Each project has its own `.pnpm` with hardlinks. The file contents aren't duplicated on disk (hardlinks share inodes), but the directory structure is. With large monorepos or many parallel checkouts, the time spent creating thousands of hardlinks during `pnpm install` adds up.

### With global virtual store

```
project-a/
└── node_modules/
    └── lodash → <global-store>/links/@/lodash/4.17.21/<hash>/node_modules/lodash
project-b/
└── node_modules/
    └── lodash → <global-store>/links/@/lodash/4.17.21/<hash>/node_modules/lodash  ← same target
```

Both projects symlink directly to the same location in the global virtual store. There's no per-project `.pnpm` directory. The global virtual store itself contains the hardlinks to the content-addressable store — but that happens only once per dependency graph (more on that below), not per project.

## How package identity works

In the global virtual store, each package directory is named by the hash of its dependency graph. Two projects that use `lodash@4.17.21` with the same transitive dependency tree will point to the exact same directory. If the dependency trees differ (e.g., different peer dependencies), pnpm creates separate entries. This is conceptually similar to how [NixOS manages packages](https://nixos.org/guides/how-nix-works/) using dependency graph hashes.

## When to use it

The global virtual store is most useful when you have multiple checkouts of the same project on disk — for example, when using [git worktrees for multi-agent development](./git-worktrees.md). In that scenario, each worktree gets a nearly free `node_modules` because all the real package content already exists in the shared store.

It also speeds up installations across unrelated projects on the same machine, since any package version that's already been installed by any project is available instantly.

## Limitations

- **CI environments**: In CI, caches are typically absent, so there's no warm global store to benefit from. The global virtual store is generally not useful in CI.
- **ESM hoisting**: pnpm uses the `NODE_PATH` environment variable to support hoisted dependencies with the global virtual store. However, Node.js does not respect `NODE_PATH` for ESM imports. If ESM dependencies try to import packages not declared in their own `package.json`, resolution will fail. You can work around this with [packageExtensions](./settings.md#packageextensions) or the [@pnpm/plugin-esm-node-path](https://github.com/pnpm/plugin-esm-node-path) config dependency.

:::note

The global virtual store is currently disabled by default for project installs and marked as experimental, as some tools may not work correctly with symlinked `node_modules`. You need to explicitly set `enableGlobalVirtualStore: true` in `pnpm-workspace.yaml` to use it for project installs. In pnpm v11, the global virtual store is enabled by default for packages installed via `pnpm dlx` (`pnpx`) and globally installed packages. The goal is to enable it by default for all installations in a future version.

:::

## Global packages

In pnpm v11, global installs (`pnpm add -g`) and `pnpm dlx` use the global virtual store by default. See [Global Packages](./global-packages.md) for the full guide on how global package management works in v11, including isolated installations and the new binaries location.

## Configuration

See the [`enableGlobalVirtualStore`](./settings.md#enableglobalvirtualstore) setting reference for all configuration details.
