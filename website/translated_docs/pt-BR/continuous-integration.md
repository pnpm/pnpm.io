---
id: continuous-integration-pt-br
title: Integração Contínua
---

O pnpm pode ser facilmente usado em vários sistemas de integração contínua.

## Travis

Em [Travis CI](https://travis-ci.org/), você pode usar o pnpm para instalar suas dependências adicionando isto ao seu arquivo `.travis.yml`:

```yaml
before_install:
  - curl -L https://unpkg.com/@pnpm/self-installer | node
install:
  - pnpm install
```

## Semáforo

Em [Semaphore](https://semaphoreci.com), você pode usar o pnpm para instalar e armazenar em cache suas dependências adicionando isto ao seu arquivo `.semaphore/semaphore.yml`:

```yaml
version: v1.0
name: Semaphore CI pnpm example
agent:
  machine:
    type: e1-standard-2
    os_image: ubuntu1804
blocks:
  - name: Install dependencies
    task:
      jobs:
        - name: pnpm install
          commands:
            - curl -L https://unpkg.com/@pnpm/self-installer | node
            - checkout
            - cache restore node-modules-$SEMAPHORE_GIT_BRANCH-$(checksum package-lock.json),node-modules-$SEMAPHORE_GIT_BRANCH,node-modules-master
            - pnpm install
            - cache store node-modules-$SEMAPHORE_GIT_BRANCH-$(checksum package-lock.json) node_modules
```

## AppVeyor

No [AppVeyor](https://www.appveyor.com/), você pode usar o pnpm para instalar suas dependências adicionando isto ao seu `appveyor.yml`:

```yaml
install:
  - ps: Install-Product node $env:nodejs_version
  - curl -L https://unpkg.com/@pnpm/self-installer | node
  - pnpm install
```

## Sail CI

No [Sail CI](https://sail.ci/), você pode usar o pnpm para instalar suas dependências adicionando isto ao seu arquivo `.sail.yml`:

```yaml
install:
  image: znck/docker-pnpm:10
  command:
    - pnpm
  args:
    - install
```
Para obter a versão exata do Nó e a versão pnpm necessária, você sempre pode criar sua própria imagem do Docker e enviá-la para o [Docker Hub](https://hub.docker.com/).
