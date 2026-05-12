---
id: create
title: "pnpm create"
---

从 `create-*` 或 `@foo/create-*` 启动套件创建项目。

## 示例

```
pnpm create react-app my-app
```

## 配置项

### --allow-build

添加于：v10.2.0

允许在安装期间执行安装的包名列表。

## Security and trust policies

Since v11.0.0, `pnpm create` honors the project-level security and trust policy settings — [`minimumReleaseAge`](../settings.md#minimumreleaseage) (and its `Exclude`/`Strict` companions) and [`trustPolicy`](../settings.md#trustpolicy) (and its `Exclude`/`IgnoreAfter` companions) — when resolving and fetching the starter kit.

