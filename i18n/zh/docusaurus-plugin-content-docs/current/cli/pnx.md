---
id: pnx
title: pnx
---

别名：`pnpm dlx`、`pnpx`

从注册源中获取软件包而不将其安装为依赖项，热加载它，并运行它暴露的任何默认命令二进制文件。

例如，若要在任何地方使用 create-vue 来初始化一个 Vue 项目，而不想在另一个项目下安装它，你可以运行：

```
pnx create-vue my-app
```

这将从注册源获取 create-vue 并使用给定的参数运行它。

你还可以指定想使用的软件包的确切版本：

```
pnx create-vue@next my-app
```

`catalog:` 协议也被支持, 允许你使用工作区目录中定义的版本：

```
pnx shx@catalog:
```

## 配置项

### --package &lt;name\>

在运行命令之前要安装的软件包。

示例：

```
pnx --package=@pnpm/meta-updater meta-updater --help
pnx --package=@pnpm/meta-updater@0 meta-updater --help
```

可以为安装提供多个软件包：

```
pnx --package=yo --package=generator-webapp yo webapp --skip-install
```

### --allow-build

添加于：v10.2.0

允许在安装期间执行安装的包名列表。

示例：

```
pnx --allow-build=esbuild my-bundler bundle
```

`dlx` 执行的实际软件包默认允许运行 postinstall 脚本。 因此，如果在上面的例子中 `my-bundler` 必须在执行之前构建，那么它就会被构建。

### --shell-mode, -c

在 shell 中运行该命令。 在 UNIX 上使用 `/bin/sh`，在 Windows 上使用 `\cmd.exe`。

示例：

```
pnx --package cowsay --package lolcatjs -c 'echo "hi pnpm" | cowsay | lolcatjs'
```

### --silent, -s

只打印执行命令的输出。

## Security and trust policies

Since v11.0.0, `pnx` (and its `pnpm dlx` / `pnpx` aliases) honors the project-level security and trust policy settings when resolving and fetching the requested package:

- [`minimumReleaseAge`](../settings.md#minimumreleaseage), [`minimumReleaseAgeExclude`](../settings.md#minimumreleaseageexclude), [`minimumReleaseAgeStrict`](../settings.md#minimumreleaseage)
- [`trustPolicy`](../settings.md#trustpolicy), [`trustPolicyExclude`](../settings.md#trustpolicyexclude), [`trustPolicyIgnoreAfter`](../settings.md#trustpolicyignoreafter)

This means `pnx` will refuse to execute freshly published or insufficiently trusted packages the same way a regular `pnpm install` would.
