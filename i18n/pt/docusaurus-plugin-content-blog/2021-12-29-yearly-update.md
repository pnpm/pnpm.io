---
title: O ano de 2021 para pnpm
authors: zkochan
tags:
  - recap
---

Estamos no final do ano e foi um bom ano para o pnpm, vamos ver como foi.

<!--truncate-->

## Uso

### Números sobre Downloads

Meu objetivo este ano era bater Bower no número de downloads. Conseguimos atingir essa meta [em novembro](https://npm-stat.com/charts.html?package=pnpm&package=bower&from=2021-01-01&to=2021-12-29):

![](/img/blog/pnpm-vs-bower-stats.png)

pnpm foi baixado cerca de [3 vezes mais](https://npm-stat.com/charts.html?package=pnpm&from=2016-12-01&to=2021-12-29) em 2021 do que em 2020:

![](/img/blog/download-stats-2021.png)

:::note

Esses números nem sequer medem todas as diferentes formas que pnpm pode ser instalado! Eles só medem os downloads do pacote npm do [pnpm](https://www.npmjs.com/package/pnpm). Este ano adicionamos também versões binárias compiladas de pnpm, que são enviadas de forma diferente.

:::

### Visitas na Documentação

Coletamos algumas estatísticas não personalizadas de nossa documentação usando o Google Analytics. Em 2021, algumas vezes tivemos mais de 2.000 visitantes únicos dentro de uma semana.

![](/img/blog/ga-unique-visits-2021.png)

A maioria dos nossos usuários são dos Estados Unidos e da China.

![](/img/blog/countries-2021.png)

### Estrelas no GitHub

Nosso [repositório principal do GitHub](https://github.com/pnpm/pnpm) recebeu +5.000 stars este ano.

![](/img/blog/stars-2021.png)

### Novos usuários

Nosso maior usuário esse ano é a [Bytedance](https://github.com/pnpm/pnpm.io/pull/89) (A empresa por trás do TikTok).

Além disso, muitos projetos grandes de código aberto começaram a usar pnpm. Alguns mudaram para pnpm por conta do seu ótimo suporte a monorepos:

* [Vue](https://github.com/vuejs/vue-next)
* [Vite](https://github.com/vitejs/vite)
* e [outros](https://pnpm.io/workspaces#usage-examples)

Alguns mudaram porque gostam de quão eficiente, rápido e bonito o pnpm é:

* [Autoprefixer](https://twitter.com/Autoprefixer/status/1476226146488692736)
* [PostCSS](https://twitter.com/PostCSS/status/1470438664006258701)
* [Browserslist](https://twitter.com/Browserslist/status/1468264308308156419)

## Features que se destacam

### Novo formato de lockfile (desde a [v6.0.0](https://github.com/pnpm/pnpm/releases/tag/v6.0.0))

Uma das primeiras e mais importantes mudanças deste ano foi o novo formato do arquivo `pnpm-lock.yaml`. Esta foi uma breaking change, então tivemos que lançar a v6. Mas foi um sucesso. O antigo lockfile estava causando conflitos no Git com frequência. Desde que o novo formato foi introduzido, não recebemos nenhuma reclamação sobre conflitos do Git.

### Gerenciando Versões do Node (desde [v6.12.0](https://github.com/pnpm/pnpm/releases/tag/v6.12.0))

Enviamos um novo comando (`pnpm env`) que permite gerenciar versões do Node.js. Então você pode usar pnpm em vez de gerenciadores de versão Node.js como nvm ou Volta.

Além disso, o pnpm é fornecido como um executável autônomo, para que você possa executá-lo mesmo sem o Node.js pré-instalado no sistema.

### Gerenciando Versões do Node (desde [v6.20.0](https://github.com/pnpm/pnpm/releases/tag/v6.20.0))

Você pode "injetar" uma dependência local. Por padrão, as dependências locais são vinculadas a `node_modules`, mas com esse novo recurso você pode instruir o pnpm a fazer um link físico dos arquivos do pacote.

### Relatórios aprimorados de problemas de dependência de pares (desde [v6.24.0](https://github.com/pnpm/pnpm/releases/tag/v6.24.0))

Os problemas de dependência de pares costumavam ser impressos como texto simples e era difícil entendê-los. Eles agora estão todos agrupados e impressos em uma boa estrutura de hierarquia.

## A Concorrência

### Yarn

Yarn adicionou um linker pnpm em [v3.1](https://dev.to/arcanis/yarn-31-corepack-esm-pnpm-optional-packages--3hak#new-install-mode-raw-pnpm-endraw-). Para que o Yarn possa criar uma estrutura de diretório de módulos semelhante à que o pnpm cria.

Além disso, a equipe Yarn planeja implementar um armazenamento enderesável por conteúdo para ser mais eficiente em espaço em disco.

### npm

A equipe do npm decidiu adotar também a estrutura de diretórios de módulos de nó com link simbólico que o pnpm usa (relacionado [RFC](https://github.com/npm/rfcs/blob/main/accepted/0042-isolated-mode.md)).

### Outros

[Bun](https://twitter.com/jarredsumner/status/1473416431291174912/photo/1) escrito em Zig e [Volt](https://github.com/voltpkg/volt) escrito em Rust ambos afirmam ser mais rápido do que npm/Yarn/pnpm. Ainda não fiz benchmark desses novos gerentes de pacotes.

## Planos futuros

Mais rápido, melhor, melhor.
