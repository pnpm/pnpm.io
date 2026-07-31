---
id: hoisting
title: "Dependency Hoisting Settings"
sidebar_label: "Hoisting"
---

### hoist

* Default: **true**
* Type: **boolean**

When `true`, all dependencies are hoisted to `node_modules/.pnpm/node_modules`. This makes
unlisted dependencies accessible to all packages inside `node_modules`.

### hoistWorkspacePackages

* Default: **true**
* Type: **boolean**

When `true`, packages from the workspaces are symlinked to either `<workspace_root>/node_modules/.pnpm/node_modules` or to `<workspace_root>/node_modules` depending on other hoisting settings (`hoistPattern` and `publicHoistPattern`).

### hoistPattern

* Default: **['\*']**
* Type: **string[]**

Tells pnpm which packages should be hoisted to `node_modules/.pnpm/node_modules`. By
default, all packages are hoisted - however, if you know that only some flawed
packages have phantom dependencies, you can use this option to exclusively hoist
the phantom dependencies (recommended).

For instance:

```yaml
hoistPattern:
- "*eslint*"
- "*babel*"
```

You may also exclude patterns from hoisting using `!`.

For instance:

```yaml
hoistPattern:
- "*types*"
- "!@types/react"
```

### publicHoistPattern

* Default: **[]**
* Type: **string[]**

Unlike `hoistPattern`, which hoists dependencies to a hidden modules directory
inside the virtual store, `publicHoistPattern` hoists dependencies matching
the pattern to the root modules directory. Hoisting to the root modules
directory means that application code will have access to phantom dependencies,
even if they modify the resolution strategy improperly.

This setting is useful when dealing with some flawed pluggable tools that don't
resolve dependencies properly.

For instance:

```yaml
publicHoistPattern:
- "*plugin*"
```

Note: Setting `shamefullyHoist` to `true` is the same as setting
`publicHoistPattern` to `*`.

You may also exclude patterns from hoisting using `!`.

For instance:

```yaml
publicHoistPattern:
- "*types*"
- "!@types/react"
```

### shamefullyHoist

* Default: **false**
* Type: **Boolean**

By default, pnpm creates a semistrict `node_modules`, meaning dependencies have
access to undeclared dependencies but modules outside of `node_modules` do not.
With this layout, most of the packages in the ecosystem work with no issues.
However, if some tooling only works when the hoisted dependencies are in the
root of `node_modules`, you can set this to `true` to hoist them for you.

### hoistingLimits

Added in: v11.5.0

* Default: **none**
* Type: **none**, **workspaces**, **dependencies**

Controls how far dependencies are hoisted when using `nodeLinker: hoisted`. This setting mirrors Yarn's `nmHoistingLimits`.

* **none** - hoist as far as possible (the default).
* **workspaces** - hoist only as far as each workspace package, preventing dependencies from being hoisted above the workspace package that depends on them.
* **dependencies** - hoist only up to each workspace package's direct dependencies, preventing transitive dependencies from being hoisted into the workspace package's `node_modules`.
