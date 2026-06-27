---
id: configuring
title: 配置
---

pnpm 设置分为两类：

- **Authentication and certificate settings** are stored in INI files. 这些文件包含敏感凭据，不应提交到你的仓库。 See [Authentication Settings](./npmrc.md#auth-file-locations) for details.
- **All other settings** are stored in YAML files: the project `pnpm-workspace.yaml` and the global `config.yaml`.

pnpm also no longer reads settings from the `pnpm` field of `package.json`. Settings should be defined in `pnpm-workspace.yaml`.

## 本地项目配置

Project-level settings go in `pnpm-workspace.yaml`:

```yaml title="pnpm-workspace.yaml"
nodeVersion: "22"
saveExact: true
```

## 全局配置

The global YAML config file (`config.yaml`) is located at one of the following paths:

- If the **$XDG_CONFIG_HOME** env variable is set, then **$XDG_CONFIG_HOME/pnpm/config.yaml**
- On Windows: **~/AppData/Local/pnpm/config/config.yaml**
- On macOS: **~/Library/Preferences/pnpm/config.yaml**
- On Linux: **~/.config/pnpm/config.yaml**

The global `rc` file (for registry and auth settings only) is at:

- 如果设置了 **$XDG_CONFIG_HOME** 环境变量，则为 **$XDG_CONFIG_HOME/pnpm/rc**
- 在 Windows上：**~/AppData/Local/pnpm/config/rc**
- 在 macOS 上：**~/Library/preferences/pnpm/rc**
- 在 Linux上：**~/.config/pnpm/rc**

## 环境变量

Environment variables whose names start with `pnpm_config_` (or `PNPM_CONFIG_`) are loaded into configuration. These override settings from `pnpm-workspace.yaml` but not CLI arguments.

:::warning

pnpm no longer reads `npm_config_*` environment variables. Use `pnpm_config_*` environment variables instead (e.g., `pnpm_config_registry` instead of `npm_config_registry`).

:::

示例：

```sh
pnpm_config_save_exact=true pnpm add foo
```

如果你需要 pnpm 跨多个硬盘或文件系统工作，
请阅读[常见问题解答][the FAQ]。

See the [`config` command] for more information on managing configuration.

[the FAQ]: ./faq.md#does-pnpm-work-across-multiple-drives-or-filesystems
[`config` command]: ./cli/config.md
