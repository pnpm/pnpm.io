---
id: motivation
title: Motivação
---

## Salvando espaço em disco

![An illustration of the pnpm content-addressable store. On the illustration there are two projects with node_modules. The files in the node_modules directories are hard links to the same files in the content-addressable store.](/img/pnpm-store.svg)

Ao usar npm ou Yarn, se você tiver 100 projetos usando uma dependência, você terá 100 cópias dessa dependência salvas em disco. Com pnpm, a dependência será armazenada em um armazenamento de conteúdo endereçável, então:

1. Se você depender de diferentes versões da dependência, apenas os arquivos diferentes serão armazenados. Por exemplo, se ela tiver 100 arquivos e uma nova versão haver uma alteração em apenas um desses arquivos, o comando `pnpm update` armazenará apenas 1 novo arquivo, ao invés de clonar toda a dependência apenas para uma mudança única.
1. Todos os arquivos são armazenados em um único local do disco. Quando os pacotes são instalados, seus arquivos são vinculados a partir desse local único, não consumindo espaço adicional em disco. Isso permite que você compartilhe a mesma versão de dependências entre diversos projetos.

Como resultado, você otimiza muito espaço em seu disco proporcionalmente ao número de projetos e dependências, tendo assim instalações muito mais rápidas!

## Aumentando a velocidade de instalação

pnpm performs installation in three stages:

1. Resolução de dependências. Todas as dependências são identificadas e baixadas para o armazenamento.
1. Cálculo da estrutura de diretórios. A estrutura da `node_modules` é calculada baseado-se nas dependências.
1. Ligando dependências. Todas as dependências restantes são baixadas e ligadas do armazenamento para a `node_modules`.

![An illustration of the pnpm install process. Packages are resolved, fetched, and hard linked as soon as possible.](/img/installation-stages-of-pnpm.svg)

Esse formato é significativamente mais rápido que o formato tradicional de instalação, resolução, busca e escrita de dependências para a `node_modules` chamado `three-stage`.

![An illustration of how package managers like Yarn Classic or npm install dependencies.](/img/installation-stages-of-other-pms.svg)

## Creating a non-flat node_modules directory

When installing dependencies with npm or Yarn Classic, all packages are hoisted to the root of the modules directory. As a result, source code has access to dependencies that are not added as dependencies to the project.

By default, pnpm uses symlinks to add only the direct dependencies of the project into the root of the modules directory.

![An illustration of a node_modules directory created by pnpm. Packages in the root node_modules are symlinks to directories inside the node_modules/.pnpm directory](/img/isolated-node-modules.svg)

If you'd like more details about the unique `node_modules` structure that pnpm creates and why it works fine with the Node.js ecosystem, read:
- [node_modules planos não são a única maneira](/blog/2020/05/27/flat-node-modules-is-not-the-only-way)
- [Estrutura da node_modules com links simbólicos (Symlinked)](symlinked-node-modules-structure.md)

:::tip

If your tooling doesn't work well with symlinks, you may still use pnpm and set the [nodeLinker](settings#nodeLinker) setting to `hoisted`. This will instruct pnpm to create a node_modules directory that is similar to those created by npm and Yarn Classic.

:::
