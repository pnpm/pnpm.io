---
title: Opções de configuração com pnpm
authors: zkochan
---

Existem diversas maneiras de criar um diretório node_modules. Seu objetivo deve ser criar o mais estrito, mas caso não seja possível, há opções para criar um node_modules solto também.

<!--truncate-->

## A configuração padrão

Por padrão, o pnpm v5 criará um node_modules semi-estrito. Semi-estrito significa que sua aplicação só poderá requisitar pacotes inclusos como dependência ao `package.json` (com algumas exceções). No entanto, suas dependências poderão acessar qualquer pacote.

A configuração padrão fica assim:

```ini
; Todos os pacotes são hoisted(elevados) ao node_modules/.pnpm/node_modules
hoist-pattern[]=*

; Todos os tipos são hoisted(elevados) à raiz para satisfazer o TypeScript
public-hoist-pattern[]=*types*

; Todos os pacotes relacionados ao ESLint são hoisted(elevados) à raiz também
public-hoist-pattern[]=*eslint*
```

## Plug'n'Play. A configuração mais rígida

O pnpm suporta [Plug'n'Play do Yarn](https://yarnpkg.com/features/pnp) desde a versão v5.9. Com o PnP, tanto sua aplicação quanto as dependências terão acesso apenas às dependências declaradas. Isso é ainda mais restrito do que setar `hoist=false` porque, dentro de um monorepo, a sua aplicação não ter acesso até para as dependencias do projeto raiz.

Para usar o Plug'n'Play, defina estas configurações:

```ini
node-linker=pnp
symlink=false
```

## Um diretório de módulos estrito e tradicional

Caso não esteja pronto para usar o PnP, ainda é possível ser estrito e permitir que pacotes acessem apenas suas próprias dependências definindo a configuração do hoist como falsa:

```ini
hoist=false
```

No entando, se algumas de suas dependências estão tentando acessar pacotes que não possuem nas depedências, há duas opções:

1. Crie um `pnpmfile.js` e use um [hook](/pnpmfile) para adicionar a dependência que falta ao manifesto do pacote.

2. Adicione um padrão à configuração do `hoist-pattern`. Por exemplo, se o módulo não encontrado foi `babel-core`, adicione a seguinte configuração ao `.npmrc`:

    ```ini
    hoist-pattern[]=babel-core
    ```

## O pior caso — hoisting(elevação) à raiz

Algumas ferramentas podem não funcionar, mesmo com a configuração padrão do pnpm, que move tudo para a raiz da loja virtual e alguns pacotes para a raiz. Nesse caso, é possível fazer um hoist(elevar) tudo ou apenas uma parte das dependências à raiz do diretório de módulos.

Mover tudo para a raiz:

```ini
shamefully-hoist=true
```

Fazer hoisting(elevar) apenas os pacotes que correspondem a um padrão:

```ini
public-hoist-pattern[]=babel-*
```
