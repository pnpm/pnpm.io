---
id: errors
title: 错误码
---

## ERR_PNPM_UNEXPECTED_STORE

模块目录存在并链接到了不同的存储目录。

如果你有意更改了存储目录，请运行 `pnpm install` ，pnpm 将使用新存储重新安装依赖。

## ERR_PNPM_NO_MATCHING_VERSION_INSIDE_WORKSPACE

项目具有工作空间中不存在的工作空间依赖。

例如，包 `foo` 在 `dependencies` 中拥有 `bar@1.0.0`：

```json
{
  "name": "foo",
  "version": "1.0.0",
  "dependencies": {
    "bar": "workspace:1.0.0"
  }
}
```

但是，工作区中只有 `bar@2.0.0`，所以 `pnpm install` 将失败。

要修复此错误，所有使用 [工作空间协议][] 的依赖项需要被更新至当前工作空间中的版本。 这可以手动完成，也可以使用 `pnpm -r update` 命令完成。

## ERR_PNPM_PEER_DEP_ISSUES

项目具有未解析的对等依赖关系或对等依赖关系与所需范围不匹配，那么 `pnpm install` 将失败。 要解决此问题，请安装缺少的对等依赖项。

您也可以使用 [peerDependencyRules.ignoreMissing][] 和 [peerDependencyRules.allowedVersions][] 设置选择性忽略这些错误。

## ERR_PNPM_OUTDATED_LOCKFILE

如果不更改锁文件无法执行安装，则会发生此错误。 如果有人更改了存储库中的 `package.json` 文件，之后没有运行 `pnpm install`，这可能会发生在 CI 环境中。 或者有人忘记提交锁文件的更改。

要修复此错误，只需运行 `pnpm install` 并将锁文件的变更提交。

## ERR\_PNPM\_TARBALL\_INTEGRITY

此错误表示下载的软件包的 tarball 与预期的完整性校验和不匹配。

如果使用 npm 注册源 (`registry.npmjs.org`)，那么这可能意味着锁文件中的完整性不正确。 如果锁文件解析时错误地合并冲突，则可能会发生这种情况。

如果使用允许覆盖包的现有版本的注册源，则可能意味着在本地元数据缓存中有旧版本软件包的完整性校验。 在这种情况下，你应该运行 `pnpm store prune`。 此命令将删除你的本地元数据缓存。 然后你可以重试失败的命令。

但是也要小心并验证软件包是否从正确的 URL 下载。 错误消息中应该打印 URL。

## ERR_PNPM_MISMATCHED_RELEASE_CHANNEL

配置字段 `use-node-version` 定义了与版本后缀不同的发布通道。

示例：
* `rc/20.0.0` 定义了 `rc` 通道，但版本是稳定版本。
* `release/20.0.0-rc.0` 定义了 `release` 通道，但版本是 RC 版本。

要修复此错误，请删除发布通道前缀或更正版本后缀。

请注意，不允许指定像 `lts/Jod`这样的 Node 版本。 稳定版本的正确语法是严格的 X.Y.Z 或 release/X.Y.Z。

## ERR_PNPM_INVALID_NODE_VERSION

配置字段 `use-node-version` 的值具有无效语法。

以下是 `use-node-version` 的有效形式：
* 稳定版
  * `X.Y.Z`（`X`， `Y`， `Z` 都是整数）
  * `release/X.Y.Z`（`X`， `Y`， `Z` 都是整数）
* RC 版本：
  * `X.Y.Z-rc.W`（`X`, `Y`, `Z` 都是整数）
  * `rc/X.Y.Z-rc.W`（`X`, `Y`, `Z` 都是整数）

[工作空间协议]: ./workspaces.md#workspace-protocol-workspace

[peerDependencyRules.ignoreMissing]: settings#peerdependencyrulesignoremissing
[peerDependencyRules.allowedVersions]: settings#peerdependencyrulesallowedversions
