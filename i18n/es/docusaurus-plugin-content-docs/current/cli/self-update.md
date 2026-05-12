---
id: self-update
title: pnpm self-update
---

Updates pnpm to the latest version or the one specified.

```
pnpm self-update [<version>]
```

Ejemplos de uso:

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
