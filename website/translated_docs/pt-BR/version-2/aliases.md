---
id: version-2-aliases-pt-br
title: Aliases
original_id: aliases
---

Os aliases permitem instalar pacotes com nomes personalizados.

Vamos supor que você usa 'lodash' em todo o seu projeto. Existe um bug no `lodash` que quebra o seu projeto.
Você tem uma correção, mas o `lodash` não irá se fundir. Normalmente você instalaria o `lodash` do seu fork
diretamente (como uma dependência hospedada por git) ou publicá-lo com um nome diferente. Se você usar a segunda solução
você tem que substituir todos os requerimentos em seu projeto pelo novo nome de dependência (`require ('lodash')` => `require ('awesome-lodash')`) `.
Com aliases, você tem uma terceira opção.

Publique um novo pacote chamado `awesome-lodash` e instale-o usando o` lodash` como seu alias:

```
pnpm instalar o lodash @ npm: awesome-lodash
```

Nenhuma alteração no código é necessária. Todos os requerimentos de `lodash` irão importar` awesome-lodash`.

Às vezes você vai querer usar duas versões diferentes de um pacote em seu projeto. Fácil:

```sh
pnpm install lodash1 @ npm: lodash @ 1
pnpm install lodash2 @ npm: lodash @ 2
```

Agora você pode requerer a primeira versão do lodash via `require ('lodash1')` e a segunda via `require ('lodash2')`.

Isso fica ainda mais poderoso quando combinado com ganchos. Talvez você queira substituir `lodash` por` awesome-lodash`
em todos os pacotes em `node_modules`. Você pode facilmente conseguir isso com o seguinte `pnpmfile.js`:

```js
module.exports = {
  hooks: {
    readPackage
  }
}

função readPackage (pkg) {
  if (pkg.dependencies && pkg.dependencies.lodash) {
    pkg.dependencies.lodash = 'npm: awesome-lodash@^1.0.0'
  }
  return pkg
}
```