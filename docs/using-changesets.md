---
id: using-changesets
title: Using Changesets with pnpm
---

> At the time of writing this documentation, the latest pnpm version was v5.5.12. The latest Changesets version was v2.10.2

## Setup

To setup changesets on a pnpm workspace, install changesets as a dev dependency in the root of the workspace:

```text
pnpm add -DW @changesets/cli
```

Then run the init command of changesets:

```text
pnpx changeset init
```

## Adding new changesets

To generate a new changeset, run `pnpx changeset` in the root of the repository. The generated markdown files in the `.changeset` directory should be committed to the repository.

## Releasing changes

1. Run `pnpx changeset version`. This will bump the versions of the packages previously specified with `pnpx changeset` (and any dependents of those) and update the changelog files.
1. Run `pnpm install`. This will update the lockfile.
1. Commit the changes.
1. Run `pnpm publish -r`. This command will publish all packages that have bumped versions not yet present in the registry.

## Using GitHub Actions

To automate the process, you can use `changeset version` with GitHub actions.

In a nuthshell, the action will detect for new changesets in the `main` branch and open a Pull Request and will bump up all your packages, you could also publish your packages, more info can be read it [here](https://github.com/changesets/action).

```
name: Changesets
on:
  push:
    branches:
      - main
env:
  CI: true
  PNPM_CACHE_FOLDER: .pnpm-store
jobs:
  version:
    timeout-minutes: 15
    runs-on: ubuntu-latest
    steps:
      - name: checkout code repository
        uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: setup node.js
        uses: actions/setup-node@v2-beta
        with:
          node-version: 14
      - name: install pnpm
        run: npm i pnpm@latest -g
      - name: setup pnpm config
        run: pnpm config set store-dir $PNPM_CACHE_FOLDER
      - name: install dependencies
        run: pnpm install
      - name: create versions
        uses: changesets/action@master
        with:
          version: pnpm ci:version
          commit: 'chore: update versions'
          title: 'chore: update versions'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
