---
id: runtime
title: "pnpm runtime <cmd>"
---

Manage runtimes.

Alias: `rt`

## Commands

### set

Install the specified version of a runtime.

```
pnpm runtime set <name> <version> [-g]
```

#### Supported runtimes

- `node` - Node.js
- `deno` - Deno
- `bun` - Bun

#### Examples

Install Node.js v22 globally:

```
pnpm runtime set node 22 -g
```

Install the LTS version of Node.js:

```
pnpm runtime set node lts -g
```

Install the latest version of Node.js:

```
pnpm runtime set node latest -g
```

Install a prerelease version of Node.js:

```
pnpm runtime set node nightly -g
pnpm runtime set node rc -g
pnpm runtime set node rc/22 -g
pnpm runtime set node 22.0.0-rc.4 -g
```

Install an LTS version of Node.js using its [codename]:

```
pnpm runtime set node argon -g
```

Install Deno:

```
pnpm runtime set deno 2 -g
```

Install Bun:

```
pnpm runtime set bun latest -g
```

[codename]: https://github.com/nodejs/Release/blob/main/CODENAMES.md

## Options

### --global, -g

Install the runtime globally.
