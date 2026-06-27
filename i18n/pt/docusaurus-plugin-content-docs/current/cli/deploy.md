---
id: deploy
title: "deploy pnpm"
---

Deploy a package from a workspace. During deployment, the files of the deployed package are copied to the target directory. All dependencies of the deployed package, including dependencies from the workspace, are installed inside an isolated `node_modules` directory at the target directory. The target directory will contain a portable package that can be copied to a server and executed without additional steps.

:::note

By default, the deploy command only works with workspaces that have the `inject-workspace-packages` setting set to `true`. If you want to use deploy without "injected dependencies", use the `--legacy` flag or set `force-legacy-deploy` to `true`.

:::

:::note

When the [`enableGlobalVirtualStore`](../settings.md#enableglobalvirtualstore) option is set, `pnpm deploy` ignores it and always creates a localized virtual store within the deploy directory. This keeps the deploy directory self-contained and portable.

:::

Uso:

```
pnpm -- filter=<deployed project name> deploy <target directory>
```

Caso você construa seu projeto antes da implantação, use também a opção `--prod` para pular a instalação de `devDependencies`.

```
pnpm --filter=<deployed project name> --prod deploy <target directory>
```

Usando em uma imagem Docker. Depois de compilar tudo em seu monorepo, faça isso em uma segunda imagem que usa sua imagem base do monorepo como contexto de compilação ou em um estágio de compilação adicional:

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

## Opções

### --dev, -D

Only `devDependencies` are installed.

### --no-optional

Não serão instaladas `dependências opcionais - optionalDependencies`.

### --prod, -P

Pacotes em `devDependencies` não serão instalados.

### --filter &lt;package_selector\>

[Leia mais sobre filtragem.](../filtering.md)

### --legacy

Force legacy deploy implementation.

By default, `pnpm deploy` will try creating a dedicated lockfile from a shared lockfile for deployment. The `--legacy` flag disables this behavior and also allows using the deploy command without the `inject-workspace-packages=true` setting.

## Arquivos incluídos no deploy do projeto

By default, all the files of the project are copied during deployment but this can be modified in _one_ of the following ways which are resolved in order:

1. The project's `package.json` may contain a "files" field to list the files and directories that should be copied.
2. If there is an `.npmignore` file in the application directory then any files listed here are ignored.
3. If there is a `.gitignore` file in the application directory then any files listed here are ignored.

## Configuração

### forceLegacyDeploy

* Padrão: **false**
* Tipo: **Boolean**

By default, `pnpm deploy` will try creating a dedicated lockfile from a shared lockfile for deployment. If this setting is set to `true`, the legacy `deploy` behavior will be used.
