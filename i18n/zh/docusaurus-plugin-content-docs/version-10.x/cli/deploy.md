---
id: deploy
title: "pnpm deploy"
---

从工作空间部署软件包。 在部署期间，已部署软件包的文件将被复制到目标目录。 已部署包的所有依赖项，包括来自工作区的依赖项，都安装在目标目录的独立 `node_modules` 目录中。 目标目录将包含一个可移植包，可以无需其他步骤将其复制到服务器并执行。

:::note

默认情况下，deploy 命令仅适用于将 `injection-workspace-packages` 设置设为 `true` 的工作区。 如果你想使用不带“注入依赖项”的部署，请使用 `--legacy` 标志或将 `force-legacy-deploy` 设置为 `true`。

:::

:::note

当设置 [`enableGlobalVirtualStore`](../settings.md#enableglobalvirtualstore) 选项时，`pnpm deploy` 忽略了它，并且总是在部署目录中创建一个本地化虚拟存储。 这样可以保持部署目录的自包含性和可移植性。

:::

使用方法：

```
pnpm --filter=<deployed project name> deploy <target directory>
```

如果你在部署之前构建项目，也可以使用 `--prod` 选项跳过 `devDependencies` 安装。

```
pnpm --filter=<deployed project name> --prod deploy <target directory>
```

在 Docker 镜像中的使用。 在你的 monorepo 中构建完所有内容后，在第二个镜像中执行此操作，该镜像使用你的 monorepo 基础镜像作为构建上下文或在额外的构建阶段：

```Dockerfile
# syntax=docker/dockerfile:1.4

FROM workspace as pruned
RUN pnpm --filter <your package name> --prod deploy pruned

FROM node:18-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=pruned /app/pruned .

ENTRYPOINT ["node", "index.js"]
```

## 配置项

### --dev, -D

仅安装 `devDependencies`。

### --no-optional

不安装 `optionalDependencies`。

### --prod, -P

`devDependencies` 中的软件包将不会被安装。

### --filter &lt;package_selector\>

[阅读更多有关过滤的内容。](../filtering.md)

### --legacy

强制实施原有部署实现。

默认情况下， `pnpm deploy` 将尝试从共享锁文件创建专用锁文件以进行部署。 `--legacy` 标志禁用此行为并且还允许在没有 `injection-workspace-packages=true` 设置的情况下使用 deploy 命令。

## 已部署项目中包含的文件

默认情况下，项目的所有文件都会在部署期间被复制，但这可以通过以下 _之一_ 进行修改，并按顺序解决：

1. 项目的 `package.json` 可能包含一个“files”字段来列出应复制的文件和目录。
2. 如果应用程序目录中有一个 `.npmignore` 文件，那么这里列出的任何文件都会被忽略。
3. 如果应用程序目录中有一个 `.gitignore` 文件，那么这里列出的任何文件都会被忽略。

## 配置

### forceLegacyDeploy

- 默认值： **false**
- 类型：**Boolean**

默认情况下， `pnpm deploy` 将尝试从共享锁文件创建专用锁文件以进行部署。 如果此设置设为 `true`，则将使用旧的 `deploy` 行为。
