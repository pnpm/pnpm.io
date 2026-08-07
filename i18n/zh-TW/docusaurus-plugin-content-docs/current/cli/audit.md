---
id: audit
title: pnpm audit
---

在已安裝的套件中檢查已知的安全性問題。

如果有發現安全性問題，請嘗試透過 `pnpm update` 來更新您的套件。 If a simple update does not fix all the issues, use [overrides][] to force versions that are not vulnerable. 例如，若 `lodash@<2.1.0` 已容易受到攻擊，可使用 overrides 強制使用 `lodash@^2.1.0` ：

```yaml title="pnpm-workspace.yaml"
overrides:
  "lodash@<2.1.0": "^2.1.0"
```

或是，執行 `pnpm audit --fix`。

If you want to tolerate some vulnerabilities as they don't affect your project, you may use the [`auditConfig.ignoreGhsas`][] setting.

Since v11, `pnpm audit` queries the registry's `/-/npm/v1/security/advisories/bulk` endpoint. The response does not include CVE identifiers, so advisories are filtered by GitHub advisory ID (GHSA) instead. If you previously listed CVEs under `auditConfig.ignoreCves`, replace each entry with the corresponding `GHSA-xxxx-xxxx-xxxx` value (shown in the `More info` column of `pnpm audit` output) under `auditConfig.ignoreGhsas`.

## 選項

### --audit-level &lt;severity\>

* 種類： **low**, **moderate**, **high**, **critical**
* 預設： **low**

只顯示嚴重性大於或等於 `<severity>` 的警告。

This can also be set via `auditLevel` in `pnpm-workspace.yaml`.

### --fix

Add overrides to the `pnpm-workspace.yaml` file in order to force non-vulnerable versions of the dependencies.

Use `--fix=update` (added in v11.0.0) to fix vulnerabilities by updating packages in the lockfile instead of adding overrides.

When [`minimumReleaseAge`](../settings.md#minimumreleaseage) is set, `--fix` also adds the minimum patched version of each advisory to [`minimumReleaseAgeExclude`](../settings.md#minimumreleaseageexclude) in `pnpm-workspace.yaml`, so the security fix can be installed without waiting for the release age window.

### --interactive, -i

Added in: v11.0.0

Review the advisories selected by `--fix` and pick which ones to apply. Only usable together with `--fix`.

### --json

以 JSON 格式輸出檢查報告。

### --dev, -D

僅檢查開發中 dev 的依賴套件。

### --prod, -P

僅檢查實際 production 的依賴套件。

### --no-optional

不要檢查 `optionalDependencies`。

### --ignore-registry-errors

如果依賴套件registry 以非 Http 狀態碼 200 進行回應，則進程應以 0 退出。 因此，只有在registry已順利回應發現的漏洞時，程序才會退出。

### --ignore-unfixable

Added in: v10.11.0

Ignore all advisories with no resolution.

Since v11, unfixable advisories are tracked by GHSA rather than CVE.

### --ignore &lt;vulnerability\>

Added in: v10.11.0

Ignore a vulnerability by its GitHub advisory ID (GHSA). Before v11 this flag accepted CVE identifiers.

## 設定

### auditConfig

#### auditConfig.ignoreGhsas

A list of GHSA codes that will be ignored by the [`pnpm audit`][] command.

```yaml
auditConfig:
  ignoreGhsas:
    - GHSA-42xw-2xvc-qx8m
    - GHSA-4w2v-q235-vp99
    - GHSA-cph5-m8f7-6c5x
    - GHSA-vh95-rmgr-6w4m
```

Before v11, `auditConfig.ignoreCves` was used to filter advisories by CVE identifier. That setting is no longer recognized.

[overrides]: ../settings.md#overrides
[`auditConfig.ignoreGhsas`]: #auditconfigignoreghsas

[`pnpm audit`]: #
