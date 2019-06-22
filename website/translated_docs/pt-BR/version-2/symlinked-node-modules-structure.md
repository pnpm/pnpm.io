---
id: versão-2-symlinked-node-modules-structure
title: Estrutura `node_modules` com link simbólico
original_id: symlinked-node-modules-structure
---

> Este artigo descreve apenas como os `node_modules` do pnpm são estruturados quando não há pacotes com dependências peer.
> Para o cenário mais complexo de dependências com pares, consulte [Como os pares são resolvidos](how-peers-are-resolved.md).

O layout `node_modules` do pnpm usa links simbólicos para criar uma estrutura aninhada de dependências.

Cada `package @ version` está ligado a` node_modules` do [global store](about-the-package-store.md) apenas uma vez.
Vamos supor que você instale o `foo@1.0.0` que depende do `bar@1.0.0`. O pnpm irá linkar ambos os pacotes para `node_modules` assim:

```
node_modules
└─ .registry.npmjs.org
   ├─ bar/1.0.0/node_modules/bar
   |  ├─ index.js
   |  └─ package.json
   └─ foo/1.0.0/node_modules/foo
      ├─ index.js
      └─ package.json
```

Estes são os únicos "arquivos reais" em `node_modules`. Uma vez que todos os pacotes são linkados para `node_modules`, os links simbólicos são
criado para construir a estrutura do gráfico de dependência aninhada.

Como você deve ter notado, ambos os pacotes são hard linkados em uma subpasta dentro de uma pasta `node_modules` (`foo/1.0.0/node_modules/foo`).
Isso é necessário para:

1. **permite que os pacotes exijam a si mesmos.** `foo` deve ser capaz de fazer `require'foo/package.json') `.
2. **Evite links simbólicos circulares.** As dependências dos pacotes são colocadas na mesma pasta em que estão os pacotes dependentes.
Para o Node.js não faz diferença se as dependências estão dentro do `node_modules` do pacote ou em qualquer outro
`node_modules` nos diretórios pai.

O próximo estágio da instalação é o symlinking dependencies. `bar` vai ser ligado por links simbólicos à pasta `foo/1.0.0/node_modules`:

```
node_modules
└─ .registry.npmjs.org
   ├─ bar/1.0.0/node_modules/bar
   └─ foo/1.0.0/node_modules
      ├─ foo
      └─ bar -> ../../../bar/1.0.0/node_modules/bar
```

`foo` vai ser ligado por links simbólicos à pasta root `node_modules` porque `foo` é uma dependência do projeto:

```
node_modules
├─ foo -> .registry.npmjs.org/foo/1.0.0/node_modules/foo
└─ .registry.npmjs.org
   ├─ bar/1.0.0/node_modules/bar
   └─ foo/1.0.0/node_modules
      ├─ foo
      └─ bar -> ../../../bar/1.0.0/node_modules/bar
```

Este é um exemplo muito simples. No entanto, o layout permanecerá plano no sistema de arquivos, independentemente do número de dependências
e a profundidade do gráfico de dependência.

Vamos adicionar `qar@2.0.0` como uma dependência de `bar` e `foo`. É assim que o `node_modules` se parecerá:

```
node_modules
├─ foo -> .registry.npmjs.org/foo/1.0.0/node_modules/foo
└─ .registry.npmjs.org
   ├─ qar/2.0.0/node_modules/qar
   ├─ bar/1.0.0/node_modules
   |  ├─ bar
   |  └─ qar -> ../../../qar/2.0.0/node_modules/qar
   └─ foo/1.0.0/node_modules
      ├─ foo
      ├─ qar -> ../../../qar/2.0.0/node_modules/qar
      └─ bar -> ../../../bar/1.0.0/node_modules/bar
```

Como você pode ver, mesmo que a profundidade do gráfico seja maior (`foo> bar> qar`), a profundidade do diretório no sistema de arquivos ainda é a mesma.

Este layout pode parecer estranho à primeira vista, mas é completamente compatível com o Node.js! Ao resolver os módulos, o Node.js ignora os links simbólicos.
Então, quando `bar` é requerido de `foo/1.0.0/node_modules/foo/index.js`, o Node.js não está usando `bar` de `foo/1.0.0/node_modules/bar`.
`bar` é resolvido para sua localização real: `bar/1.0.0/node_modules/bar`. Como conseqüência, o `bar` também pode resolver suas dependências
que estão em `bar/1.0.0/node_modules`.

Um ótimo bônus deste layout é que somente os pacotes que estão realmente nas dependências estão acessíveis. Com `node_modules` aplanados, todos hasteados
pacotes estão acessíveis. Para ler mais sobre por que isso é uma vantagem, veja [o rigor do pnpm ajuda a evitar erros bobos](https://www.kochan.io/nodejs/pnpms-strictness-helps-to-avoid-silly-bugs.html).