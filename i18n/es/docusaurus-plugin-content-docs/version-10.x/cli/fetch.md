---
id: fetch
title: pnpm fetch
---

Descargar paquetes indicados en un lockfile a la tienda virtual, el manifiesto de paquetes es ignorado.

## Escenario de uso

Este comando está específicamente diseñado para mejorar la construcción de una imagen Docker.

You may have read the [official guide] to writing a Dockerfile for a Node.js
app, if you haven't read it yet, you may want to read it first.

De esa guía, aprendemos a escribir un Dockerfile optimizado para proyectos que usan
pnpm, puede parecerse a algo tal que

```Dockerfile
FROM node:20

WORKDIR /path/to/somewhere

RUN corepack enable pnpm && corepack install -g pnpm@latest-10

# Files required by pnpm install
COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml .pnpmfile.cjs ./

# If you patched any package, include patches before install too
COPY patches patches

RUN pnpm install --frozen-lockfile --prod

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]
```

As long as there are no changes to `.npmrc`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`,
`.pnpmfile.cjs`, docker build cache is still valid up to the layer of
`RUN pnpm install --frozen-lockfile --prod`, which cost most of the time
when building a docker image.

However, modification to `package.json` may happen much more frequently than
we expect, because it does not only contain dependencies, but may also
contain the version number, scripts, and arbitrary configuration for any other
tool.

También es difícil mantener un Dockerfile que crea un proyecto monorepo, puede parecerse a algo tal que

```Dockerfile
FROM node:20

WORKDIR /path/to/somewhere

RUN corepack enable pnpm && corepack install -g pnpm@latest-10

# Files required by pnpm install
COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml .pnpmfile.cjs ./

# If you patched any package, include patches before install too
COPY patches patches

# for each sub-package, we have to add one extra step to copy its manifest
# to the right place, as docker have no way to filter out only package.json with
# single instruction
COPY packages/foo/package.json packages/foo/
COPY packages/bar/package.json packages/bar/

RUN pnpm install --frozen-lockfile --prod

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]

```

Como puede ver, el archivo Dockerfile tiene que ser actualizado cuando agregue o elimine
sub-paquetes.

`pnpm fetch` solves the above problem perfectly by providing the ability
to load packages into the virtual store using only information from a lockfile and a configuration file (`pnpm-workspace.yaml`).

```Dockerfile
FROM node:20

WORKDIR /path/to/somewhere

RUN corepack enable pnpm && corepack install -g pnpm@latest-10

# pnpm fetch does require only lockfile
COPY pnpm-lock.yaml pnpm-workspace.yaml ./

# If you patched any package, include patches before running pnpm fetch
COPY patches patches

RUN pnpm fetch --prod


ADD . ./
RUN pnpm install -r --offline --prod


EXPOSE 8080
CMD [ "node", "server.js" ]
```

It works for both simple and monorepo projects, `--offline` enforces
pnpm not to communicate with the package registry as all needed packages are
already present in the virtual store.

As long as the lockfile is not changed, the build cache is valid up to the
layer, so `RUN pnpm install -r --offline --prod`, will save you much
time.

:::note

Local `file:` protocol dependencies are skipped during `pnpm fetch`, since they reference directories that may not be available at fetch time (e.g. in Docker builds).

:::

## Opciones

### --dev, -D

Sólo se descargarán los paquetes de desarrollo

### --prod, -P

Los paquetes de desarrollo no se descargarán

[official guide]: https://github.com/nodejs/docker-node#readme
