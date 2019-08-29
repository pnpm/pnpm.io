---
id: version-3.0.0-workspace
title: Workspace
original_id: workspace
---

pnpm supports concurrent actions in multi-package repositories (workspaces).

By default, when you run the [`pnpm recursive [action]`](pnpm-recursive) commands,
all the directories are searched for packages (directories with `package.json` file).
You can control what directories are searched by passing an array of globs to `packages` in `pnpm-workspace.yaml`.

An example of a `pnpm-workspace.yaml`:

```yaml
packages:
  # the root package.json
  - '.'
  # all packages in subdirs of packages/ and components/
  - 'packages/**'
  - 'components/**'
  # exclude packages that are inside test/ directories
  - '!**/test/**'
```

`pnpm-workspace.yaml` should be in the root of the workspace.
