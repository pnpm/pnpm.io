---
id: docker
title: Trabajando con Docker
---

:::note

It is impossible to create reflinks or hardlinks between a Docker container and the host filesystem during build time. The next best thing you can do is using BuildKit cache mount to share cache between builds. Alternatively, you may use [podman][] because it can mount Btrfs volumes during build time.

:::

## Official pnpm base image

An official pnpm base image is published to GitHub Container Registry as [`ghcr.io/pnpm/pnpm`](https://github.com/pnpm/pnpm/pkgs/container/pnpm). It is based on `debian:stable-slim` and contains only the pnpm [standalone binary][] — Node.js is **not** bundled. This lets you pick the Node.js version yourself (inside your Dockerfile or at runtime) instead of being locked to whatever Node version a base image ships with.

### Tags

| Tag               | Significado                                                     |
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

## Minimizing Docker image size and build time

* Use a small image, e.g. `node:XX-slim`.
* Leverage multi-stage if possible and makes sense.
* Leverage BuildKit cache mounts.

### Example 1: Build a bundle in a Docker container

Since `devDependencies` is only necessary for building the bundle, `pnpm install --prod` will be a separate stage from `pnpm install` and `pnpm run build`, allowing the final stage to copy only necessary files from the earlier stages, minimizing the size of the final image.

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

### Example 2: Build multiple Docker images in a monorepo

Assuming you have a monorepo with 3 packages: app1, app2, and common; app1 and app2 depend on common but not each other.

You want to save only necessary dependencies for each package, `pnpm deploy` should help you with copying only necessary files and packages.

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

Run the following commands to build images for app1 and app2:

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
