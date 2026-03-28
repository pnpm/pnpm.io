---
id: approve-builds
title: pnpm approve-builds
---

Added in: v10.1.0

Approve dependencies for running scripts during installation.

The approved dependencies are added to the [`allowBuilds`] map in `pnpm-workspace.yaml` with a value of `true`, while unapproved ones are saved with a value of `false`. You can also update these settings manually if you prefer.

[`allowBuilds`]: ../settings.md#allowbuilds

## Usage

You can run `pnpm approve-builds` without arguments to get an interactive prompt, or pass package names as positional arguments:

```sh
pnpm approve-builds esbuild fsevents !core-js
```

Prefix a package name with `!` to deny it. Only mentioned packages are affected; the rest are left untouched.

During install, packages with ignored builds that are not yet listed in `allowBuilds` are automatically added to `pnpm-workspace.yaml` with a placeholder value, so you can manually set them to `true` or `false`.

## Options

### --all

Added in: v10.32.0

Approve all pending builds without interactive prompts.

### ~~--global, -g~~

:::warning Removed in v11.0.0

`pnpm approve-builds -g` is no longer supported with isolated global packages. Instead, use `--allow-build` when installing globally (e.g., `pnpm add -g --allow-build=esbuild esbuild`), or approve builds via the interactive prompt that pnpm shows during global install.

:::

