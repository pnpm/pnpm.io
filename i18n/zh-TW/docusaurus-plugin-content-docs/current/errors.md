---
id: errors
title: 錯誤碼
---

## ERR_PNPM_UNEXPECTED_STORE

有一個已存在的模組目錄並且被連結到不同的儲藏庫目錄。

如果您有意更改儲藏庫目錄，請執行 `pnpm install`，pnpm 將使用新的儲藏庫重新安裝依賴套件。

## ERR_PNPM_NO_MATCHING_VERSION_INSIDE_WORKSPACE

專案擁有工作區中不存在的工作區依賴套件。

例如，套件 `foo` 在 `dependencies` 中有 `bar@1.0.0`：

```json
{
  "name": "foo",
  "version": "1.0.0",
  "dependencies": {
    "bar": "workspace:1.0.0"
  }
}
```

然而，工作區中只有 `bar@2.0.0`，因此 `pnpm install` 將會失敗。

若要修復此問題，應更新使用 [workspace protocol][] 的所有依賴套件，以使用工作區中存在的版本。 這也可以手動完成，或是使用 `pnpm -r update` 指令。

## ERR_PNPM_PEER_DEP_ISSUES

若專案中存在未解析的對等依賴套件或是與所需範圍不符的對等依賴套件，則 `pnpm install` 將會失敗。 若要修正此問題，請安裝缺少的對等依賴套件。

You may also selectively ignore these errors using the [peerDependencyRules.ignoreMissing][] and [peerDependencyRules.allowedVersions][] settings.

## ERR_PNPM_OUTDATED_LOCKFILE

如果無法在不變更 lockfile 的情況下執行安裝，則會發生此錯誤。 這可能會在 CI 環境中發生，當有人更改了儲藏庫中的 `package.json` 檔案，而沒有執行 `pnpm install`。 或是有人忘記提交更改後的 lockfile。

若要修復此問題，只需執行 `pnpm install` 並提交更改後的 lockfile。

## ERR\_PNPM\_TARBALL\_INTEGRITY

This error indicates that the downloaded package's tarball did not match the expected integrity checksum.

If you use the npm registry (`registry.npmjs.org`), then this probably means that the integrity in your lockfile is incorrect. This might happen if a lockfile had badly resolved merge conflicts.

If you use a registry that allows to override existing versions of a package, then it might mean that in your local metadata cache you have the integrity checksum of an older version of the package. In this case, you should run `pnpm store prune`. This command will remove your local metadata cache. Then you can retry the command that failed.

But also be careful and verify that the package is downloaded from the right URL. The URL should be printed in the error message.

## ERR_PNPM_MISMATCHED_RELEASE_CHANNEL

The config field `use-node-version` defines a release channel different from version suffix.

範例：
* `rc/20.0.0` defines an `rc` channel but the version is that of a stable release.
* `release/20.0.0-rc.0` defines a `release` channel but the version is that of an RC release.

To fix this error, either remove the release channel prefix or correct the version suffix.

Note that it is not allowed to specify node versions like `lts/Jod`. The correct syntax for stable release is strictly X.Y.Z or release/X.Y.Z.

## ERR_PNPM_INVALID_NODE_VERSION

The value of config field `use-node-version` has an invalid syntax.

Below are the valid forms of `use-node-version`:
* Stable release:
  * `X.Y.Z` (`X`, `Y`, `Z` are integers)
  * `release/X.Y.Z` (`X`, `Y`, `Z` are integers)
* RC release:
  * `X.Y.Z-rc.W` (`X`, `Y`, `Z`, `W` are integers)
  * `rc/X.Y.Z-rc.W` (`X`, `Y`, `Z`, `W` are integers)

[workspace protocol]: ./workspaces.md#workspace-protocol-workspace

[peerDependencyRules.ignoreMissing]: settings#peerdependencyrulesignoremissing
[peerDependencyRules.allowedVersions]: settings#peerdependencyrulesallowedversions
