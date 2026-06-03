---
id: catalogs
title: Catalogs
---

“_Catalogs_” 是一个 [工作空间功能](./workspaces.md)，可将依赖项版本定义为可复用常量。 目录中定义的常量稍后可以在 `package.json` 文件中引用。

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/PuRUk4mV2jc" title="pnpm Catalogs — A New Tool to Manage Dependencies in monorepos" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"></iframe>

## Catalog 目录协议 (`catalog:`)

在 `pnpm-workspace.yaml` 中定义目录，

```yaml title="pnpm-workspace.yaml"
packages:
  - packages/*

# 定义目录和依赖版本号
catalog:
  react: ^18.3.1
  redux: ^5.0.1
```

可以使用 `catalog:` 协议来代替依赖项版本。

```json title="packages/example-app/package.json"
{
  "name": "@example/app",
  "dependencies": {
    "react": "catalog:",
    "redux": "catalog:"
  }
}
```

这等于直接写入一个版本范围(例如 `^18.3.1`)。

```json title="packages/example-app/package.json"
{
  "name": "@example/app",
  "dependencies": {
    "react": "^18.3.1",
    "redux": "^5.0.1"
  }
}
```

你可以在以下字段中使用 `catalog:` 协议：

- `package.json`:
  - `dependencies`
  - `devDependencies`
  - `peerDependencies`
  - `optionalDependencies`
- `pnpm-workspace.yaml`
  - `overrides`

Catalog 协议允许在冒号后使用可选名称 (例如：`catalog:name`) 来指定应使用哪个目录。 当省略名称时，将使用默认目录。

根据不同的场景，`catalog:` 协议相比于直接编写版本范围提供了一些[优势](#advantages) ，将在下文中详细介绍。

## 优势

在工作空间（即 monorepo 或多包 repo）中，许多包使用相同的依赖项是很常见的。 在编写 `package.json` 文件时，目录可以减少重复，并在此过程中提供一些好处：

- **维护唯一版本** - 我们通常希望在工作空间中共同的依赖项版本一致。 Catalog 让工作区内共同依赖项的版本更容易维护。 重复的依赖关系可能会在运行时冲突并导致错误。 当使用打包器时，不同版本的重复依赖项也会增大项目体积。
- **易于更新** — 升级或者更新依赖项版本时，只需编辑 `pnpm-workspace.yaml` 中的目录，而不需要更改所有用到该依赖项的 `package.json` 文件。 这样可以节省时间 — 只需更改一行，而不是多行。
- **减少合并冲突** — 由于在升级依赖项时不需要编辑 `package.json`文件，所以这些依赖项版本更新时就不会发生 git 冲突。

## 定义目录

目录在 `pnpm-workspace.yaml` 文件中定义。 有两种方法来定义目录。

1. 使用 (单数) `catalog` 字段创建名为 `default` 的目录。
2. 使用 (复数) `catalogs` 字段创建任意命名的目录。

:::tip

如果你有一个现有的工作区并想使用目录进行迁移，则可以使用以下 [codemod](https://go.codemod.com/pnpm-catalog)：

```
pnpx codemod pnpm/catalog
```

:::

### 默认 Catalog

顶层 `catalog` 字段允许用户定义一个名为 `default` 的目录。

```yaml title="pnpm-workspace.yaml"
catalog:
  react: ^18.2.0
  react-dom: ^18.2.0
```

这些版本范围可以通过 `catalog:default` 引用。 仅有默认目录时，也可以使用特殊的 `catalog:` 简写。 将 `catalog:` 视为可扩展为 `catalog:default` 的简写。

### 具名目录

可以在 `catalogs` 键下配置具有名称任意选择的多个`catalog`。

```yaml title="pnpm-workspace.yaml"
catalogs:
  # 可以通过 "catalog:react17" 引用
  react17:
    react: ^17.0.2
    react-dom: ^17.0.2

  # 可以通过 "catalog:react18" 引用
  react18:
    react: ^18.2.0
    react-dom: ^18.2.0
```

默认目录可以与多个命名目录一起定义。 这对正在更新依赖项版本的大型多包存储库可能会很有用。

```yaml title="pnpm-workspace.yaml"
catalog:
  react: ^16.14.0
  react-dom: ^16.14.0

catalogs:
  # 可以通过 "catalog:react17" 引用
  react17:
    react: ^17.0.2
    react-dom: ^17.0.2

  # 可以通过 "catalog:react18" 引用
  react18:
    react: ^18.2.0
    react-dom: ^18.2.0
```

## 发布

运行 `pnpm publish` 或者 `pnpm pack` 时，`catalog:` 协议将被移除。 这与 [`workspace:` 协议](./workspaces.md#workspace-protocol-workspace) 类似，该协议[在发布时也会被替换](./workspaces.md#publishing-workspace-packages)。

例如，

```json title="packages/example-components/package.json"
{
  "name": "@example/components",
  "dependencies": {
    "react": "catalog:react18",
  }
}
```

在发布时将变为以下内容。

```json title="packages/example-components/package.json"
{
  "name": "@example/components",
  "dependencies": {
    "react": "^18.3.1",
  }
}
```

`catalog: ` 的替换过程允许其他工作区或包管理器使用 `@example/components` 包。

## 设置

import CatalogMode from './settings/_catalogMode.mdx'

<CatalogMode />

import CleanupUnusedCatalogs from './settings/_cleanupUnusedCatalogs.mdx'

<CleanupUnusedCatalogs />
