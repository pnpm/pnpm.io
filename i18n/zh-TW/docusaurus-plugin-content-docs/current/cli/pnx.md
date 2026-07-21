---
id: pnx
title: pnx
---

Aliases: `pnpm dlx`, `pnpx`

從套件庫抓取套件，然不將其安裝為依附套件，直接載入並執行其提供的預設二進位檔案。

For example, to use `create-vue` anywhere to bootstrap a Vue project without
needing to install it under another project, you can run:

```
pnx create-vue my-app
```

This will fetch `create-vue` from the registry and run it with the given arguments.

您可以指定欲使用的套件版本：

```
pnx create-vue@next my-app
```

The `catalog:` protocol is also supported, allowing you to use versions defined in your workspace catalogs:

```
pnx shx@catalog:
```

## Options

### --package &lt;name\>

指定執行此命令前需要先安裝的套件。

例如：

```
pnx --package=@pnpm/meta-updater meta-updater --help
pnx --package=@pnpm/meta-updater@0 meta-updater --help
```

可以指定多個套件：

```
pnx --package=yo --package=generator-webapp yo webapp --skip-install
```

### --allow-build

Added in: v10.2.0

A list of package names that are allowed to run postinstall scripts during installation.

例如：

```
pnx --allow-build=esbuild my-bundler bundle
```

The actual packages executed by `dlx` are allowed to run postinstall scripts by default. So if in the above example `my-bundler` has to be built before execution, it will be built.

### --shell-mode, -c

在殼層中執行命令。 Uses `/bin/sh` on UNIX and `\cmd.exe` on Windows.

例如：

```
pnx --package cowsay --package lolcatjs -c 'echo "hi pnpm" | cowsay | lolcatjs'
```

### --silent, -s

只印出執行命令時輸出的內容。

## Security and trust policies

Since v11.0.0, `pnx` (and its `pnpm dlx` / `pnpx` aliases) honors the project-level security and trust policy settings when resolving and fetching the requested package:

- [`minimumReleaseAge`](../settings.md#minimumreleaseage), [`minimumReleaseAgeExclude`](../settings.md#minimumreleaseageexclude), [`minimumReleaseAgeStrict`](../settings.md#minimumreleaseage)
- [`trustPolicy`](../settings.md#trustpolicy), [`trustPolicyExclude`](../settings.md#trustpolicyexclude), [`trustPolicyIgnoreAfter`](../settings.md#trustpolicyignoreafter)

This means `pnx` will refuse to execute freshly published or insufficiently trusted packages the same way a regular `pnpm install` would.
