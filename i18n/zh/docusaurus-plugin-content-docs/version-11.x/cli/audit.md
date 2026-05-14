---
id: audit
title: pnpm audit
---

检查已安装程序包的已知安全问题。

如果发现安全问题，请尝试通过 `pnpm update` 更新你的依赖项。
如果简单的更新不能解决所有问题，请使用 [overrides] 强制使用不易受攻击的版本。 例如，如果 `lodash@<2.1.0` 易受攻击，可用这个 overrides 来强制使用 `lodash@^2.1.0`：

```yaml title="pnpm-workspace.yaml"
overrides:
  "lodash@<2.1.0": "^2.1.0"
```

或者运行 `pnpm audit --fix`。

If you want to tolerate some vulnerabilities as they don't affect your project, you may use the [`auditConfig.ignoreGhsas`] setting.

Since v11, `pnpm audit` queries the registry's `/-/npm/v1/security/advisories/bulk` endpoint. The response does not include CVE identifiers, so advisories are filtered by GitHub advisory ID (GHSA) instead. If you previously listed CVEs under `auditConfig.ignoreCves`, replace each entry with the corresponding `GHSA-xxxx-xxxx-xxxx` value (shown in the `More info` column of `pnpm audit` output) under `auditConfig.ignoreGhsas`.

[overrides]: ../settings.md#overrides
[`auditConfig.ignoreGhsas`]: #auditconfigignoreghsas

## 配置项

### --audit-level &lt;severity\>

- 类型：**low**, **moderate**, **hig**, **critical**
- 默认值：**low**

仅打印严重性大于或等于 "severity" 的警告。

这也可以通过 `pnpm-workspace.yaml` 中的 `auditLevel` 来设置。

### --fix

强制将不易受攻击的版本，添加覆盖到 `pnpm-workspace.yaml` 文件中。

Use `--fix=update` (added in v11.0.0) to fix vulnerabilities by updating packages in the lockfile instead of adding overrides.

When [`minimumReleaseAge`](../settings.md#minimumreleaseage) is set, `--fix` also adds the minimum patched version of each advisory to [`minimumReleaseAgeExclude`](../settings.md#minimumreleaseageexclude) in `pnpm-workspace.yaml`, so the security fix can be installed without waiting for the release age window.

### --interactive, -i

添加于：v11.0.0

Review the advisories selected by `--fix` and pick which ones to apply. Only usable together with `--fix`.

### --json

以 JSON 格式输出审查报告。

### --dev, -D

仅审查开发依赖项。

### --prod, -P

仅审查生产依赖项。

### --no-optional

不审查 `optionalDependencies`。

### --ignore-registry-errors

如果注册源响应了非 200 状态码，则进程应以 0 退出。
所以只有当注册源真正成功响应发现的漏洞时，该进程才会执行失败。

### --ignore-unfixable

添加于：v10.11.0

Ignore all advisories with no resolution.

Since v11, unfixable advisories are tracked by GHSA rather than CVE.

### --ignore &lt;vulnerability\>

添加于：v10.11.0

Ignore a vulnerability by its GitHub advisory ID (GHSA). Before v11 this flag accepted CVE identifiers.

## 配置

### auditConfig

#### auditConfig.ignoreGhsas

A list of GHSA codes that will be ignored by the [`pnpm audit`] command.

```yaml
auditConfig:
  ignoreGhsas:
    - GHSA-42xw-2xvc-qx8m
    - GHSA-4w2v-q235-vp99
    - GHSA-cph5-m8f7-6c5x
    - GHSA-vh95-rmgr-6w4m
```

Before v11, `auditConfig.ignoreCves` was used to filter advisories by CVE identifier. That setting is no longer recognized.

[`pnpm audit`]: #
