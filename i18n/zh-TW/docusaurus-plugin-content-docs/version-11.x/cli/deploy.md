---
id: deploy
title: "pnpm deploy"
---

從工作區部署套件。 During deployment, the files of the deployed package are copied to the target directory. All dependencies of the deployed package, including dependencies from the workspace, are installed inside an isolated `node_modules` directory at the target directory. The target directory will contain a portable package that can be copied to a server and executed without additional steps.

:::note

By default, the deploy command only works with workspaces that have the `inject-workspace-packages` setting set to `true`. If you want to use deploy without "injected dependencies", use the `--legacy` flag or set `force-legacy-deploy` to `true`.

:::

:::note

When the [`enableGlobalVirtualStore`](../settings.md#enableglobalvirtualstore) option is set, `pnpm deploy` ignores it and always creates a localized virtual store within the deploy directory. This keeps the deploy directory self-contained and portable.

:::

使用方式：

```
pnpm --filter=<deployed project name> deploy <target directory>
```

In case you build your project before deployment, also use the `--prod` option to skip `devDependencies` installation.

```
pnpm --filter=<deployed project name> --prod deploy <target directory>
```

使用於 Docker 映像中。 在您的 Monorepo 中組建完所有內容後，請在第二個使用 Monorepo 基本映像作為建置內容的影像中或在其他組建段中執行：

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

## Options

### --dev, -D

Only `devDependencies` are installed.

### --no-optional

不安裝 `optionalDependencies`。

### --prod, -P

Packages in `devDependencies` won't be installed.

### --filter &lt;package_selector\>

[Read more about filtering.](../filtering.md)

### --legacy

Force legacy deploy implementation.

By default, `pnpm deploy` will try creating a dedicated lockfile from a shared lockfile for deployment. The `--legacy` flag disables this behavior and also allows using the deploy command without the `inject-workspace-packages=true` setting.

## 已部署完成的專案中包含的檔案

By default, all the files of the project are copied during deployment but this can be modified in _one_ of the following ways which are resolved in order:

1. The project's `package.json` may contain a "files" field to list the files and directories that should be copied.
2. If there is an `.npmignore` file in the application directory then any files listed here are ignored.
3. If there is a `.gitignore` file in the application directory then any files listed here are ignored.

## 設定

### forceLegacyDeploy

- 預設值：**false**
- 型別：**布林值**

By default, `pnpm deploy` will try creating a dedicated lockfile from a shared lockfile for deployment. If this setting is set to `true`, the legacy `deploy` behavior will be used.
