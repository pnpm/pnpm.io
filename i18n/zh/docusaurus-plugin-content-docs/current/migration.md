---
id: migration
title: 从 v10 迁移到 v11
---

pnpm v11 对配置的读取方式和可用设置引入了几个重大变更。 大多数配置更改都是机械性的，可以通过代码修改来实现；其余的则需要人工干预。 当从 v10 安装运行 `pnpm self-update 11` 时，pnpm 会打印指向此页面的指针。

## 运行代码转换

```sh
cd /path/to/your/project
pnpx codemod run pnpm-v10-to-v11
# 或
pnpm add --global codemod
codemod run pnpm-v10-to-v11
```

代码转换会自动应用以下功能：

- **将设置从 `package.json#pnpm` 移至 `pnpm-workspace.yaml`**。 在 v11 版本中，pnpm 不再从 `package.json` 中的 `pnpm` 字段读取配置。
- 将 `.npmrc` 拆分为身份验证/注册表和其他所有内容。 v11 仅从 `.npmrc` 读取身份验证和注册表设置。 其他所有设置（`hoist-pattern`、`node-linker`、`save-exact`、 …） 已移至 `pnpm-workspace.yaml` 中，并使用驼峰命名法键。 每个子项目的 `.npmrc` 文件位于 `packageConfigs["<project-name> "]` 下。
- **将构建依赖项设置合并到 `allowBuilds` 中**。 `onlyBuiltDependencies`、`neverBuiltDependencies`、`ignoredBuiltDependencies` 和 `onlyBuiltDependenciesFile` 合并为一个 `allowBuilds` 映射（`{ name: true | false }`）。
- **将包管理器严格性设置替换为 `pmOnFail`**。 `managePackageManagerVersions`、`packageManagerStrict` 和 `packageManagerStrictVersion` 合并为一个 `pmOnFail: download | ignore | warn | error` 设置。
- **重命名** `allowNonAppliedPatches` → `allowUnusedPatches`，以及 `auditConfig.ignoreCves` → `auditConfig.ignoreGhsas`（键名已重命名；CVE ID 仍需手动转换为 GHSA ID — 请参见下文）。
- 将 `useNodeVersion` 转换为根 `package.json` 中的 `devEngines.runtime` 条目。
- 将 `package.json` 中的 `packageManager` 版本升级到目标 pnpm v11 版本。

## 手动后续行动

以下变更无法自动完成，需要人工干预：

- **CVE → GHSA**。 `auditConfig.ignoreCves` 已重命名为 `auditConfig.ignoreGhsas`。 将每个 `CVE-YYYY-NNNNN` 条目替换为匹配的 `GHSA-xxxx-xxxx-xxxx` ID（在 `pnpm audit` 输出的“更多信息”列中可见）。
- **`ignorePatchFailures`** 已被移除。 现在所有失败的补丁都会抛出异常；请修复补丁或移除依赖项。
- 工作区子包的 `package.json#pnpm` 中的 **`executionEnv.nodeVersion`** 将被移除。 请改用该子包的 `devEngines.runtime` 来声明运行时环境。
- 不再读取 **`npm_config_*` 环境变量**。 无论在何处设置它们（CI 配置、shell 配置文件、Docker 镜像），都应将它们重命名为 `pnpm_config_*`。
- **`pnpm link <pkg-name>`** 不再解析全局存储中的包。 使用相对路径或绝对路径（`pnpm link ./foo`）。
- 不再支持不带参数的 `pnpm install -g` 命令。 请改用 `pnpm add -g <pkg>`。
- **`pnpm server`** 已被移除，且没有替代方案。
- **脚本名称会掩盖内置命令**。 如果你的 `package.json` 定义了名为 `clean`、`setup`、`deploy` 或 `rebuild` 的脚本，则 `pnpm <name>` 现在会运行该脚本而不是内置命令。 使用 [`pnpm pm <name>`](./cli/pm.md) 强制使用内置命令。

有关所有重大变更的完整列表，请参阅 [v11 变更日志](https://github.com/pnpm/pnpm/blob/main/pnpm/CHANGELOG.md)。
