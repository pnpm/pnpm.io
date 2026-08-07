---
id: env
title: "pnpm env <cmd>"
---

:::warning Deprecated

`pnpm env` is deprecated. Use [`pnpm runtime`](./runtime.md) instead. For example, `pnpm env use --global lts` becomes `pnpm runtime set node lts -g`.

:::

管理 Node.js 的執行環境。

:::danger

`pnpm env` does not include the binaries for Corepack. If you want to use Corepack to install other package managers, you need to install it separately (e.g. `pnpm add -g corepack`).

:::

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/84-MzN_0Cng" title="The pnpm patch command demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"></iframe>

## 命令

### use

安裝並使用指定版本的 Node.js

安裝 Node.js 的 LTS 版本：

```
pnpm env use --global lts
```

安裝 Node.js v16：

```
pnpm env use --global 16
```

安裝 Node.js 的發行前版本：

```
pnpm env use --global nightly
pnpm env use --global rc
pnpm env use --global 16.0.0-rc.0
pnpm env use --global rc/14
```

安裝 Node.js 最新的正式發行版本

```
pnpm env use --global latest
```

Install an LTS version of Node.js using its [codename]:

```
pnpm env use --global argon
```

[codename]: https://github.com/nodejs/Release/blob/main/CODENAMES.md

### add

安裝指定版本的 Node.js，但不立刻啟用。

例如：

```
pnpm env add --global lts 18 20.0.1
```

### remove, rm

Removes the specified version(s) of Node.js.

使用範例：

```
pnpm env remove --global 14.0.0
pnpm env remove --global 14.0.0 16.2.3
```

### list, ls

列出本機及線上可供使用的 Node.js 版本。

列出本機已安裝的所有版本

```
pnpm env list
```

列出線上可用的 Node.js 版本

```
pnpm env list --remote
```

列出線上所有可用的 Node.js v16 版本

```
pnpm env list --remote 16
```

## Options

### --global, -g

The changes are made systemwide.

