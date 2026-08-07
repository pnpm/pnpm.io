---
title: O ano de 2022 para o pnpm
authors: zkochan
image: "/img/blog/2022-review.png"
tags:
  - recap
---

É o final do ano. Um ano muito difícil. Como você deve saber, moro na Ucrânia, então devido à guerra da Rússia contra nós, foi mais difícil liderar este projeto do que nos anos anteriores. Ainda assim, foi um bom ano para o pnpm. Temos muitos novos usuários, colaboradores e implementamos muitos recursos excelentes.

![](/img/blog/2022-review.png)

(a ilustração acima foi gerada pela Midjourney. O tigre simboliza o ano do tigre)

<!--truncate-->

## Uso

### Números sobre Downloads

Meu objetivo este ano era bater Lerna pelo número de downloads. Conseguimos atingir essa meta [em agosto](https://npm-stat.com/charts.html?package=pnpm&package=lerna&from=2022-01-01&to=2022-12-30):

![](/img/blog/pnpm-vs-lerna-stats.png)

pnpm foi baixado [5 vezes mais](https://npm-stat.com/charts.html?package=pnpm&from=2016-12-01&to=2022-12-30) em 2022 do que em 2021:

![](/img/blog/download-stats-2022.png)

### Visitas na Documentação

Coletamos algumas estatísticas não personalizadas de nossa documentação usando o Google Analytics. Em 2022, algumas vezes tivemos mais de 20.000 visitantes únicos dentro de uma semana. Isso é 10 vezes mais do que em 2021!

![](/img/blog/ga-unique-visits-2022.png)

### Estrelas no GitHub

Nosso [repositório principal do GitHub](https://github.com/pnpm/pnpm) recebeu +7.000 estrelas este ano.

![](/img/blog/stars-2022.png)

### Nossos colaboradores

Tivemos muitos contribuidores novos e ativos este ano. Estas são as pessoas que mesclam pelo menos uma "Pull Request" em 2022:

* [Zoltan Kochan](https://github.com/zkochan)
* [chlorine](https://github.com/lvqq)
* [await-ovo](https://github.com/await-ovo)
* [Brandon Cheng](https://github.com/gluxon)
* [Dominic Elm](https://github.com/d3lm)
* [MCMXC](https://github.com/mcmxcdev)
* [那里好脏不可以](https://github.com/dev-itsheng)
* [Homyee King](https://github.com/HomyeeKing)
* [Shinobu Hayashi](https://github.com/Shinyaigeek)
* [Black-Hole](https://github.com/BlackHole1)
* [Kenrick](https://github.com/kenrick95)
* [Weyert de Boer](https://github.com/weyert)
* [Glen Whitney](https://github.com/gwhitney)
* [Cheng](https://github.com/chengcyber)
* [zoomdong](https://github.com/fireairforce)
* [thinkhalo](https://github.com/ufec)
* [子瞻 Luci](https://github.com/LuciNyan)
* [spencer17x](https://github.com/Spencer17x)
* [liuxingbaoyu](https://github.com/liuxingbaoyu)
* [장지훈](https://github.com/WhiteKiwi)
* [Jon de la Motte](https://github.com/jondlm)
* [Jack Works](https://github.com/Jack-Works)
* [milahu](https://github.com/milahu)
* [David Collins](https://github.com/David-Collins)
* [nikoladev](https://github.com/nikoladev)
* [Igor Bezkrovnyi](https://github.com/ibezkrovnyi)
* [Lev Chelyadinov](https://github.com/illright)
* [javier-garcia-meteologica](https://github.com/javier-garcia-meteologica)

## Features que se destacam

### Suportando um hoisted `node_modules` sem links simbólicos (desde [v6.25.0](https://github.com/pnpm/pnpm/releases/tag/v6.25.0))

Logo no início de 2022, nós adicionamos suporte para o “tradicional” hoisted (também conhecido como flat `node_modules`). Usamos o algoritmo de elevação do Yarn para criar um `node_modules`elevado adequado. Esta nova configuração basicamente tornou o pnpm compatível com todos os stack de Node.js que são compatíveis com a CLI do npm.

Para usar a estrutura de diretório hoisted `node_modules`, use a configuração `node-linker=hoisted` em um arquivo `.npmrc`.

### Cache de efeitos colaterais (desde [v7.0.0](https://github.com/pnpm/pnpm/releases/tag/v7.0.0))

Desde v7, [side-effect-cache][] é ativado por padrão, então as dependências que devem ser construídas são construídas apenas uma vez por máquina. Isso melhora muito a velocidade de instalação em projetos que têm dependências com scripts de compilação.

### Correção de dependências (desde [v7.4.0](https://github.com/pnpm/pnpm/releases/tag/v7.4.0))

O comando [`pnpm patch`][] foi adicionado para corrigir dependências em seus `node_modules`.

### Estratégia de resolução baseada em tempo (desde [v7.10.0](https://github.com/pnpm/pnpm/releases/tag/v7.10.0))

Um novo modo de resolução foi adicionado ao pnpm, que deve tornar a atualização de dependências mais segura. Você pode alterar o modo de resolução com a configuração [resolution-mode][].

### Listando licenças de dependências (desde [v7.17.0](https://github.com/pnpm/pnpm/releases/tag/v7.17.0))

Agora você pode usar o comando [`pnpm licenses list`][] para verificar as licenças dos pacotes instalados.

[side-effect-cache]: /npmrc#side-effects-cache

[`pnpm patch`]: /cli/patch

[resolution-mode]: https://pnpm.io/npmrc#resolution-mode

[`pnpm licenses list`]: /cli/licenses

