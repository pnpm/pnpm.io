---
id: configuring
title: 配置
---

pnpm 设置分为两类：

- **身份验证和证书设置** 存储在 INI 文件中。 这些文件包含敏感凭据，不应提交到你的仓库。 参阅 [身份验证设置](./npmrc.md#auth-file-locations) 了解详情。
- **所有其他设置** 都存储在 YAML 文件中：项目 `pnpm-workspace.yaml` 和全局 `config.yaml`。

pnpm 也不再读取 `pnpm` `package.json` 的设置。 设置应在 `pnpm-workspace.yaml` 中定义。

## 本地项目配置

项目级设置位于 `pnpm-workspace.yaml`：

```yaml title="pnpm-workspace.yaml"
nodeVersion: "22"
saveExact: true
```

## 全局配置

全局 YAML 配置文件（`config.yaml`）位于以下路径之一：

* 如果设置了 **$XDG_CONFIG_HOME** 环境变量，则为 **$XDG_CONFIG_HOME/pnpm/config.yaml**
* 在 Windows 系统上： **~/AppData/Local/pnpm/config/config.yaml**
* 在 macOS 上： **~/Library/Preferences/pnpm/config.yaml**
* 在 Linux 系统上： **~/.config/pnpm/config.yaml**

全局 `rc` 文件（仅用于注册源和身份验证设置）位于：

* 如果设置了 **$XDG_CONFIG_HOME** 环境变量，则为 **$XDG_CONFIG_HOME/pnpm/rc**
* 在 Windows 上：**~/AppData/Local/pnpm/config/rc**
* 在 macOS 上：**~/Library/Preferences/pnpm/rc**
* 在 Linux 上：**~/.config/pnpm/rc**

## 环境变量

名称以 `pnpm_config_` （或 `PNPM_CONFIG_`）开头的环境变量将被加载到配置中。 这些会覆盖 `pnpm-workspace.yaml` 中的设置，但不会覆盖 CLI 参数。

:::warning

pnpm 不再读取 `npm_config_*` 环境变量。 请改用 `pnpm_config_*` 环境变量（例如， `pnpm_config_registry` 而不是 `npm_config_registry`）。

:::

示例：

```sh
pnpm_config_save_exact=true pnpm add foo
```

如果你需要 pnpm 跨多个硬盘或文件系统工作， 请阅读 [常见问题解答][]。

有关管理配置的更多信息，请参阅 [`配置` 命令][]。

[常见问题解答]: ./faq.md#does-pnpm-work-across-multiple-drives-or-filesystems
[`配置` 命令]: ./cli/config.md
