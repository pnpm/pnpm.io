---
id: docker
title: 使用 Docker
---

:::note

在建置時期，您無法在Docker容器與主機檔案系統間建立參照連結 (reflink) 或硬連結 (hard link)。 但您仍可透過 BuildKit 的 cache mount 功能，在不同組建間共享快取。 或者，您可以使用 [podman][]，因為它可以在建置時期掛載 Btrfs 磁碟區。

:::

## Official pnpm base image

An official pnpm base image is published to GitHub Container Registry as [`ghcr.io/pnpm/pnpm`](https://github.com/pnpm/pnpm/pkgs/container/pnpm). It is based on `debian:stable-slim` and contains only the pnpm [standalone binary][] — Node.js is **not** bundled. This lets you pick the Node.js version yourself (inside your Dockerfile or at runtime) instead of being locked to whatever Node version a base image ships with.

### 標籤

| Tag               | 效果                                                              |
| ----------------- | --------------------------------------------------------------- |
| `<version>` | Exact, immutable (e.g. `11.0.0`). Includes prereleases.         |
| `<major>`   | Tracks the latest stable release within that major (e.g. `11`). |
| `latest`          | Most recent stable pnpm release. Not updated for prereleases.   |

Supported platforms: `linux/amd64`, `linux/arm64`.

### Installing Node.js

Use [`pnpm runtime set`](./cli/runtime.md) with the global flag so the `node` binary is discoverable on `PATH` in subsequent layers and at runtime:

```dockerfile
FROM ghcr.io/pnpm/pnpm:latest
RUN pnpm runtime set node 22 -g
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
CMD ["node", "index.js"]
```

Or let pnpm install Node.js automatically from [`devEngines.runtime`](./package_json.md#devenginesruntime) in your `package.json`:

```json title="package.json"
{
  "devEngines": {
    "runtime": {
      "name": "node",
      "version": "22.x",
      "onFail": "download"
    }
  }
}
```

```dockerfile
FROM ghcr.io/pnpm/pnpm:latest
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
CMD ["pnpm", "start"]
```

### When to use this image

- You want the Node.js version to be pinned by your project (via `pnpm runtime set` or `devEngines.runtime`) rather than by the base image.
- You want to upgrade pnpm and Node.js independently.
- You prefer a minimal Debian base without the Node.js build toolchain.

If you already have a preferred Node.js base image (e.g. `node:XX-slim`), the recipes further down this page remain a fine choice.

## 最小化 Docker 映像尺寸及建置時間

* 使用較小的映像，例如 `node:XX-slim`。
* 盡可能利用多階段建置。
* 利用 BuildKit 快取掛載區功能。

### 例一：在 Docker 容器中建置軟體包

因為僅在建置軟體時需要 `devDependencies`，您可以將 `pnpm install --prod` 從 `pnpm install` 及 `pnpm run build` 中獨立出來成為單獨的階段，讓最後階段只從先前階段複製必須的檔案，從而降低最終產出映像的大小。

```text title=".dockerignore"
node_modules
.git
.gitignore
*.md
dist
```

```dockerfile title="Dockerfile"
FROM node:24-slim AS base
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

### 例二：在 monorepo 中建置多個 Docker 映像

假設您的 monorepo 含有三個套件：app1、app2 及 common，app1 及 app2 依賴於 common，但不互相依賴。

您可能會希望只保留每個套件必需的相依性，`pnpm deploy` 能協助您僅複製必需檔案及套件。

```text title="Structure of the monorepo"
./
├── Dockerfile
├── .dockerignore
├── .gitignore
├── packages/
│   ├── app1/
│   │   ├── dist/
│   │   ├── package.json
│   │   ├── src/
│   │   └── tsconfig.json
│   ├── app2/
│   │   ├── dist/
│   │   ├── package.json
│   │   ├── src/
│   │   └── tsconfig.json
│   └── common/
│       ├── dist/
│       ├── package.json
│       ├── src/
│       └── tsconfig.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── tsconfig.json
```

```yaml title="pnpm-workspace.yaml"
packages:
  - 'packages/*'
syncInjectedDepsAfterScripts:
- build
injectWorkspacePackages: true
```

```text title=".dockerignore"
node_modules
.git
.gitignore
*.md
dist
```

```dockerfile title="Dockerfile"
FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=app1 --prod /prod/app1
RUN pnpm deploy --filter=app2 --prod /prod/app2

FROM base AS app1
COPY --from=build /prod/app1 /prod/app1
WORKDIR /prod/app1
EXPOSE 8000
CMD [ "pnpm", "start" ]

FROM base AS app2
COPY --from=build /prod/app2 /prod/app2
WORKDIR /prod/app2
EXPOSE 8001
CMD [ "pnpm", "start" ]
```

執行下列命令來建置 app1 和 app2 的映像：

```sh
docker build . --target app1 --tag app1:latest
docker build . --target app2 --tag app2:latest
```

### Example 3: Build on CI/CD

On CI or CD environments, the BuildKit cache mounts might not be available, because the VM or container is ephemeral and only normal docker cache will work.

So an alternative is to use a typical Dockerfile with layers that are built incrementally, for this scenario, `pnpm fetch` is the best option, as it only needs the `pnpm-lock.yaml` file and the layer cache will only be lost when you change the dependencies.

```dockerfile title="Dockerfile"
FROM node:24-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS prod

COPY pnpm-lock.yaml /app
WORKDIR /app
RUN pnpm fetch --prod

COPY . /app
RUN pnpm run build

FROM base
COPY --from=prod /app/node_modules /app/node_modules
COPY --from=prod /app/dist /app/dist
EXPOSE 8000
CMD [ "pnpm", "start" ]
```

[podman]: ./podman.md

[standalone binary]: ./installation.md#using-a-standalone-script
