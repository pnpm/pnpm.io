---
title: "What's different in pnpm 12"
date: 2026-08-10
slug: whats-different-in-pnpm-12
authors: zkochan
tags: [release]
---

pnpm 12 is a rewrite of pnpm in Rust, and it is currently a **release candidate**. It keeps the commands, flags, settings, and lockfile format of pnpm 11, so upgrading is not meant to be a migration — the [documentation](/installation) applies to both versions.

A short list of behaviors does differ. This post collects them in one place.

<!--truncate-->

## Project-aware global bins

A globally installed `node`, `deno`, or `bun` now follows the version the current project pins, instead of always running the globally installed one.

If a project pins a runtime — through [`devEngines`](/settings/other#devengines), or by installing a runtime as a dependency — then running `node` inside that project uses the pinned version, while running it outside any project uses the global one. You no longer need a separate version manager to get that behavior.

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

pnpm 12 is published under the `next-12` tag on npm and as a prerelease on GitHub. Homebrew, winget, Scoop, and Chocolatey don't offer it yet. See [Installing the pnpm 12 RC](/installation#installing-the-pnpm-12-rc) for the ways to install it.

Please [report any issues](https://github.com/pnpm/pnpm/issues) you run into.
