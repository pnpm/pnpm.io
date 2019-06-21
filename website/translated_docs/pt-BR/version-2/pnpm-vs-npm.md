---
id: versão-2-pnpm-vs-npm
title: pnpm vs npm
original_id: pnpm-vs-npm
---

## npm's flat tree

O npm mantém uma [árvore de dependência simplificada](https://github.com/npm/npm/issues/6912) a partir da versão 3.
Isto leva a menos inchaço do espaço em disco, com um diretório `node_modules` bagunçado como um efeito colateral.

Por outro lado, o pnpm gerencia `node_modules` como um armazenamento endereçável em seu [store layout] (about-the-package-store.md).
Isso te dá os benefícios de menos uso de espaço em disco, enquanto mantém seu `node_modules` limpo.

A coisa boa sobre a estrutura `node_modules` adequada do pnpm é que ela [ajuda a evitar bugs bobo](https://www.kochan.io/nodejs/pnpms-strictness-helps-to-avoid-silly-bugs.html) por impossibilitando o uso de módulos
que não estão especificados no `package.json` do projeto.

## Instalação

O pnpm não permite a instalação de pacotes sem salvá-los em `package.json`.
Se nenhum parâmetro for passado para o `pnpm install`, os pacotes serão salvos como dependências regulares.
Como com npm, `--save-dev` e` --save-optional` podem ser usados ​​para instalar pacotes como dev ou dependências opcionais.

Como conseqüência dessa limitação, os projetos não terão pacotes estranhos quando usarem o pnpm.
É por isso que a implementação do pnpm do comando [prune](https://docs.npmjs.com/cli/prune) não
tem a possibilidade de executar pacotes específicos. poda do pnpm sempre remove todos os pacotes estranhos.

## Dependências de diretório

Dependências de diretório são aquelas que começam com o prefixo `file:` e apontam para um diretório no sistema de arquivos.
Como o npm, o pnpm vincula essas dependências. Ao contrário do npm, o pnpm não executa a instalação para as dependências do arquivo.
Então, se você tem o pacote `foo` (em `home/src/foo`), que tem uma dependência `bar@file:../bar`, o pnpm não executará a instalação em `/home/src/bar`.

Se você precisa executar instalações em vários pacotes ao mesmo tempo (talvez você tenha um monorepo), você pode querer usar [pnpmr](https://github.com/pnpm/pnpmr). O pnpmr procura pacotes e executa o `pnpm install` para eles na ordem correta.