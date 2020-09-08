---
id: version-5.5-using-changesets
title: Using Changesets with pnpm
original_id: using-changesets
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

1. Run `pnpx changeset version`. This will bump all the package versions in the monorepo and update the changelog files.
1. Run `pnpm install`. This will update the lockfile.
1. Commit the changes.
1. Run `pnpm publish -r`. This command will publish all packages that have bumped versions not yet present in the registry.