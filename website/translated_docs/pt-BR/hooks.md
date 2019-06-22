---
id: hooks-pt-br
title: Hooks
---

O pnpm permite entrar diretamente no processo de instalação através de funções especiais chamadas *hooks*.
Ganchos podem ser declarados em um arquivo chamado `pnpmfile.js`. `pnpmfile.js` deve viver na raiz do projeto.

## tl; dr

| Opção | Significado |
| - | - |
| `hooks.readPackage (pkg, context): pkg` | Permite a mutação de cada pacote `package.json` |
| `hooks.afterAllResolved (shrinkwrap, context): shrinkwrap` | É chamado depois da fase de resolução. Permite alterar o objeto shrinkwrap. |

## `hooks.readPackage (pkg, context): pkg`

Permite a mutação de cada pacote `package.json`.
Um exemplo de um `pnpmfile.js` que altera o campo dependências de uma dependência:
Você precisará excluir o `shrinkwrap.yaml` se já tiver resolvido a dependência que deseja alterar.

```js
module.exports = {
  hooks: {
    readPackage
  }
}

function readPackage (pkg, contexto) {
  // Substitua o manifesto de foo@1 após baixá-lo do registro
  // Substitua todas as dependências por bar@2
  if (pkg.name === 'foo' && pkg.version.startsWith ('1.')) {
    pkg.dependencies = {
      bar: '^ 2.0.0'
    }
    context.log ('bar@1 => bar@2  nas dependências de foo')
  }
  
  // Isto irá corrigir quaisquer dependências do baz para 1.2.3
  if (pkg.dependencies && pkg.dependencies.baz === '*') {
    pkg.dependencies.baz = '1.2.3';
  }
  
   return pkg
}
```

### Argumentos

* `pkg` - _Manifest_ - O manifesto do pacote. A resposta do registro ou o conteúdo do `package.json`.
* `context.log (msg)` - _Function_ - Permite registrar mensagens.

### Uso

#### Substitua um pacote pelo garfo

Vamos supor que você tenha bifurcado um pacote com uma correção importante e queira o fixo
versão instalada.

O seguinte gancho substitui `resolve` pelo fork do` @ zkochan`.

```js
'use strict'
module.exports = {
  hooks: {
    readPackage
  }
}

function readPackage (pkg) {
  if (pkg.dependencies && pkg.dependencies.resolve) {
    pkg.dependencies.resolve = 'zkochan/node-resolve'
  }

  return pkg
}
```

#### Validação de pacotes

Você quer apenas pacotes com licença MIT no seu `node_modules`? Verifique as licenças
e lance uma exceção se você não gostar da licença do pacote:

```js
'use strict'
module.exports = {
  hooks: {
    readPackage
  }
}

function readPackage (pkg) {
  if (pkg.license !== 'MIT') {
    throw new Error('Invalid license!')
  }

  return pkg
}
```

#### Renomeando caixas

Você deseja renomear a caixa de um pacote? Apenas substitua:

```js
'use strict'
module.exports = {
  hooks: {
    readPackage
  }
}

function readPackage (pkg) {
  if (pkg.name === 'eslint') {
    pkg.bin = {jslint: pkg.bin}
  }

  return pkg
}
```

Agora você pode executar `jslint fix` em vez de` eslint fix`.

## `hooks.afterAllResolved (shrinkwrap, context): shrinkwrap`

Adicionado em: v1.41.0

É chamado depois da fase de resolução. Permite alterar o objeto shrinkwrap.

### Argumentos

* `shrinkwrap` - _object_ - O objeto que é salvo no` shrinkwrap.yaml`.
* `context.log (msg)` - _Function_ - Permite registrar mensagens.

### Uso

```js
module.exports = {
  hooks: {
    afterAllResolved
  }
}

function afterAllResolved (shrinkwrap, context) {
  // ...
  return shrinkwrap
}
```
