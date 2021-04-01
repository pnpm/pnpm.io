---
id: boost-docker-build-with-pnpm-fetch
title: Boost docker build with pnpm fetch
---

`pnpm fetch` is a new command introduced in pnpm v6 to boost docker build.

You may have read the [official guide] to writing a Dockerfile for a Node.js
app, if you didn't read it yet, you may want to read it first.

From that guide, we learn to write an optimized Dockerfile for projects using
pnpm, which shall looks like

```Dockerfile
FROM node:14

RUN curl -L https://unpkg.com/@pnpm/self-installer | node

# Files required by pnpm install
COPY .npmrc package.json pnpm-lock.yaml pnpmfile.js ./

RUN pnpm install --frozon-lockfile --prod

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]
```

As long as there is no chang to `.npmrc`, `package.json`, `pnpm-lock.yaml`,
`pnpmfile.js`, docker build cache is still valid up to the layer of
`RUN pnpm install --frozen-lockfile --prod`, which cost most of the time
when building a docker image.

However, modification to `package.json` may happen much more frequently than
we expected, because it does not only contain dependencies, but may also
contain the version number, scripts, and arbitrary configuration for any other
tool.

It's also hard to maintain a Dockerfile that build a monorepo project, it may
look like

```Dockerfile
FROM node:14

RUN curl -L https://unpkg.com/@pnpm/self-installer | node

# Files required by pnpm install
COPY .npmrc package.json pnpm-lock.yaml pnpmfile.js ./

# for each sub-package, we have to add one extra step to copy its manifest
# to right place, as docker have no way to filter out only package.json with
# single instruction
COPY packages/foo/backage.json packages/foo/
COPY packages/bar/backage.json packages/bar/

RUN pnpm install --frozon-lockfile --prod

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]

```
As you can see, the Dockerfile has to be updated when you add or remove
sub-packages.

`pnpm fetch` will solve the above problem perfectly by providing the ability
to fetch package to virtual store with information only from a lockfile.

```Dockerfile
FROM node:14

RUN curl -L https://unpkg.com/@pnpm/self-installer | node

# pnpm fetch does require only lockfile
COPY pnpm-lock.yaml ./

RUN pnpm fetch --prod


ADD . ./
RUN pnpm recursive install --offline --prod

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]
```

It works for both simple project and monospace project, `--offline` enforces
pnpm not to communicate with package registry as all needed packages shall be
already presented in the virtual store.

As long as the lockfile is not changed, the build cache is valid up to the
layer `RUN pnpm recursive install --offline --prod`, which will save you much
time.


[official guide]: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
