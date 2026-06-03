---
id: faq
title: Perguntas frequentes
---

## Por que minha pasta `node_modules` usa espaço se os pacotes são armazenados globalmente?

pnpm cria [hard links][] do armazenamento global para a pasta `node_modules` de cada projeto. Hard links apontam para o mesmo espaço no disco onde os arquivos originais estão. Então, por exemplo, se você tem o pacote `foo` em seu projeto como uma dependência, e ocupa 1MB de espaço, então irá parecer que ocupa 1MB de espaço na pasta `node_modules`, e 1MB de espaço no armazenamento global. No entanto, esse 1MB é *o mesmo espaço* no disco, apontado de duas localizações diferentes. Então, no total, `foo` ocupa 1MB, não 2MB.

Para mais sobre este assunto:

* [Porque os hard links parecem ocupar o mesmo espaço que os originais?](https://unix.stackexchange.com/questions/88423/why-do-hard-links-seem-to-take-the-same-space-as-the-originals)
* [Uma thread da sala de bate-papo do pnpm](https://gist.github.com/zkochan/106cfef49f8476b753a9cbbf9c65aff1)
* [Uma issue no repositório do pnpm](https://github.com/pnpm/pnpm/issues/794)

## Ele funciona no Windows?

Resposta curta: Sim. Resposta longa: Usando um link simbólico no Windows é problemático pra dizer o mínimo, entretanto, pnpm tem uma solução alternativa/gambiarra. Para Windows, nós usamos [junções][] em vez disso.

## Mas a abordagem aninhada do `node_modules` é incompatível com Windows?

As primeiras versões do npm apresentavam problemas devido ao aninhamento de todos os `node_modules` (veja [essa issue][]). No entanto, pnpm não cria pastas profundas, ele armazena todos os pacotes de forma plana e utiliza links simbólicos para criar a estrutura de dependências.

## E quanto aos links simbólicos circulares?

Mesmo que o pnpm use links para colocar dependências dentro das pastas `node_modules`, symlinks circulares são evitados porque os pacotes-pai são colocados na mesma pasta `node_modules` em que estão suas dependências. Portanto, as dependências de `foo` não estão em `foo/node_modules`, mas `foo` está em `node_modules`, junto com suas próprias dependências.

## Por que usar hard links? Por que não criar um link simbólico direto para o armazenamento global?

Um pacote pode ter diferentes conjuntos de dependências numa mesma máquina.

No projeto **A**, `foo@1.0.0` pode depender de `bar@1.0.0`, mas no projeto **B**, a mesma dependência `foo` pode depender de `bar@1.1.0`; então, pnpm liga `foo@1.0.0` para todos os projetos que o usam, a fim de criar diferentes conjuntos de dependências em cada um deles.

Um link simbólico direto para o armazenamento global iria funcionar com a opção `--preserve-symlinks` do Node, mas essa abordagem viria com uma infinidade de problemas, então nós decidimos continuar utilizando hard links. Para mais detalhes sobre por que esta decisão foi tomada, veja [esta issue][eps-issue].

## O pnpm funciona em diferentes subvolumes em uma partição Btrfs?

Embora o Btrfs não permita hardlinks entre dispositivos de diferentes subvolumes em uma única partição, ele permite reflinks. Como resultado, o pnpm utiliza reflinks para compartilhar dados entre esses subvolumes.

## O pnpm funciona com diversas unidades de armazenamento ou sistemas de arquivos?

O armazenamento global de pacotes deve estar na mesma unidade de armazenamento e utilizando o mesmo sistema de arquivos da instalação. Caso contrário, os pacotes serão copiados, e não vinculados. Isso ocorre devido a uma limitação de como os hard links funcionam - um arquivo num determinado sistema de arquivos não pode ser direcionado para um endereço em outro sistema. Veja a [Issue #712][] para mais detalhes.

pnpm funciona de maneira diferente nos dois casos abaixo:

### O caminho para o armazenamento global é especificado

Se o caminho para o armazenamento for especificado por meio [da configuração](configuring.md), a cópia ocorrerá entre o armazenamento e quaisquer projetos que estejam em um disco diferente.

Se você executar `pnpm install` no disco `A`, o armazenamento pnpm deve estar no disco `A`. Se o armazenamento pnpm estiver localizado no disco `B`, todos os pacotes necessários serão copiados para o local do projeto em vez de serem vinculados. Isso inibe severamente os benefícios de armazenamento e desempenho do pnpm.

### O caminho para o armazenamento global NÃO é especificado

Se o caminho do armazenamento não estiver definido, vários armazenamentos serão criados (um por unidade ou sistema de arquivos).

Se a instalação for executada no disco `A`, o armazenamento será criado em `A``.pnpm-store` na raiz do sistema de arquivos.  Se posteriormente a instalação for executada no disco `B`, um armazenamento independente será criado no `B` em `.pnpm-store`. Os projetos ainda manteriam os benefícios do pnpm, mas cada unidade pode ter pacotes redundantes.

## O que significa `pnpm`?

`pnpm` significa `performant npm`. [@rstacruz](https://github.com/rstacruz/) inventou o nome.

## `pnpm` não funciona com &lt;SEU-PROJETO-AQUI>?

Na maioria dos casos, significa que uma das dependências requer pacotes não declarados em `package.json`. É um erro comum causado por um `node_modules` simples. Se isso acontecer, é um erro na dependência e a dependência deve ser corrigida. Isso pode levar algum tempo, então o pnpm suporta soluções alternativas para fazer os pacotes com bugs funcionarem.

### Solução 1

In case there are issues, you can use the [`nodeLinker: hoisted`][] setting. Isso cria uma estrutura `node_modules` simples similar às criadas pelo `npm`.

### Solução 2

No exemplo a seguir, uma dependência **não** possui o módulo `iterall` em sua própria lista de dependências.

A solução mais fácil para resolver dependências ausentes dos pacotes com bugs é **adicionar `iterall` como uma dependência ao `package.json`**.

Você pode fazer isso instalando-o via `pnpm add iterall`, e será adicionado automaticamente ao `package.json` do seu projeto.

```json
  "dependencies": {
    ...
    "iterall": "^1.2.2",
    ...
  }
```

### Solução 3

Uma das soluções é usar [hooks](pnpmfile.md#hooks) para adicionar as dependências ausentes ao `package.json` do pacote.

Um exemplo era o pacote [Webpack Dashboard][] que não estava funcionando com `pnpm`. Desde então foi resolvido, de forma que funciona agora com `pnpm`.

Costumava gerar um erro:

```console
Error: Cannot find module 'babel-traverse'
  at /node_modules/inspectpack@2.2.3/node_modules/inspectpack/lib/actions/parse
```

O problema era que `babel-traverse` foi usado em `inspectpack` que foi usado por `webpack-dashboard`, mas `babel-traverse` não foi especificado no `package.json` do `inspectpack`. Ainda funcionava com `npm` e `yarn` porque utilizam um `node_modules` simples.

The solution was to create a `.pnpmfile.mjs` with the following contents:

```js
export const hooks = {
  readPackage: (pkg) => {
    if (pkg.name === "inspectpack") {
      pkg.dependencies['babel-traverse'] = '^6.26.0';
    }
    return pkg;
  }
}
```

After creating a `.pnpmfile.mjs`, delete `pnpm-lock.yaml` only - there is no need to delete `node_modules`, as pnpm hooks only affect module resolution. Então, reinstale as dependências & tudo deve estar funcionando.

[hard links]: https://en.wikipedia.org/wiki/Hard_link

[junções]: https://docs.microsoft.com/en-us/windows/win32/fileio/hard-links-and-junctions

[essa issue]: https://github.com/nodejs/node-v0.x-archive/issues/6960

[eps-issue]: https://github.com/nodejs/node-eps/issues/46

[Issue #712]: https://github.com/pnpm/pnpm/issues/712

[`nodeLinker: hoisted`]: settings#nodeLinker

[Webpack Dashboard]: https://github.com/pnpm/pnpm/issues/1043
