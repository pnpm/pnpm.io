---
title: node_modules planos não são a única maneira
authors: zkochan
---

Novos usuários do pnpm frequentemente me perguntam acerca da estranha estrutura do `node_modules` que o pnpm cria. Por que não é plano? Onde estão todas as sub-dependências?

<!--truncate-->

> Vou assumir que os leitores do artigo já estão familiarizados com o `node_modules` plano criado pelo npm e Yarn. Se você não entende por que o npm 3 teve que começar a usar `node_modules` planos na v3, você pode encontrar um pouco da história em [Por que devemos usar o pnpm?](https://www.kochan.io/nodejs/why-should-we-use-pnpm.html).

Então, por que o `node_modules` do pnpm é incomum? Vamos criar dois diretórios e executar `npm add express` em um deles e `pnpm add express` no outro. Aqui está o início do `node_modules` do primeiro diretório:

```text
.bin
accepts
array-flatten
body-parser
bytes
content-disposition
cookie-signature
cookie
debug
depd
destroy
ee-first
encodeurl
escape-html
etag
express
```

Você pode ver todo o diretório [aqui](https://github.com/zkochan/comparing-node-modules/tree/master/npm-example/node_modules).

E é isso que você obtém no `node_modules` criado pelo pnpm:

```text
.pnpm
.modules.yaml
express
```

Você pode conferir [aqui](https://github.com/zkochan/comparing-node-modules/tree/master/pnpm5-example/node_modules).

Então, onde estão todas as dependências? Existe apenas uma pasta em `node_modules` chamada `.pnpm` e um link simbólico chamado `express`. Bem, instalamos apenas `express`, então esse é o único pacote que sua aplicação tem que ter acesso

> Leia mais sobre porque o rigor do pnpm é uma coisa boa [aqui](https://medium.com/pnpm/pnpms-strictness-helps-to-avoid-silly-bugs-9a15fb306308)

Vamos ver o que está dentro de `express`:

```text
▾ node_modules
  ▸ .pnpm
  ▾ express
    ▸ lib
      History.md
      index.js
      LICENSE
      package.json
      Readme.md
  .modules.yaml
```

`express` não tem `node_modules`? Onde estão todas as dependências de `express`?

O truque é que `express` é apenas um link simbólico. Quando o Node.js resolve dependências, ele usa suas localizações reais, portanto, não preserva links simbólicos. Mas onde está a localização real de `express`, você pode perguntar?

Aqui: [node_modules/.pnpm/express@4.17.1/node_modules/express](https://github.com/zkochan/comparing-node-modules/tree/master/pnpm5-example/node_modules/.pnpm/express@4.17.1/node_modules/express).

OK, agora sabemos o propósito da pasta `.pnpm/`. `.pnpm/` armazena todos os pacotes em uma estrutura de pastas simples, então cada pacote pode ser encontrado em uma pasta nomeada por este padrão:

```text
.pnpm/<name>@<version>/node_modules/<name>
```

Nós o chamamos de virtual store directory.

Essa estrutura plana evita os problemas de longos diretórios causados pelo `node_modules` aninhados criado pelo npm v2, mas mantém os pacotes isolados ao contrário dos `node_modules` criados pelo npm v3,4,5,6 ou Yarn v1.

Agora vamos olhar para a localização real de `express`:

```text
  ▾ express
    ▸ lib
      History.md
      index.js
      LICENSE
      package.json
      Readme.md
```

É uma farsa? Ainda falta `node_modules`! The second trick of pnpm's `node_modules` structure is that the dependencies of packages are on the same directory level as the real location of the dependent package. Portanto, as dependências de `express` não estão em `.pnpm/express@4.17.1/node_modules/express/node_modules/` mas em [.pnpm/express@4.17.1/node_modules/](https://github.com/zkochan/comparing-node-modules/tree/master/pnpm5-example/node_modules/.pnpm/express@4.17.1/node_modules):

```text
▾ node_modules
  ▾ .pnpm
    ▸ accepts@1.3.5
    ▸ array-flatten@1.1.1
    ...
    ▾ express@4.16.3
      ▾ node_modules
        ▸ accepts
        ▸ array-flatten
        ▸ body-parser
        ▸ content-disposition
        ...
        ▸ etag
        ▾ express
          ▸ lib
            History.md
            index.js
            LICENSE
            package.json
            Readme.md
```

Todas as dependências de `express` são links simbólicos para diretórios apropriados em `node_modules/.pnpm/`. Colocar dependências de `express` um nível acima permite evitar links simbólicos circulares.

Então, como você pode ver, mesmo que o `node_modules` do pnpm pareça incomum no início:

1. é totalmente compatível com Node.js
2. os pacotes são bem agrupados com suas dependências

A estrutura é um pouco [mais complexa](/how-peers-are-resolved) para pacotes com dependências peer, mas a ideia é a mesma: usar links simbólicos para criar um aninhamento com uma estrutura de diretório simples.
