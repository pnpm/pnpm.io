---
id: versão-2-faq
title: Perguntas Frequentes
original_id: versão-2-faq
---

## Por que minha pasta `node_modules` usa espaço em disco se os pacotes são armazenados em um armazenamento global?

O pnpm cria [hard links](https://en.wikipedia.org/wiki/Hard_link) da loja global para as pastas `node_modules` do projeto.
Os links físicos apontam para o mesmo lugar no disco onde estão os arquivos originais.
Então, por exemplo, se você tem `foo` no seu projeto como uma dependência e ocupa 1MB de espaço,
então parecerá que ocupa 1MB de espaço na pasta `node_modules` do projeto e
a mesma quantidade de espaço na loja global. No entanto, esse 1MB é * o mesmo espaço * no disco
abordada a partir de dois locais diferentes. Então, no total, 'foo` ocupa 1MB,
não 2MB.

Para mais sobre este assunto:

* [Por que os hard links parecem ocupar o mesmo espaço que os originais?](https://unix.stackexchange.com/questions/88423/why-do-hard-links-seem-to-take-the-same-space-as-the-originals)
* [Um tópico da sala de bate-papo do pnpm](https://gist.github.com/zkochan/106cfef49f8476b753a9cbbf9c65aff1)
* [Um problema no repositório pnpm](https://github.com/pnpm/pnpm/issues/794)

## Funciona no Windows? É mais difícil criar links simbólicos no Windows

Usando links simbólicos no Windows é realmente problemático. É por isso que o pnpm usa junções em vez de links simbólicos no sistema operacional Windows.

## Funciona no Windows? A abordagem `node_modules` aninhada é basicamente incompatível com o Windows

Versões anteriores do npm tinham problemas por causa do aninhamento de todos os `node_modules` (veja [A abordagem node_modules aninhada do node é basicamente incompatível com o Windows](https://github.com/nodejs/node-v0.x-archive/issues/6960)) . No entanto, o pnpm não cria pastas profundas, armazena todos os pacotes de forma simples e usa links simbólicos para criar a estrutura da árvore de dependência.

## E os links simbólicos circulares?

Embora o pnpm use links simbólicos para colocar dependências em pastas `node_modules`, links simbólicos circulares são evitados porque os pacotes pai são colocados na mesma pasta` node_modules` na qual suas dependências estão. Portanto, as dependências de `foo` não estão em` foo/node_modules`, mas `foo` está em` node_modules/foo`, junto com suas próprias dependências.

## Por que tem links rígidos? Por que não ligar diretamente à loja global?

Um pacote pode ter diferentes conjuntos de dependências em uma máquina.

No projeto **A** `foo @ 1.0.0` pode ter dependência resolvida para` bar @ 1.0.0` mas no projeto **B** a mesma dependência de `foo` pode resolver para `bar@1.1.0 `. Então pnpm hard links `foo @ 1.0.0` para todo projeto onde é usado, para criar diferentes conjuntos de dependências para ele.

O symlinking direto para o repositório global funcionaria com o sinalizador `--preserve-symlinks` do Node. Mas `--preserve-symlinks` vem
com um monte de questões diferentes, então decidimos ficar com hard links.
Para mais detalhes sobre o porquê desta decisão, consulte: https://github.com/nodejs/node-eps/issues/46.

## O pnpm funciona em vários discos rígidos ou sistemas de arquivos?

O armazenamento de pacotes deve estar no mesmo disco que as instalações.
Caso contrário, os pacotes serão copiados, não vinculados.
Isso é devido a uma limitação do sistema operacional em hard-linking. Veja [Issue # 712](https://github.com/pnpm/pnpm/issues/712) para mais detalhes.

O pnpm funciona de maneira diferente com base nos dois casos abaixo:

### O caminho da loja é especificado

Se o caminho de armazenamento for especificado por meio da [configuração de armazenamento](configuring.md), a cópia ocorrerá entre o armazenamento e todos os projetos que estiverem em um disco diferente.

Se você executar `pnpm install` no disco`D: `, então o armazenamento pnpm deve estar no disco`D:`.
Se o repositório pnpm estiver localizado no disco `C:`, todos os pacotes requeridos serão copiados diretamente para o local do projeto.
Isso reduz severamente os benefícios do pnpm.

### O caminho da loja NÃO está especificado

Se o caminho da loja não estiver configurado, várias lojas serão criadas (uma para cada unidade ou sistema de arquivos).

Se a instalação for executada no disco `D:`, o armazenamento será criado em `D:\.pnpm-store`.
Se mais tarde a instalação for executada no disco `C:`, uma loja independente será criada em `C:\.pnpm-store`.
Os projetos ainda manteriam os benefícios do pnpm, mas cada unidade pode ter pacotes redundantes.

## O que o `pnpm store prune` faz? Isso é prejudicial?

O comando `pnpm store prune` remove _pacotes não referenciados_.

Pacotes não referenciados são pacotes que não são usados ​​por nenhum projeto no sistema.
Os pacotes podem se tornar não referenciados após a maioria das operações de instalação.

Por exemplo: durante o `pnpm install`, o pacote`foo@1.0.0` é atualizado para `foo@1.0.1`.
O pnpm manterá o `foo@1.0.0` na loja, já que ele não remove pacotes automaticamente.
Se o pacote `foo@1.0.0` não for usado por nenhum outro projeto no sistema, ele não será referenciado.
Rodar `pnpm store prune` removeria`foo@1.0.0` da loja.

Rodar `pnpm store prune` não é prejudicial e não tem efeitos colaterais em seus projetos.
Se futuras instalações exigirem pacotes removidos, o pnpm irá baixá-los novamente.

É uma prática recomendada executar o `pnpm store prune` ocasionalmente para limpar a loja, mas não com muita freqüência.
Às vezes, os pacotes não referenciados tornam-se obrigatórios novamente.
Isso pode ocorrer ao alternar ramificações e instalar dependências mais antigas.
Em seguida, o pnpm precisaria baixar novamente todos os pacotes removidos, abreviando o processo de instalação.

## O que significa `pnpm`?

`pnpm` significa` performance_npm`. [Rico Sta. Cruz](https://github.com/rstacruz/) veio com o nome.

## `pnpm` não funciona com o <YOUR-PROJECT-HERE>?

Na maioria dos casos, isso significa que uma das dependências requer pacotes não declarados em `package.json`.
É um erro comum causado pelo flat `node_modules`. Se isso acontecer, isso é um erro na dependência e
dependência deve ser corrigida. Isso pode levar algum tempo, portanto, o pnpm suporta soluções alternativas para que os pacotes com bugs funcionem.

### Solução 1

No exemplo a seguir, uma dependência **não** tem o módulo `iterall` em sua própria lista de dependências.

A solução mais fácil para resolver dependências ausentes dos pacotes com bugs é **adicionar `iterall` como uma dependência do` package.json`** do nosso projeto.

Você pode fazê-lo, instalando-o via:

`pnpm i iterall`

Ele será automaticamente adicionado ao `package.json` do seu projeto.

```json
  "dependencies": {
    ...
    "iterall": "^1.2.2",
    ...
  }
```

### Solução 2

Uma das soluções é usar [hooks](hooks.md) para adicionar as dependências ausentes ao pacote `package.json`.

Um exemplo foi o [Webpack Dashboard](https://github.com/pnpm/pnpm/issues/1043) que não estava funcionando com o `pnpm`. Desde então, foi resolvido de forma que funciona com o `pnpm` agora.

Costumava lançar um erro:

```console
Error: Cannot find module 'babel-traverse'
  at /node_modules/.registry.npmjs.org/inspectpack/2.2.3/node_modules/inspectpack/lib/actions/parse
```

O problema era que o `babel-traverse` era usado na biblioteca` inspectpack` que era usada pelo `webpack-dashboard`. Mas `babel-traverse` não foi especificado em` package.json` do `inspectpack`. Ele ainda trabalhava com `npm` e` yarn` porque eles criam flat `node_modules`.

A solução foi criar um `pnpmfile.js` com o seguinte conteúdo:

```js
module.exports = {
  hooks: {
    readPackage (pkg) {
      switch (pkg.name) {
        case 'inspectpack':
          pkg.dependencies['babel-traverse'] = '^6.26.0'
          break
      }
      return pkg
    }
  }
}
```

Depois de criar `pnpmfile.js`, exclua` shrinkwrap.yaml` apenas. Não há necessidade de deletar `node_modules`. Em seguida, instale as dependências e ele deve estar funcionando.

### Solução 3

Caso haja muitos problemas, você pode usar a configuração `shamefully-flatten`. Isto cria uma estrutura plana `node_modules` semelhante à criada pelo` npm` ou `yarn`.

Para usá-lo, tente `pnpm install --shaefish-flatten`.