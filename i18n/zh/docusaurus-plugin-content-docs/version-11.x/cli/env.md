---
id: env
title: "pnpm env <cmd>"
---

:::warning Deprecated

`pnpm env` is deprecated. Use [`pnpm runtime`](./runtime.md) instead. For example, `pnpm env use --global lts` becomes `pnpm runtime set node lts -g`.

:::

管理 Node.js 环境。

:::danger

`pnpm env` 不包含 Corepack 的二进制文件。 如果您想使用 Corepack 安装其他包管理器，则需要单独安装（例如`pnpm add -g corepack`）。

:::

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/84-MzN_0Cng" title="The pnpm patch command demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"></iframe>

## 命令

### use

安装并使用指定版本的 Node.js

安装 Node.js 的 LTS 版本：

```
pnpm env use --global lts
```

安装 Node.js v16：

```
pnpm env use --global 16
```

安装 Node.js 的预发布版本：

```
pnpm env use --global nightly
pnpm env use --global rc
pnpm env use --global 16.0.0-rc.0
pnpm env use --global rc/14
```

安装最新版本的 Node.js：

```
pnpm env use --global latest
```

使用其 [代号][codename] 安装 Node.js 的 LTS 版本：

```
pnpm env use --global argon
```

[codename]: https://github.com/nodejs/Release/blob/main/CODENAMES.md

### add

安装指定版本的 Node.js，而不将其激活为当前版本。

示例：

```
pnpm env add --global lts 18 20.0.1
```

### remove, rm

移除指定版本的 Node.js。

用法示例：

```
pnpm env remove --global 14.0.0
pnpm env remove --global 14.0.0 16.2.3
```

### list, ls

列出本地或远程可用的 Node.js 版本。

打印本地安装的版本：

```
pnpm env list
```

打印远程可用的 Node.js 版本：

```
pnpm env list --remote
```

打印远程可用的 Node.js v16 版本：

```
pnpm env list --remote 16
```

## 配置项

### --global, -g

这些更改是全系统范围的。

