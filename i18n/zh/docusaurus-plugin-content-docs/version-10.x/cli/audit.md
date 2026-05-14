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

If you want to tolerate some vulnerabilities as they don't affect your project, you may use the [`auditConfig.ignoreCves`] setting.

[overrides]: ../settings.md#overrides
[`auditConfig.ignoreCves`]: ../settings.md#auditconfigignorecves

## 配置项

### --audit-level &lt;severity\>

- 类型：**low**, **moderate**, **hig**, **critical**
- 默认值：**low**

仅打印严重性大于或等于 "severity" 的警告。

这也可以通过 `pnpm-workspace.yaml` 中的 `auditLevel` 来设置。

### --fix

强制将不易受攻击的版本，添加覆盖到 `package.json` 文件中。

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

忽略所有没有解决方案的 CVE。

### --ignore &lt;vulnerability\>

添加于：v10.11.0

通过 CVE 编号忽略漏洞。

## 配置

### auditConfig

#### auditConfig.ignoreCves

[`pnpm audit`] 命令将忽略的 CVE ID 列表。

```yaml
auditConfig:
  ignoreCves:
    - CVE-2022-36313
```

[`pnpm audit`]: #

#### auditConfig.ignoreGhsas

[`pnpm audit`] 命令将忽略的 GHSA 代码列表。

```yaml
auditConfig:
  ignoreGhsas:
    - GHSA-42xw-2xvc-qx8m
    - GHSA-4w2v-q235-vp99
    - GHSA-cph5-m8f7-6c5x
    - GHSA-vh95-rmgr-6w4m
```
