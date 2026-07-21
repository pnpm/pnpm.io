---
id: self-update
title: pnpm self-update
---

Updates pnpm to the latest version or the one specified.

```
pnpm self-update [<version>]
```

Usage examples:

```
pnpm self-update
pnpm self-update 10
pnpm self-update next-10
pnpm self-update 10.6.5
```

## Behavior

The behavior of `pnpm self-update` depends on the project context:

### In a project that pins pnpm

When the project's `package.json` has a `packageManager` field set to pnpm (or a `devEngines.packageManager` entry for pnpm), `self-update` only updates the pinned version in `package.json` to the resolved one. It does not install pnpm globally. The next time you run a pnpm command, pnpm will automatically download and switch to the specified version.

### Outside a project (or when the pnpm pin is ignored)

If the project does not pin pnpm, or the pin is being ignored via [`pmOnFail: ignore`](../settings.md#pmonfail), `self-update` installs the resolved pnpm version globally and links it to `PNPM_HOME` so it becomes the active pnpm binary on your system.

Running [`pnpm store prune`](./store.md#prune) removes previously installed global versions once they are no longer linked (after a newer install replaces them) while keeping the version currently in use. Install directories created within a 5-minute safety window are skipped.

## Installing pnpm v12 (the Rust port)

Since v11.10.0, `pnpm self-update` (and `packageManager` version-switching) can install and link **pnpm v12**, the Rust port. It is published under both the `pnpm` and `@pnpm/exe` names on the `next-12` dist-tag:

```
pnpm self-update next-12
```

v12 ships native binaries as `@pnpm/exe.<platform>-<arch>` packages, which pnpm's built-in installer links directly. There is no Node.js launcher, so the command pays no Node.js startup cost. From v12 onward the install converges on the unscoped `pnpm` package (the Rust executable), even when updating from the SEA `@pnpm/exe` build.
