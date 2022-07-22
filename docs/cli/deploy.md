---
id: deploy
title: "pnpm deploy"
---

Added in: v7.4.0

:::warning

This command is experimental

:::

Deploy a package from a workspace.

Usage:

```
pnpm --filter=<deployed project name> deploy <target directory>
```

Usage in a docker image. After building everything in your monorepo, do this in a second image that uses your monorepo base image as a build context or in an additional build stage:

```Dockerfile
# syntax=docker/dockerfile:1.4

FROM workspace as pruned
RUN pnpm --filter <your package name> deploy pruned

FROM node:18-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=pruned /app/pruned/dist dist
COPY --from=pruned /app/pruned/node_modules node_modules

ENTRYPOINT ["node", "dist"]
```

