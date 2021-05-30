---
id: exec
title: pnpm exec
---

Execute a shell command in scope of a project.

`node_modules/.bin` is added to the `PATH`, so `pnpm exec` allows executing commands of dependencies.

## Examples

If you have Jest as a dependency of your project, there is no need to install Jest globally, just run it with `pnpm exec`:

```
pnpm exec jest
```

The `exec` part is actually optional when the command is not in conflict with a builtin pnpm command, so you may also just run:

```
pnpm jest
```

## Options

### --recursive, -r

Added in: v2.9.0

Execute the shell command in every project of the workspace.

The name of the current package is available through the environment variable
`PNPM_PACKAGE_NAME` (supported from pnpm v2.22.0 onwards).

Examples:

```
# prune node_modules installations for all packages
pnpm -r exec -- rm -rf node_modules
# view package information for all packages
pnpm -r exec -- pnpm view $PNPM_PACKAGE_NAME
```

### --parallel

Added in: v5.1.0

Completely disregard concurrency and topological sorting, running a given script
immediately in all matching packages with prefixed streaming output. This is the
preferred flag for long-running processes over many packages, for instance, a
lengthy build process.

### --filter &lt;package_selector\>

[Read more about filtering.](../filtering.md)
