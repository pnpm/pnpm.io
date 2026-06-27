---
id: pnpm-vs-npm
title: pnpm vs npm
---

## A estrutura plana do npm

O npm mantêm uma [estrutura de dependências plana][] desde a versão 3. Isso faz com que menos espaço em disco seja utilizado, mas tem o efeito colateral de deixar a pasta `node_modules` bagunçada.

Por outro lado, pnpm gerencia `node_modules` utilizando hard links e links simbólicos, direcionados a um armazenamento global. This lets you get the benefits of far less disk space usage, while also keeping your `node_modules` clean. Há documentação acerca do[layout do armazenamento global][] se você quiser saber mais.

A coisa boa sobre a estrutura adequada do `node_modules` feita pelo pnpm é que "[ela ajuda a evitar bugs][]" ao tornar impossível que sejam usados módulos não especificados no `package.json` do projeto.

## Instalação

pnpm não permite a instalação de pacotes sem salvá-los no `package.json`. Se nenhum parâmetro for passado para `pnpm add`, pacotes são salvos como dependências. Assim como no npm, `--save-dev` e `--save-optional` podem ser utilizados para instalar pacotes como dependências de desenvolvimento ou opcionais.

Como consequência dessa limitação, projetos não terão nenhum pacote estranho ao usarem pnpm, a não ser que removam uma dependência e deixem-na órfã. Por isso que a implementação do pnpm do [comando prune][] não permite que você especifique quais pacotes serão removidos - ele SEMPRE remove todos os pacotes estranhos e órfãos.

## Dependências de diretório

Dependências de diretório começam com o prefixo `file:` e apontam para um diretório no sistema de arquivos. Assim como o npm, pnpm cria um link simbólico para essas dependências. Ao contrário do npm, pnpm não instala as dependências do arquivo.

Isso significa que se você tem um pacote chamado `foo` (`<root>/foo`) que tem `bar@file:../bar` como dependência, pnpm não irá instalar dependências de `<root>/bar` quando você executar `pnpm install` em `foo`.

Se você precisar executar instalações em vários pacotes ao mesmo tempo, como em um monorepo, você deve ver a documentação para [`pnpm -r`][].

[estrutura de dependências plana]: https://github.com/npm/npm/issues/6912
[layout do armazenamento global]: symlinked-node-modules-structure
[ela ajuda a evitar bugs]: https://www.kochan.io/nodejs/pnpms-strictness-helps-to-avoid-silly-bugs.html

[comando prune]: cli/prune

[`pnpm -r`]: cli/recursive
