---
id: version
title: pnpm version
---

Added in: v11.0.0

Bump the package version.

```sh
pnpm version <major|minor|patch|premajor|preminor|prepatch|prerelease|from-git|[semver]>
```

This command bumps the version in `package.json` according to the specified increment. It supports workspaces and the `workspace:` protocol, ensuring that cross-references between workspace packages are updated correctly.

## Usage

```sh
pnpm version patch
pnpm version minor
pnpm version major
pnpm version 2.0.0
```

## Options

### --preid &lt;prerelease-id\>

The "prerelease identifier" to use as a prefix for the prerelease part of a semver.

```sh
pnpm version prerelease --preid beta
```

### --no-git-tag-version

Do not commit or tag the version change.

### --no-commit-hooks

Do not run git commit hooks when committing the version change.

### --sign-git-tag

Sign the version tag with GPG.

### --allow-same-version

Allow setting the version to the current version. This can be useful for CI pipelines.
