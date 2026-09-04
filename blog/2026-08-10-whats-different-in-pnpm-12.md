---
title: "What's different in pnpm 12"
date: 2026-08-10
slug: whats-different-in-pnpm-12
authors: zkochan
tags: [release]
---

pnpm 12 is a rewrite of pnpm in Rust, and it is stable. Upgrading should not feel like a migration. Apart from the differences below, it keeps the commands, flags, settings, and lockfile format of pnpm 11, and [the documentation](/motivation) applies to both versions.

Seven things differ. Six of them change a result, and one, a removed flag, fails outright. This post collects them in one place.

<!--truncate-->

## Project-aware global bins

A globally installed `node`, `deno`, or `bun` now runs the version the current project pins.

A project pins a runtime through [`devEngines.runtime`](/package_json#devenginesruntime) or by installing the runtime as a dependency. Run `node` inside that project and you get the pinned version. Run it outside any project and you get the global one. You no longer need a separate version manager for this.

The setting that controls this is [`globalShims`](/settings/other#globalshims), and the full description is in [Project-aware global bins](/global-packages#project-aware-global-bins).

## Git dependency resolution

For repositories on GitHub, GitLab, and Bitbucket, a specifier now only says which repository you want, not how to reach it. All of these name the same dependency and resolve the same way:

```
kevva/is-positive
github:kevva/is-positive
git+https://github.com/kevva/is-positive.git
git+ssh://git@github.com/kevva/is-positive.git
```

Each resolves through the host's HTTPS URL, and pnpm never records an SSH URL for those hosts. How a machine reaches the host is that machine's Git configuration, not something the project decides. A lockfile written on a laptop with SSH keys installs on a CI runner without them.

pnpm 11 tried transports in turn and could record `git@github.com:owner/repo.git`, which then failed for everyone without a key for that host. If an older lockfile has such an entry, run `pnpm update <package>` once to re-resolve it. pnpm does not rewrite the entry on its own. The lockfile is the record of what to install, and pnpm leaves it alone until you ask.

To reach private repositories over SSH, tell Git to rewrite the URL:

```sh
git config --global url."git@github.com:".insteadOf https://github.com/
```

pnpm shells out to `git`, so the rewrite applies to every Git operation pnpm runs. Unknown hosts and URLs with embedded credentials are covered in [How Git dependencies are resolved](/package-sources#how-git-dependencies-are-resolved).

## Naming a package manager

pnpm 12 can install the other package managers: npm, Yarn Classic, Yarn Berry, Yarn 6 (`yarnpkg/zpm`), and Bun. As a result, naming one of them means the tool, not the npm package that shares its name.

Those npm packages are not the tool. `yarn` on npm stops at Classic. Yarn 4 is published as `@yarnpkg/cli-dist`. Yarn 6 is not on npm at all. `node` and `deno` on npm are wrappers that download a build. So `pnx yarn@4 install` used to fail with a missing version, and `pnpm add -g yarn` gave you Yarn 1.

| | pnpm 11 | pnpm 12 |
|---|---|---|
| `pnpm add yarn` | installs the npm package `yarn` | records the project's package manager in `packageManager` / `devEngines.packageManager` |
| `pnpm add -g yarn` | installs Yarn Classic | installs the current Yarn line |
| `pnpm add -g node` / `pnpm add -g deno` | installs a wrapper package | installs that Node.js or Deno release |
| `pnx node@22` / `pnx deno` | runs the wrapper package | runs that release |
| a globally installed package manager | always the global copy | defers to a project's pin where there is one |

A specifier that points at a specific package still installs that package. `pnpm add yarn@npm:yarn@1.22.22` gives you the npm package, and `pnx yarn@yarnpkg/berry` runs Yarn from its repository.

Two more things follow. A git-hosted dependency is built with the package manager its own repository asks for, so a repository that uses Yarn installs on a machine that has only pnpm. And [`pnpm shim add yarn`](/cli/shim) links a `yarn` command that runs whatever version the current project pins. pnpm never creates such a shim as a side effect of `pnpm setup` or an install, because the shim shadows the rest of your `PATH`.

The full description is in [Other package managers](/package-managers).

## Lockfiles of cyclic dependency graphs

pnpm 12 breaks dependency cycles at a fixed place. It orders the packages in a cycle by package ID and always cuts the same edge, no matter where the install entered the cycle. pnpm 11 cut wherever it happened to walk in.

The lockfile now depends only on the dependency graph. Reorder the `packages` globs in `pnpm-workspace.yaml`, reorder entries in `package.json`, or install twice, and you get the same bytes. In pnpm 11 a project with cycles could get a different lockfile each time. Workspaces with many cycles also resolve peers 2–3× faster and use about 25% less memory. Their lockfiles shrink too, because a package inside a cycle no longer gets a separate peer variant for every path that reaches it.

Existing lockfiles keep working. `--frozen-lockfile` installs them as they are, and an install that doesn't re-resolve leaves them untouched. The first install that does re-resolve rewrites the peer variants of cyclic packages, so expect a one-time lockfile diff. Details in [How peers are resolved](/how-peers-are-resolved#cyclic-dependencies).

## `packageImportMethod: auto` hardlinks first on Linux

On Linux, the default [`packageImportMethod: auto`](/settings/node-modules#packageimportmethod) now tries a hardlink before a reflink. Hardlinks are cheaper to create, and on btrfs this roughly halves the time an install spends materializing `node_modules` from a warm store.

Cloning is still the second choice. A store that refuses a hardlink gets a clone, and a store that refuses that too gets a copy. `packageImportMethod: clone` still asks for a clone outright. Pick that if you edit files inside `node_modules`, because a hardlinked file is the store's file. Nothing changes on ext4, which never supported cloning, so `auto` already hardlinked there. macOS keeps clone-first because APFS `clonefile` is fast.

pnpm 11 keeps clone-first on Linux. Changing what the default writes to disk is not something for a point release.

## `engineStrict` and optional subtrees

With [`engineStrict`](/settings/cli#enginestrict) on, pnpm 12 fails the install when a package that is being installed depends, through regular `dependencies`, on a package with an incompatible engine. It no longer matters that the whole subtree sits under an `optionalDependencies` entry. pnpm 11 installs the package and prints an install-check warning.

What gets skipped has not changed. A package reachable only through optional edges, or through a package that was itself skipped, is still skipped in both versions ([#13286](https://github.com/pnpm/pnpm/issues/13286)).

## `pnpm install --resolution-only` is gone

pnpm 12 does not implement this flag and rejects it:

```
error: unexpected argument '--resolution-only' found
```

The flag existed to print peer dependency issues. [`pnpm peers check`](/cli/peers#check) does that instead. It reads the issues from the lockfile, so it needs neither a re-resolution nor an install:

```sh
pnpm peers check
```

If a CI script calls `--resolution-only`, this is the one change on this page that stops a build instead of changing a result. Grep for it before you switch.

## Trying it

`latest` on npm still points at the pnpm 11 line, so install pnpm 12 from the `latest-12` tag. Homebrew, winget, Scoop, and Chocolatey don't offer it yet. [Installing pnpm 12](/installation) lists the ways to install it.

Please [report any issues](https://github.com/pnpm/pnpm/issues) you run into.
