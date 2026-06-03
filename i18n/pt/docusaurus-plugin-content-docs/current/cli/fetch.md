---
id: fetch
title: pnpm fetch
---

Buscar pacotes a partir de um arquivo lockfile em lojas virtuais, o manifesto do pacote é ignorado.

## Casos de uso

Esse comando é focado para melhorar o building de uma imagem Docker.

You may have read the [official guide][] to writing a Dockerfile for a Node.js app, if you haven't read it yet, you may want to read it first.

Com a leitura de tal documentação, aprendemos como escrever um Dockerfile otimizado para projetos que utilizam pnpm, que parece como

```Dockerfile
FROM node:20

WORKDIR /path/to/somewhere

RUN corepack enable pnpm && corepack install -g pnpm@latest-11

# Files required by pnpm install
COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml .pnpmfile.mjs ./

# If you patched any package, include patches before install too
COPY patches patches

RUN pnpm install --frozen-lockfile --prod

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]
```

As long as there are no changes to `.npmrc`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.pnpmfile.mjs`, docker build cache is still valid up to the layer of `RUN pnpm install --frozen-lockfile --prod`, which cost most of the time when building a docker image.

Contudo, modificações no arquivo `package.json` costumam acontecer com mais frequência do que nós esperamos, pois o arquivo não contém somente as dependências, mas também contém o número de versão, scripts e configurações arbitrárias de outras ferramentas.

Também é difícil manter um arquivo Dockerfile que compila um projeto monorepo. Ele provavelmente se parecerá com

```Dockerfile
FROM node:20

WORKDIR /path/to/somewhere

RUN corepack enable pnpm && corepack install -g pnpm@latest-11

# Files required by pnpm install
COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml .pnpmfile.mjs ./

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
Como você pode ver, o Dockerfile tem que ser atualizado quando você adiciona ou remove sub-pacotes.

`pnpm fetch` solves the above problem perfectly by providing the ability to load packages into the virtual store using only information from a lockfile and a configuration file (`pnpm-workspace.yaml`).

```Dockerfile
FROM node:20

WORKDIR /path/to/somewhere

RUN corepack enable pnpm && corepack install -g pnpm@latest-11

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

Isso funciona para ambos os projetos simples quanto para os monorepos, `--offline` garante que o pnpm não vai se comunicar com nenhum gerenciador de pacotes, pois todos os pacotes necessários já estão presentes na loja virtual.

Enquanto o arquivo lockfile não for modificado, o cache de compilação será valido para a camada, então `RUN pnpm install -r --offline --prod` vai lhe salvar muito tempo.



:::note

Local `file:` protocol dependencies are skipped during `pnpm fetch`, since they reference directories that may not be available at fetch time (e.g. in Docker builds).

:::

## Opções

### --dev, -D

Apenas pacotes de desenvolvimento serão buscados

### --prod, -P

Pacotes de desenvolvimento não serão buscados



[official guide]: https://github.com/nodejs/docker-node#readme
