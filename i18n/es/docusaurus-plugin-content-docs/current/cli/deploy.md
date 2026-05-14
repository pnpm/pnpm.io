---
id: deploy
title: "pnpm deploy"
---

Desplega un paquete desde un workspace. Durante el despliegue, los archivos del paquete desplegado se copian al directorio de destino. Todas las dependencias del paquete desplegado, incluyendo las dependencias del espacio de trabajo, se instalan dentro de un directorio `node_modules` aislado en el directorio de destino. El directorio de destino contendrá un paquete portátil que puede ser copiado a un servidor y ejecutado sin pasos adicionales.

:::note

By default, the deploy command only works with workspaces that have the `inject-workspace-packages` setting set to `true`. If you want to use deploy without "injected dependencies", use the `--legacy` flag or set `force-legacy-deploy` to `true`.

:::

:::note

When the [`enableGlobalVirtualStore`](../settings.md#enableglobalvirtualstore) option is set, `pnpm deploy` ignores it and always creates a localized virtual store within the deploy directory. This keeps the deploy directory self-contained and portable.

:::

Uso:

```
pnpm --filter=<nombre del proyecto a desplegar> deploy <directorio destino>
```

En caso de que genere el proyecto antes de desplegarlo, utilice también la opción `--prod` para omitir la instalación de `devDependencies`.

```
pnpm --filter=<nombre del proyecto a desplegar> deploy <directorio destino>
```

Uso en una imagen docker. Después de generar todo en su monorepo, haga esto en una segunda imagen que use su imagen base monorepo como contexto de construcción o en una etapa de generación adicional:

```Dockerfile
# syntax=docker/dockerfile:1.4

FROM workspace as pruned
RUN pnpm --filter <nombre del proyecto a desplegar> --prod deploy pruned

FROM node:18-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=pruned /app/pruned .

ENTRYPOINT ["node", "index.js"]
```

## Opciones

### --dev, -D

Only `devDependencies` are installed.

### --no-optional

`optionalDependencies` no son instaladas.

### --prod, -P

Los paquetes en `devDependencies` no serán instalados.

### --filter &lt;selector_de_paquete\>

[Leer más sobre filtrado.](../filtering.md)

### --legacy

Force legacy deploy implementation.

By default, `pnpm deploy` will try creating a dedicated lockfile from a shared lockfile for deployment. The `--legacy` flag disables this behavior and also allows using the deploy command without the `inject-workspace-packages=true` setting.

## Archivos incluidos en el proyecto desplegado

By default, all the files of the project are copied during deployment but this can be modified in _one_ of the following ways which are resolved in order:

1. The project's `package.json` may contain a "files" field to list the files and directories that should be copied.
2. If there is an `.npmignore` file in the application directory then any files listed here are ignored.
3. If there is a `.gitignore` file in the application directory then any files listed here are ignored.

## Configuración

### forceLegacyDeploy

* Por defecto: **false**
* Tipo: **Boolean**

By default, `pnpm deploy` will try creating a dedicated lockfile from a shared lockfile for deployment. If this setting is set to `true`, the legacy `deploy` behavior will be used.
