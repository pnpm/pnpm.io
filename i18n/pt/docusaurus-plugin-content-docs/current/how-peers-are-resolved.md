---
id: how-peers-are-resolved
title: Como os pares são resolvidos
---

Um dos melhores recursos do pnpm é que em um projeto, uma versão específica de um pacote sempre terá um conjunto de dependências. There is one exception from this rule, though - packages with [peer dependencies][].

As dependências de peer são resolvidas a partir de dependências instaladas mais acima no gráfico de dependência, pois compartilham a mesma versão que seu pai. Isso significa que, se `foo@1.0.0` tiver dois pares (`bar@^1` e `baz@^1`), ele poderá ter vários conjuntos diferentes de dependências no mesmo projeto.

```text
- foo-parent-1
  - bar@1.0.0
  - baz@1.0.0
  - foo@1.0.0
- foo-parent-2
  - bar@1.0.0
  - baz@1.1.0
  - foo@1.0.0
```

No exemplo acima, `foo@1.0.0` está instalado para `foo-parent-1` e `foo-parent-2`. Both packages have `bar` and `baz` as well, but they depend on different versions of `baz`. Como resultado, `foo@1.0.0` tem dois conjuntos diferentes de dependências: um com `baz@1.0.0` e outro com `baz@1.1.0`. Para dar suporte a esses casos de uso, o pnpm precisa vincular `foo@1.0.0` tantas vezes quanto existem diferentes conjuntos de dependências.

Normalmente, se um pacote não possui dependências de pares, ele é vinculado a uma pasta `node_modules` próxima aos links simbólicos de suas dependências, assim:

```text
node_modules
└── .pnpm
    ├── foo@1.0.0
    │   └── node_modules
    │       ├── foo
    │       ├── qux   -> ../../qux@1.0.0/node_modules/qux
    │       └── plugh -> ../../plugh@1.0.0/node_modules/plugh
    ├── qux@1.0.0
    ├── plugh@1.0.0
```

No entanto, se `foo` tiver dependências de pares, pode haver vários conjuntos de dependências para ele, então criamos conjuntos diferentes para diferentes resoluções de dependência de pares:

```text
node_modules
└── .pnpm
    ├── foo@1.0.0_bar@1.0.0+baz@1.0.0
    │   └── node_modules
    │       ├── foo
    │       ├── bar   -> ../../bar@1.0.0/node_modules/bar
    │       ├── baz   -> ../../baz@1.0.0/node_modules/baz
    │       ├── qux   -> ../../qux@1.0.0/node_modules/qux
    │       └── plugh -> ../../plugh@1.0.0/node_modules/plugh
    ├── foo@1.0.0_bar@1.0.0+baz@1.1.0
    │   └── node_modules
    │       ├── foo
    │       ├── bar   -> ../../bar@1.0.0/node_modules/bar
    │       ├── baz   -> ../../baz@1.1.0/node_modules/baz
    │       ├── qux   -> ../../qux@1.0.0/node_modules/qux
    │       └── plugh -> ../../plugh@1.0.0/node_modules/plugh
    ├── bar@1.0.0
    ├── baz@1.0.0
    ├── baz@1.1.0
    ├── qux@1.0.0
    ├── plugh@1.0.0
```

Criamos links simbólicos para o `foo` que está dentro `foo@1.0.0_bar@1.0.0+baz@1.0.0` ou para aquele em `foo@1.0.0_bar@1.0.0+baz@1.1.0`. Como consequência, o resolvedor do módulo Node.js encontrará os pares corretos.

*Se um pacote não tem dependências de pares, mas tem dependências com pares que são resolvidos mais acima no gráfico*, então esse pacote transitivo pode aparecer no projeto com diferentes conjuntos de dependências. Por exemplo, há o pacote `a@1.0.0` com uma única dependência `b@1.0.0`. `b@1.0.0` tem uma dependência de pares `c@^1`. `a@1.0.0` nunca resolverá os peers de `b@1.0.0`, então torna-se dependente dos peers de `b@1.0.0` também.

Veja como essa estrutura ficará em `node_modules`. Neste exemplo, `a@1.0.0` precisarão aparecer duas vezes nos `node_modules` do projeto uma vez com `c@1.0.0` e novamente com `c@1.1.0`.

```text
node_modules
└── .pnpm
    ├── a@1.0.0_c@1.0.0
    │   └── node_modules
    │       ├── a
    │       └── b -> ../../b@1.0.0_c@1.0.0/node_modules/b
    ├── a@1.0.0_c@1.1.0
    │   └── node_modules
    │       ├── a
    │       └── b -> ../../b@1.0.0_c@1.1.0/node_modules/b
    ├── b@1.0.0_c@1.0.0
    │   └── node_modules
    │       ├── b
    │       └── c -> ../../c@1.0.0/node_modules/c
    ├── b@1.0.0_c@1.1.0
    │   └── node_modules
    │       ├── b
    │       └── c -> ../../c@1.1.0/node_modules/c
    ├── c@1.0.0
    ├── c@1.1.0
```

[peer dependencies]: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#peerdependencies
