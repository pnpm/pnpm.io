---
id: runtime
title: "pnpm runtime <cmd>"
---

Manage runtimes.

Alias: `rt`

## Commands

### set

Install the specified version of a runtime.

```sh
pnpm runtime set <name> <version> [-g]
```

#### Supported runtimes

- `node` - Node.js
- `deno` - Deno
- `bun` - Bun

:::info

Since v11.0.0, installing a Node.js runtime (via `pnpm runtime set node …` or `node@runtime:<version>`) does not extract the bundled `npm`, `npx`, and `corepack` from the Node.js archive. This roughly halves the number of files pnpm has to hash, write to the CAS, and link during a runtime install. If you still need `npm`, install it separately with `pnpm add -g npm`.

:::

#### Examples

Install Node.js v22 globally:

```sh
pnpm runtime set node 22 -g
```

Install the LTS version of Node.js:

```sh
pnpm runtime set node lts -g
```

Install the latest version of Node.js:

```sh
pnpm runtime set node latest -g
```

Install a prerelease version of Node.js:

```sh
pnpm runtime set node nightly -g
pnpm runtime set node rc -g
pnpm runtime set node rc/22 -g
pnpm runtime set node 22.0.0-rc.4 -g
```

Install an LTS version of Node.js using its [codename]:

```sh
pnpm runtime set node argon -g
```

Install Deno:

```sh
pnpm runtime set deno 2 -g
```

Install Bun:

```sh
pnpm runtime set bun latest -g
```

[codename]: https://github.com/nodejs/Release/blob/main/CODENAMES.md

## Options

### --global, -g

Install the runtime globally.
