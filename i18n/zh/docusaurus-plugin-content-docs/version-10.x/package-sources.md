---
id: package-sources
title: 支持的软件包来源
---

pnpm 支持从各种来源安装软件包。 这些来源分为两类：**可信来源** 和 **外来来源** 。

使用外来来源（例如 Git 仓库或直接 tarball URL）时，传递依赖项可能会引入依赖链风险。 你可以通过将 [`blockExoticSubdeps`] 设置为 `true` 来阻止传递依赖项使用外来来源。

[`blockExoticSubdeps`]: ./settings.md#blockexoticsubdeps

## 可信来源

可信来源对于直接依赖和传递依赖都被认为是安全的。

### npm 源

`pnpm add package-name` 默认会从 [npm 源](https://www.npmjs.com/)安装 `package-name` 的最新版本。

如果在工作空间中执行，该命令将首先去检查这个工作空间中的其他项目是否已经使用了这个指定的包。 如果是，已经使用过的版本范围将被安装。

你还可以通过以下方式安装包：

- 标签：`pnpm add express@nightly`
- 版本：`pnpm addexpress@1.0.0`
- 版本范围：`pnpm add express@2 react@">=0.1.0 <0.2.0"`

### JSR 源

添加于：v10.9.0

使用 jsr: 协议前缀从JSR 注册源安装：

```
pnpm add jsr:@hono/hono
pnpm add jsr:@hono/hono@4
pnpm add jsr:@hono/hono@latest
```

这和从 npm 安装的方式类似，只是告诉 pnpm 通过 JSR 解析包。

### 工作空间（Workspace）

请注意，当添加依赖项并在 [工作区][workspace] 中工作时，软件包
将从配置的源安装，具体取决于是否设置了 [`linkWorkspacePackages`]，以及是否使用了 [`workspace: 范围协议`][`workspace: range protocol`]。

[workspace]: ./workspaces.md
[`linkWorkspacePackages`]: ./settings.md#linkworkspacepackages
[`workspace: range protocol`]: ./workspaces.md#workspace-protocol-workspace

### 本地文件系统

有两种方法可以从本地文件系统安装：

1. 从 tar 压缩包文件（`.tar`、`.tar.gz` 或 `.tgz`）
2. 从目录

示例：

```sh
pnpm add ./package.tar.gz
pnpm add ./some-directory
```

当你从目录安装时，会在当前项目的`node_modules` 目录中生成一个符号链接，因此这和执行 `pnpm link` 一致。

## 外来来源

外来来源对开发很有用，但当被传递依赖关系使用时，可能会带来供应链风险。

### 远程 tarball

参数必须是一个可访问的 URL，以 "http://" 或 "https://" 开头。

示例：

```sh
pnpm add https://github.com/indexzero/forever/tarball/v0.5.6
```

### Git 仓库

```sh
pnpm add <git remote url>
```

从托管的 Git 提供商安装软件包，并使用 Git 克隆它。

你可以通过以下方式从 Git 安装软件包：

- 来自默认分支的最新提交：

```
pnpm add kevva/is-positive
```

- Git 提交哈希：

```
pnpm add kevva/is-positive#97edff6f525f192a3f83cea1944765f769ae2678
```

- Git 分支：

```
pnpm add kevva/is-positive#master
```

- 相对于 refs 的 Git 分支：

```
pnpm add zkochan/is-negative#heads/canary
```

- Git 标签：

```
pnpm add zkochan/is-negative#2.0.1
```

- v 前缀的 Git 标签：

```
pnpm add andreineculau/npm-publish-git#v0.0.7
```

#### 使用语义版本从 Git 存储库安装

你可以使用 `semver:` 参数指定要安装的版本（范围）。 示例：

- 严格的语义版本：

```
pnpm add zkochan/is-negative#semver:1.0.0
```

- v 前缀的严格语义版本：

```
pnpm add andreineculau/npm-publish-git#semver:v0.0.7
```

- 语义版本范围：

```
pnpm add kevva/is-positive#semver:^2.0.0
```

- v 前缀的语义版本范围：

```
pnpm add andreineculau/npm-publish-git#semver:<=v0.0.7
```

#### 从 Git 存储库的子目录安装

你也可以使用 `path:` 参数从 Git 托管的 monorepo 中仅安装子目录。 例如：

```
pnpm add RexSkz/test-git-subfolder-fetch#path:/packages/simple-react-app
```

#### 通过完整 URL 从 Git 存储库安装

如果你想要更明确或使用其他 Git 托管，你可能需要拼出完整的 Git URL：

```
# git+ssh
pnpm add git+ssh://git@github.com:zkochan/is-negative.git#2.0.1

# https
pnpm add https://github.com/zkochan/is-negative.git#2.0.1
```

#### 使用托管提供商简写从 Git 存储库安装

你可以使用协议简写 `[provider]:` 来表示某些 Git 提供商：

```
pnpm add github:zkochan/is-negative
pnpm add bitbucket:pnpmjs/git-resolver
pnpm add gitlab:pnpm/git-resolver
```

如果省略 `[provider]:`，则默认为 `github`:。

#### 结合不同参数从 Git 存储库安装

可以通过用 `&` 分隔来组合多个参数。 这对于 monorepo 的分叉是有用的：

```
pnpm add RexSkz/test-git-subdir-fetch.git#beta\&path:/packages/simple-react-app
```

从`beta` 分支安装，并仅安装 `/packages/simple-react-app` 子目录。
