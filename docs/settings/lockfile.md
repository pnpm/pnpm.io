---
id: lockfile
title: "Lockfile Settings"
sidebar_label: "Lockfile"
---

### lockfile

* Default: **true**
* Type: **Boolean**

When set to `false`, pnpm won't read or generate a `pnpm-lock.yaml` file.

### preferFrozenLockfile

* Default: **true**
* Type: **Boolean**

When set to `true` and the available `pnpm-lock.yaml` satisfies the
`package.json` dependencies directive, a headless installation is performed. A
headless installation skips all dependency resolution as it does not need to
modify the lockfile.

### lockfileIncludeTarballUrl

* Default: **false**
* Type: **Boolean**

Add the full URL to the package's tarball to every entry in `pnpm-lock.yaml`.

### gitBranchLockfile

* Default: **false**
* Type: **Boolean**

When set to `true`, the generated lockfile name after installation will be named 
based on the current branch name to completely avoid merge conflicts. For example,
if the current branch name is `feature-foo`, the corresponding lockfile name will
be `pnpm-lock.feature-foo.yaml` instead of `pnpm-lock.yaml`. It is typically used 
in conjunction with the command line argument `--merge-git-branch-lockfiles` or by
setting `mergeGitBranchLockfilesBranchPattern` in the `pnpm-workspace.yaml` file.

### mergeGitBranchLockfilesBranchPattern

* Default: **null**
* Type: **Array or null**

This configuration matches the current branch name to determine whether to merge 
all git branch lockfile files. By default, you need to manually pass the 
`--merge-git-branch-lockfiles` command line parameter. This configuration allows 
this process to be automatically completed.

For instance:

```yaml
mergeGitBranchLockfilesBranchPattern:
- main
- release*
```

You may also exclude patterns using `!`.

### peersSuffixMaxLength

* Default: **1000**
* Type: **number**

Max length of the peer IDs suffix added to dependency keys in the lockfile. If the suffix is longer, it is replaced with a hash.
