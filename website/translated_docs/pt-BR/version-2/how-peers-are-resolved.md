---
id: version-2-how-peers-are-resolved
title: Como os pares são resolvidos
original_id: como-peers-are-resolved
---

Um dos grandes recursos do pnpm é que, em um projeto, uma versão específica de um pacote sempre terá
um conjunto de dependências. Há uma exclusão dele - pacotes com [dependências de pares](https://docs.npmjs.com/files/package.json#peerdependencies).

Dependências de pares são resolvidas de dependências instaladas mais acima no gráfico de dependência.
Isto significa que se `foo@1.0.0` tiver dois pares (` bar@^1` e `baz@^1`) então pode ter diferentes conjuntos de dependências
no mesmo projeto.

```
- foo-pai-1
  - bar@1.0.0
  - baz@1.0.0
  - foo@1.0.0
- foo-pai-2
  - bar@1.0.0
  - baz@1.1.0
  - foo@1.0.0
```

No exemplo acima, `foo@1.0.0` é instalado para `foo-parent-1` e `foo-parent-2`. Ambos os pacotes tem `bar` e `baz`as bem, mas
eles dependem de diferentes versões do `baz`. Como resultado, `foo@1.0.0` tem dois conjuntos diferentes de dependências: um com `baz@1.0.0`
e o outro com `baz@1.1.0`. Para suportar estes casos de uso, o pnpm tem que linkar rigidamente o `foo@1.0.0` tantas vezes quantos conjuntos de dependências ele tiver.

Normalmente, se um pacote não tem dependências de peer, ele é ligado a uma pasta `node_modules` ao lado de links simbólicos de suas dependências.

![](/img/how-peers-are-resolved/1.png)

No entanto, se `foo` tiver dependências de pares, não pode haver um único conjunto de dependências para ele, então
criamos conjuntos diferentes para diferentes resoluções de dependência de pares:

![](/img/how-peers-are-resolved/2.png)

Nós criamos links simbólicos para o `foo` que está dentro de `bar@1.0.0 + baz@1.0.0/node_modules` ou para o de `bar@1.0.0 + baz@1.1.0/node_modules`.
Como consequência, o algoritmo do resolvedor do módulo Node.js encontrará os pares corretos.

*Se o par resolvido for uma dependência direta do projeto*, ele não será agrupado separadamente com o pacote dependente.
Isso é feito para facilitar a criação de instalações com um nome previsível e rápido (`pnpm i foo`) e geral (`pnpm i`).
Então, se o projeto depender de `bar @ 1.0.0`, as dependências do nosso exemplo serão agrupadas assim:

![](/img/how-peers-are-resolved/3.png)

*Se um pacote não tiver dependências ponto a ponto, mas tiver dependências com pares resolvidos mais alto no gráfico*,
Esse pacote transitivo pode aparecer no projeto com diferentes conjuntos de dependências. Por exemplo, existe o pacote `a@1.0.0`
com uma única dependência `framework@1.0.0`. `framework@1.0.0` tem uma dependência de peer` plugin@^1`. `a@1.0.0` nunca resolverá o problema
pares de `framework@1.0.0`, por isso torna-se dependente dos pares de `framework@1.0.0` também.

Veja como ficará em `node_modules/.registry.npmjs.org`, no caso, se `a@1.0.0` precisar aparecer duas vezes no projeto
`node_modules`, uma vez resolvido com `plugin@1.0.0` e uma vez com `plugin@1.1.0`.

![](/img/how-peers-are-resolved/4.png)` 