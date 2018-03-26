---
id: workspace
title: Workspace
---

pnpm supports concurrent actions in multi-package repositories (workspaces).

By default, when you run the [`pnpm recursive [action]`](../usage/pnpm-cli.html#recursive-install) commands,
all the directories are searched for packages (directories with `package.json` file).
From `v1.35.0`, you can control what directories are searched by passing an array of globs to `packages` in `pnpm-workspace.yaml`.

An example of a `pnpm-workspace.yaml`:

```yaml
packages:
  - 'packages/**'
  - 'components/**'
  - '!**/test/**'
```

`pnpm-workspace.yaml` should be in the root of the workspace.
