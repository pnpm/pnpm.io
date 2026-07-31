---
id: update
title: pnpm update
---

Aliases: `up`, `upgrade`

`pnpm update` updates packages to their latest version based on the specified
range.

When used without arguments, updates all dependencies.

## TL;DR

| Command              | Meaning                                                                  |
|----------------------|--------------------------------------------------------------------------|
|`pnpm up`             | Updates all dependencies, adhering to ranges specified in `package.json` |
|`pnpm up --latest`    | Updates all dependencies to their latest versions                        |
|`pnpm up foo@2`       | Updates `foo` to the latest version on v2                                |
|`pnpm up "@babel/*"` | Updates all dependencies under the `@babel` scope                        |

## Selecting dependencies with patterns

You can use patterns to update specific dependencies.

Update all `babel` packages:

```sh
pnpm update "@babel/*"
```

Update all dependencies, except `webpack`:

```sh
pnpm update "\!webpack"
```

Patterns may also be combined, so the next command will update all `babel` packages, except `core`:

```sh
pnpm update "@babel/*" "\!@babel/core"
```

## Updating GitHub Actions

Added in: v11.16.0

`pnpm update` and [`pnpm outdated`](./outdated.md) can also check and update the GitHub Actions referenced by the repository's workflow files. This is opt-in for every command: pass [`--include-github-actions`](#--include-github-actions), or set [`update.githubActions`](../settings.md#updategithubactions) to `true` in `pnpm-workspace.yaml` to enable it by default.

Updated actions are pinned to exact commit hashes, with their release tags preserved in comments:

```yaml
- uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0
```

Checking for updates runs `git ls-remote` against every referenced repository. Actions whose refs cannot be read — for example, an action in a private repository — are skipped with a warning. If the actions are hosted on a different GitHub server (such as a GitHub Enterprise Server), set [`update.githubActionsServer`](../settings.md#updategithubactionsserver).

## Options

### --recursive, -r

Concurrently runs update in all subdirectories with a `package.json` (excluding
node_modules).

Usage examples:

```sh
pnpm --recursive update
# updates all packages up to 100 subdirectories in depth
pnpm --recursive update --depth 100
# update typescript to the latest version in every package
pnpm --recursive update typescript@latest
```

### --latest, -L

Update the dependencies to their latest stable version as determined by their `latest` tags (potentially upgrading the packages across major versions) as long as the version range specified in `package.json` is lower than the `latest` tag (i.e. it will not downgrade prereleases).

### --global, -g

Update global packages.

### --workspace

Tries to link all packages from the workspace. Versions are updated to match the
versions of packages inside the workspace.

If specific packages are updated, the command will fail if any of the updated
dependencies are not found inside the workspace. For instance, the following
command fails if `express` is not a workspace package:

```sh
pnpm up -r --workspace express
```

### --prod, -P

Only update packages in `dependencies` and `optionalDependencies`.

### --dev, -D

Only update packages in `devDependencies`.

### --no-optional

Don't update packages in `optionalDependencies`.

### --interactive, -i

Show outdated dependencies and select which ones to update.

### --no-save

Don't update the ranges in `package.json`.

### --changeset

Added in: v11.16.0

After the update completes, write a [change intent](../versioning.md) — a changesets-compatible `.changeset/*.md` file — declaring a `patch` bump for every workspace package whose `dependencies` or `optionalDependencies` were changed by the update, and a `major` bump when its `peerDependencies` changed. Packages that consume an updated catalog entry via the `catalog:` protocol are included. Private packages, packages without a name, and packages listed in the `ignore` array of `.changeset/config.json` are skipped. If `.changeset/config.json` does not exist, a warning is printed and no changeset is generated.

Set [`update.changeset`](../settings.md#updatechangeset) to `true` in `pnpm-workspace.yaml` to enable this behavior by default, and use `--no-changeset` to override the setting for one update.

### --include-github-actions

Added in: v11.16.0

Also update the GitHub Actions referenced by the repository's workflow files. See [Updating GitHub Actions](#updating-github-actions).

### --filter &lt;package_selector\>

[Read more about filtering.](../filtering.md)
