---
id: git_branch_lockfiles
title: Git Branch Lockfiles
---

Git 分支锁文件允许你完全避免锁文件合并冲突并稍后解决。

## 使用 Git 分支锁文件

你可以通过配置 `pnpm-workspace.yaml` 文件来打开此功能。

```yaml
gitBranchLockfile: true
```

通过这样做，锁文件的名称将根据当前 Git 分支名称生成。

例如，当前分支名称是 `feature-1`。 那么，生成的锁文件名称就会是 `pnpm-lock.feature-1.yaml`。 你可以将其提交到 Git，并稍后合并所有 Git 分支锁文件。

```
- <project_folder>
|- pnpm-lock.yaml
|- pnpm-lock.feature-1.yaml
|- pnpm-lock.<branch_name>.yaml
```

:::note

`feature/1` 的特殊之处在于 `/` 会自动转换为 `!`，因此相应的锁文件名将是 `pnpm-lock.feature!1.yaml`。

:::

## 合并 Git 分支锁文件

### `pnpm install --merge-git-branch-lockfiles`

要合并所有 Git 分支锁文件，只需指定 `--merge-git-branch-lockfiles` 到 `pnpm install` 命令。

此后，所有 Git 分支锁文件将合并到一个 `pnpm-lock.yaml`

### 分支匹配

pnpm 允许你通过匹配当前分支名称指定 `--merge-git-branch-lockfiles` 。

例如，通过 `pnpm-workspace.yaml` 文件中的以下设置，当
在 `main` 分支中运行时，`pnpm install` 将会合并所有 git 分支锁文件，并且分支名称以 `release` 开头。

```yaml
mergeGitBranchLockfilesBranchPattern:
- main
- release*
```
