---
id: continuous-integration-pt-br
title: Integração Contínua
---

O pnpm pode ser facilmente usado em vários sistemas de integração contínua.

## Travis

Em [Travis CI] (https://travis-ci.org/), você pode usar o pnpm para instalar suas dependências adicionando isto ao seu arquivo `.travis.yml`:

`` `yaml
before_install:
  - enrolar -L https://unpkg.com/@pnpm/self-installer | nó
instalar:
  - instalação do pnpm
`` `

## Semáforo

Em [Semaphore] (https://semaphoreci.com), você pode usar o pnpm para instalar e armazenar em cache suas dependências adicionando isto ao seu arquivo `.semaphore / semaphore.yml`:

`` `yaml
versão: v1.0
nome: exemplo de pnpm do semáforo CI
agente:
  máquina:
    tipo: e1-standard-2
    os_image: ubuntu1804
blocos:
  - name: instala dependências
    tarefa:
      empregos:
        - nome: pnpm install
          comandos:
            - enrolar -L https://unpkg.com/@pnpm/self-installer | nó
            - Confira
            - cache restore node-modules- $ SEMAPHORE_GIT_BRANCH - $ (checksum package-lock.json), node-modules- $ SEMAPHORE_GIT_BRANCH, node-modules-master
            - instalação do pnpm
            - armazenar em cache node-modules- $ SEMAPHORE_GIT_BRANCH - $ (checksum package-lock.json) node_modules
`` `

## AppVeyor

No [AppVeyor] (https://www.appveyor.com/), você pode usar o pnpm para instalar suas dependências adicionando isto ao seu `appveyor.yml`:

`` `yaml
instalar:
  - ps: nó Install-Product $ env: nodejs_version
  - enrolar -L https://unpkg.com/@pnpm/self-installer | nó
  - instalação do pnpm
`` `

## Sail CI

No [Sail CI] (https://sail.ci/), você pode usar o pnpm para instalar suas dependências adicionando isto ao seu arquivo `.sail.yml`:

`` `yaml
instalar:
  imagem: znck / docker-pnpm: 10
  comando:
    - pnpm
  args:
    - instalar
`` `
Para obter a versão exata do Nó e a versão pnpm necessária, você sempre pode criar sua própria imagem do Docker e enviá-la para o [Docker Hub] (https://hub.docker.com/).
