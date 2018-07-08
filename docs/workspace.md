---
id: workspace
title: Workspace
---

pnpm supports concurrent actions in multi-package repositories (workspaces).

By default, when you run the [`pnpm recursive [action]`](pnpm-recursive.md) commands,
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

## Linking packages inside a workspace

(This example will work with pnpm v2.11.0 or newer)

When working inside a workspace, you want your dependencies to be linked from the monorepo but declared as regular dependencies.
Let's suppose that you have this workspace:

```
.
├─ pnpm-workspace.yaml
└─ packages
   ├─ car
   └─ garage
```

If you want to install `car` as a dependency of `garage`, you can
run these commands:

```bash
cd packages/garage
pnpm link car
# or
pnpm link car --prefix packages/garage
```

This command will not only link `car` to `garage/node_modules/car` (from `packages/car`) but also add `car` to the `package.json` of `garage`.

`car` will be added as a regular semver dependency of `garage`. So if the version of `car` in the workspace is `1.0.0` then this is
how the `package.json` of `garage` will look like after running `pnpm link car`:

```json
{
  "name": "garage",
  "version": "1.0.0",
  "dependencies": {
    "car": "^1.0.0"
  }
}
```

The link command respects the `--save-prod`, `--save-dev` and `--save-optional` flags, so you may run `pnpm link car --save-dev` in order
to link `car` and add it as a dev dependency.
