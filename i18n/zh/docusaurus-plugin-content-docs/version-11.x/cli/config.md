---
id: config
title: pnpm config
---

别名：`c`

管理配置文件。

pnpm settings are split across two kinds of configuration files:

- **Registry and authentication settings** live in INI files — the global `rc` file and local `.npmrc` files.
- **All other pnpm settings** live in YAML files — the global `config.yaml` and the per-project `pnpm-workspace.yaml`.

The local workspace configuration file is located at the root of the project and is named `pnpm-workspace.yaml`. The global YAML configuration file (`config.yaml`) is located at:

- If the **$XDG_CONFIG_HOME** env variable is set, then **$XDG_CONFIG_HOME/pnpm/config.yaml**
- On Windows: **~/AppData/Local/pnpm/config/config.yaml**
- On macOS: **~/Library/Preferences/pnpm/config.yaml**
- On Linux: **~/.config/pnpm/config.yaml**

The global `rc` file (registry/auth settings only) is at:

- 如果设置了 **$XDG_CONFIG_HOME** 环境变量，则为 **$XDG_CONFIG_HOME/pnpm/rc**
- 在 Windows上：**~/AppData/Local/pnpm/config/rc**
- 在 macOS 上：**~/Library/preferences/pnpm/rc**
- 在 Linux上：**~/.config/pnpm/rc**

你还可以通过运行以下命令来获取全局配置文件的路径（v10.21.0 版本新增）：

```sh
pnpm config get globalconfig
```

## 命令

### set &lt;key> &lt;value>

将配置键设置为提供的值。

如果没有 `--json` 标志，它会将值解析为纯字符串：

```sh
pnpm config set --location=project nodeVersion 22.0.0
```

使用 `--json` 标志，它将值解析为 JSON：

```sh
pnpm config set --location=project --json nodeVersion '"22.0.0"'
```

`--json` 标志还允许 `pnpm config set` 创建数组和对象：

```sh
pnpm config set --location=project --json allowBuilds '{"react": true, "react-dom": true}'
pnpm config set --location=project --json catalog '{ "react": "19" }'
```

`set` 命令不接受属性路径。

### get &lt;key>

打印所提供键的配置值。

`key` 可以是一个简单的键：

```sh
pnpm config get nodeVersion
pnpm config get --json nodeVersion
pnpm config get --json packageExtensions
pnpm config get --json allowBuilds
pnpm config get --json catalog
```

它也可以是一个属性路径：

```sh
pnpm config get 'packageExtensions["@babel/parser"].peerDependencies["@babel/types"]'
pnpm config get --json 'packageExtensions["@babel/parser"].peerDependencies["@babel/types"]'
pnpm config get 'allowBuilds.react'
pnpm config get --json 'allowBuilds.react'
pnpm config get catalog.react
pnpm config get --json catalog.react
```

属性路径的语法模拟 JavaScript 属性路径。

### delete &lt;key>

从配置文件中删除配置键。

### list

显示所有配置设置。 Output is a JSON object.

Auth-related settings are hidden from the output; use `pnpm config get <key>` to read them explicitly.

:::note

Since v11, `pnpm config get` (without `--json`) no longer prints INI-formatted text. It prints JSON for objects and arrays, and raw strings for strings, numbers, booleans, and nulls. `pnpm config get --json` prints all values as JSON. `pnpm config list` always prints a JSON object.

:::

## 配置项

### --global, -g

在全局配置文件中设置配置项。

### --location

默认情况下，`--location` 设置为 `global`。

When set to `project`, pnpm writes the setting to `pnpm-workspace.yaml` at the workspace root (or, for registry/auth settings, to the `.npmrc` in the workspace root).

When set to `global`, the behavior is the same as passing the `--global` option.

### --json

让 `get` 和 `list` 以JSON 格式显示所有配置设置，并将 `set` 解析为 JSON 值。
