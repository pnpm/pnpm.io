---
id: version
title: pnpm version
---

添加于：v11.0.0

更新软件包版本。

```sh
pnpm version <newversion>
pnpm version <major|minor|patch|premajor|preminor|prepatch|prerelease|from-git>
```

`<newversion>` can be any of the bump types above or an explicit semver version (e.g. `1.2.3`). Workspaces and the `workspace:` protocol are supported, so cross-references between workspace packages are updated correctly.

When run inside a git repository, `pnpm version` creates a git commit and an annotated tag for the bump. The working tree must be clean (see `--no-git-checks` below) and commits/tags can be disabled with `--no-git-tag-version`. Git commits and tags are always skipped in recursive mode because multiple packages may be bumped to different versions in a single run.

## 使用方法

```sh
pnpm version patch
pnpm version minor
pnpm version major
pnpm version 2.0.0
pnpm version prerelease --preid beta
```

## 配置项

### --preid &lt;prerelease-id\>

用作语义版本号中预发布部分前缀的“预发布标识符”。

```sh
pnpm version prerelease --preid beta
```

### --message, -m &lt;message\>

Commit message. Any `%s` in the message is replaced with the new version. Defaults to `%s`.

```sh
pnpm version patch --message "chore: release v%s"
```

### --tag-version-prefix &lt;prefix\>

Prefix used when creating the git tag. Defaults to `v` (e.g. `v1.2.3`). Set to an empty string to drop the prefix entirely.

### --no-git-tag-version

Do not create a git commit or tag for the version change.

### --no-commit-hooks

Skip git commit hooks (`--no-verify`) when committing the version bump.

### --sign-git-tag

Sign the generated git tag with GPG (`git tag -s`).

### --no-git-checks

Do not check whether the working tree is clean before bumping the version.

### --allow-same-version

允许将版本设置为当前版本。 这对于持续集成（CI）流水线非常有用。

### --recursive, -r

Apply the version bump to every package in the workspace (optionally narrowed with `--filter`). Git commit and tag creation are skipped in recursive mode.

### --json

Output the list of bumped packages in JSON format.
