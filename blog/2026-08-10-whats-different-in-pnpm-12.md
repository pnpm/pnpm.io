---
title: "What's different in pnpm 12"
date: 2026-08-10
slug: whats-different-in-pnpm-12
authors: zkochan
tags: [release]
---

pnpm 12 is a rewrite of pnpm in Rust, **stable since v12.0.0**. Upgrading is not meant to be a migration: apart from the differences below, it keeps the commands, flags, settings, and lockfile format of pnpm 11, and the [documentation](/motivation) applies to both versions.

Seven things differ, and one of them — a removed flag — fails outright rather than behaving differently. This post collects them in one place.

<!--truncate-->

## Project-aware global bins

A globally installed `node`, `deno`, or `bun` now follows the version the current project pins, instead of always running the globally installed one.

If a project pins a runtime — through [`devEngines.runtime`](/package_json#devenginesruntime), or by installing a runtime as a dependency — then running `node` inside that project uses the pinned version, while running it outside any project uses the global one. You no longer need a separate version manager to get that behavior.

The setting that controls this is [`globalShims`](/settings/other#globalshims), and the full description is in [Project-aware global bins](/global-packages#project-aware-global-bins).

## Git dependency resolution

For repositories on GitHub, GitLab, and Bitbucket, a specifier is now an **identity**, not a choice of transport. All of these name the same dependency and resolve identically:

```
kevva/is-positive
github:kevva/is-positive
git+https://github.com/kevva/is-positive.git
git+ssh://git@github.com/kevva/is-positive.git
```

Each resolves through the host's canonical HTTPS URL, and pnpm never records an SSH URL for those hosts. Which transport a given machine uses to reach the host is that machine's Git configuration, not a property of the project — so a lockfile written on a laptop with SSH keys still installs on a CI runner without them.

In pnpm 11 the resolver probed transports and could record `git@github.com:owner/repo.git`, which then failed for everyone whose machine had no key for that host. If you have such an entry in a lockfile written by an older pnpm, re-resolve those dependencies once with `pnpm update <package>` — pnpm will not rewrite the entry on its own, because the lockfile is the record of what to install.

To reach private repositories over SSH, configure the rewrite in Git rather than in the specifier:

```sh
git config --global url."git@github.com:".insteadOf https://github.com/
```

pnpm shells out to `git`, so the rewrite applies to all of its Git operations automatically. Details, including how unknown hosts and credentialed URLs are handled, are in [How Git dependencies are resolved](/package-sources#how-git-dependencies-are-resolved).

## Naming a package manager

Since v12.0.0-rc.6, pnpm installs the other package managers too — npm, Yarn Classic, Yarn Berry, Yarn 6 (`yarnpkg/zpm`) and Bun — so naming one means the tool itself rather than the npm package that shares its name.

The reason is that those npm packages are not the tool: `yarn` on npm stops at Classic, Yarn 4 is published as `@yarnpkg/cli-dist`, Yarn 6 is not on npm at all, and `node` / `deno` there are wrappers that download a build. So `pnx yarn@4 install` used to fail with a missing version, and `pnpm add -g yarn` gave you Yarn 1.

| | pnpm 11 | pnpm 12 |
|---|---|---|
| `pnpm add yarn` | installs the npm package `yarn` | records the project's package manager in `packageManager` / `devEngines.packageManager` |
| `pnpm add -g yarn` | installs Yarn Classic | installs the current Yarn line |
| `pnpm add -g node` / `pnpm add -g deno` | installs a wrapper package | installs that Node.js or Deno release |
| `pnx node@22` / `pnx deno` | runs the wrapper package | runs that release |
| a globally installed package manager | always the global copy | defers to a project's pin where there is one |

A specifier that locates a package rather than asking for a released version still installs what it names — `pnpm add yarn@npm:yarn@1.22.22`, `pnx yarn@yarnpkg/berry`.

Two more things follow from it. A git-hosted dependency is prepared with the package manager *it* asks for, so a repository built with Yarn installs on a machine that has only pnpm. And [`pnpm shim add yarn`](/cli/shim) links a `yarn` command that runs whatever version the current project pins — a shim is never created as a side effect of `pnpm setup` or an install, since it shadows the rest of your `PATH`.

The full description is in [Other package managers](/package-managers).

## Lockfiles of cyclic dependency graphs

Since v12.0.0-rc.5, pnpm breaks dependency cycles at a fixed place instead of wherever the installation happens to walk into them: the packages in a cycle are ordered by package ID, and the edges that close the cycle are always cut at the same point.

The effect is that the lockfile is a function of the dependency graph alone. Reordering the `packages` globs in `pnpm-workspace.yaml`, reordering entries in `package.json`, or simply installing twice all produce a byte-identical lockfile — in pnpm 11 they could produce different ones for a project with cyclic dependencies. Cycle-heavy workspaces also resolve peers 2–3× faster, use about 25% less memory, and get a substantially smaller lockfile, because a package inside a cycle no longer gets a separate peer variant per path that reaches it.

Existing lockfiles keep working: `--frozen-lockfile` installs consume them unchanged, and an install that doesn't re-resolve leaves them untouched. The first install that does re-resolve re-keys the peer variants of cyclic packages once, so expect a one-time lockfile diff on such projects. The details are in [How peers are resolved](/how-peers-are-resolved#cyclic-dependencies).

## `packageImportMethod: auto` hardlinks first on Linux

On Linux, the default [`packageImportMethod: auto`](/settings/node-modules#packageimportmethod) now tries a hardlink before a reflink. A reflink materializes a new inode and copies extent bookkeeping inside the filesystem's metadata trees, where a hardlink is one directory entry — on btrfs this roughly halves the time an install spends materializing `node_modules` from a warm store.

Nothing changes on ext4, where cloning was never supported and `auto` already hardlinked, and macOS keeps clone-first, because APFS `clonefile` is that platform's cheap primitive. On Linux, cloning becomes the second rung rather than the first: a store that refuses a hardlink is cloned from instead, and copied from if it refuses that too. And `packageImportMethod: clone` still asks for a clone explicitly — which is what you want if you edit files inside `node_modules`, since a hardlinked file *is* the store's file.

pnpm 11 keeps clone-first on Linux: changing what the default materializes on disk is not a point-release change.

## `engineStrict` and optional subtrees

Under [`engineStrict`](/settings/cli#enginestrict), an install now fails when an incompatible package is reached through a regular `dependencies` edge of a package that is itself being installed — even when that whole subtree hangs off an `optionalDependencies` entry. pnpm 11 installs the package and emits an install-check warning instead.

What is skipped rather than checked is unchanged in both versions: a package reachable only through optional edges, or through a package that was itself skipped, is still skipped ([#13286](https://github.com/pnpm/pnpm/issues/13286)).

## `pnpm install --resolution-only` is gone

pnpm 12 does not implement this flag and rejects it:

```
error: unexpected argument '--resolution-only' found
```

The flag existed to print out peer dependency issues. [`pnpm peers check`](/cli/peers#check) does that directly — it reads the issues from the lockfile, so it needs neither a re-resolution nor an install:

```sh
pnpm peers check
```

If you call `--resolution-only` from a CI script, this is the one change here that will stop a build rather than change a result, so it is worth grepping for before you switch.

## Trying it

`latest` on npm still points at the pnpm 11 line, so pnpm 12 is installed from the `next-12` tag. Homebrew, winget, Scoop, and Chocolatey don't offer it yet. See [Installing pnpm 12](/installation#installing-pnpm-12) for the ways to install it.

Please [report any issues](https://github.com/pnpm/pnpm/issues) you run into.
