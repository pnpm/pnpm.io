---
id: aliases
title: Apelidos
---

Apelidos permitem que você instale pacotes com nomes personalizados.

Vamos supor que você use `lodash` em todo o seu projeto. Há um erro no `lodash` que quebra seu projeto. Você tem uma correção, mas `lodash` não a mesclará. Normalmente você instalaria `lodash` diretamente do seu fork (como uma dependência hospedada no git) ou o publicaria com um nome diferente. Se você usar a segunda solução você tem que substituir todos os "require" em seu projeto pelo novo nome de dependência (`require('lodash')` => `require('awesome-dasloh')`). Com apelidos, você tem uma terceira opção.

Publicar um novo pacote chamado `incrível-lodash` e instalá-lo usando `lodash` como seu apelido:

```
pnpm add lodash@npm:awesome-lodash
```

Nenhuma alteração no código é necessária. Todos os "require" de `lodash` agora serão resolvidos para `awesome-lodash`.

Às vezes você vai querer usar duas versões diferentes de um pacote em seu projeto. Fácil:

```sh
pnpm add lodash1@npm:lodash@1
pnpm add lodash2@npm:lodash@2
```

Agora você pode exigir a primeira versão do lodash via `require('lodash1')` e a segunda versão via `require('lodash2')`.

Isso fica ainda mais poderoso quando combinado com ganchos. Talvez você queira substituir `lodash` por `awesome-lodash` em todos os pacotes em `node_modules`. You can easily achieve that with the following `.pnpmfile.mjs`:

```js
function readPackage(pkg) {
  if (pkg.dependencies && pkg.dependencies.lodash) {
    pkg.dependencies.lodash = 'npm:awesome-lodash@^1.0.0'
  }
  return pkg
}

export const hooks = {
  readPackage
}
```
