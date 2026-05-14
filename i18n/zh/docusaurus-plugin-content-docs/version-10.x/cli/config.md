---
id: config
title: pnpm config
---

别名：`c`

管理配置文件。

配置文件为 INI (全局) 和 YAML (本地) 格式。

本地配置文件位于项目的根目录中，名为 pnpm-workspace.yaml。

全局配置文件位于以下位置之一：

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
pnpm config set --location=project --json onlyBuiltDependencies '["react", "react-dom"]'
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
pnpm config get --json onlyBuiltDependencies
pnpm config get --json catalog
```

它也可以是一个属性路径：

```sh
pnpm config get 'packageExtensions["@babel/parser"].peerDependencies["@babel/types"]'
pnpm config get --json 'packageExtensions["@babel/parser"].peerDependencies["@babel/types"]'
pnpm config get 'onlyBuiltDependencies[0]'
pnpm config get --json 'onlyBuiltDependencies[0]'
pnpm config get catalog.react
pnpm config get --json catalog.react
```

属性路径的语法模拟 JavaScript 属性路径。

### delete &lt;key>

从配置文件中删除配置键。

### list

显示所有配置设置。

## 配置项

### --global, -g

在全局配置文件中设置配置项。

### --location

默认情况下，`--location` 设置为 `global`。

当设置为 `project` 时，将使用最接近的 `package.json` 下的 `.npmrc` 文件。 如果目录中不存在 .npmrc 文件，则设置将被写入 pnpm-workspace.yaml 文件。

当设置为 `global` 时，性能与设置 `--global` 选项相同。

### --json

让 `get` 和 `list` 以JSON 格式显示所有配置设置，并将 `set` 解析为 JSON 值。
