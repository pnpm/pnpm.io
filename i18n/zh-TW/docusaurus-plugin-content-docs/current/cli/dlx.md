---
id: dlx
title: "pnpm dlx"
---

命令別名：`pnpx` 是 `pnpm dlx` 的別名

從套件庫抓取套件，然不將其安裝為依附套件，直接載入並執行其提供的預設二進位檔案。

For example, to use `create-vue` anywhere to bootstrap a Vue project without needing to install it under another project, you can run:

```
pnpm dlx create-vue my-app
```

This will fetch `create-vue` from the registry and run it with the given arguments.

您可以指定欲使用的套件版本：

```
pnpm dlx create-vue@next my-app
```

The `catalog:` protocol is also supported, allowing you to use versions defined in your workspace catalogs:

```
pnpm dlx shx@catalog:
```

## 選項

### --package &lt;套件名稱\>

指定執行此命令前需要先安裝的套件。

例如：

```
pnpm --package=@pnpm/meta-updater dlx meta-updater --help
pnpm --package=@pnpm/meta-updater@0 dlx meta-updater --help
```

可以指定多個套件：

```
pnpm --package=yo --package=generator-webapp dlx yo webapp --skip-install
```

### --allow-build

Added in: v10.2.0

A list of package names that are allowed to run postinstall scripts during installation.

例如：

```
pnpm --allow-build=esbuild my-bundler bundle
```

The actual packages executed by `dlx` are allowed to run postinstall scripts by default. So if in the above example `my-bundler` has to be built before execution, it will be built.

### --shell-mode, -c

在殼層中執行命令。 使用的 shell 依系統而定， UNIX 系統中使用 `/bin/sh`；Windows 中使用 `\cmd.exe`。

例如：

```
pnpm --package cowsay --package lolcatjs -c dlx 'echo "hi pnpm" | cowsay | lolcatjs'
```

### --silent, -s

只印出執行命令時輸出的內容。
