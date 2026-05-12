---
id: runtime
title: "pnpm runtime <cmd>"
---

管理运行时。

别名：`rt`

## 命令

### set

安装指定版本的运行时环境。

```
pnpm runtime set <name> <version> [-g]
```

#### 支持的运行时

- `node` - Node.js
- `deno` - Deno
- `bun` - Bun

:::info

Since v11.0.0, installing a Node.js runtime (via `pnpm runtime set node …` or `node@runtime:<version>`) does not extract the bundled `npm`, `npx`, and `corepack` from the Node.js archive. This roughly halves the number of files pnpm has to hash, write to the CAS, and link during a runtime install. If you still need `npm`, install it separately with `pnpm add -g npm`.

:::

#### 示例

全局安装 Node.js v22：

```
pnpm runtime set node 22 -g
```

安装 Node.js 的 LTS 版本：

```
pnpm runtime set node lts -g
```

安装最新版本的 Node.js：

```
pnpm runtime set node latest -g
```

安装 Node.js 的预发布版本：

```
pnpm runtime set node nightly -g
pnpm runtime set node rc -g
pnpm runtime set node rc/22 -g
pnpm runtime set node 22.0.0-rc.4 -g
```

使用其 [代号][codename] 安装 Node.js 的 LTS 版本：

```
pnpm runtime set node argon -g
```

安装 Deno：

```
pnpm runtime set deno 2 -g
```

安装 Bun：

```
pnpm runtime set bun latest -g
```

[codename]: https://github.com/nodejs/Release/blob/main/CODENAMES.md

## 配置项

### --global, -g

全局安装运行时环境。
