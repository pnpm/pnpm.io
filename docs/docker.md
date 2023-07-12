---
id: docker
title: Working with Docker
---

:::note

It is impossible to create reflinks or hardlinks between a Docker container and the host filesystem during build time.
The next best thing you can do is using BuildKit cache mount to share cache between builds.

:::

## Minimizing Docker image size and build time

* Use a small image, e.g. `node:XX-slim`.
* Leverage multi-stage if possible and makes sense.
* Leverage BuildKit cache mounts.

### Example 1: Build a bundle in a Docker container

Since `devDependencies` is only necessary for building the bundle, `pnpm install --prod` will be a separate stage
from `pnpm install` and `pnpm run build`, allowing the final stage to copy only necessary files from the earlier
stages, minimizing the size of the final image.

```text title=".dockerignore"
node_modules
.git
.gitignore
*.md
dist
```

```dockerfile title="Dockerfile"
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
EXPOSE 8000
CMD [ "pnpm", "start" ]
```
