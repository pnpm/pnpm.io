---
id: aliases
title: Apelidos
---

Apelidos permitem que você instale pacotes com nomes personalizados.

Let's assume you use `lodash` all over your project. There is a bug in `lodash`
that breaks your project. You have a fix but `lodash` won't merge it. Normally
you would either install `lodash` from your fork directly (as a git-hosted
dependency) or publish it with a different name. If you use the second solution
you have to replace all the requires in your project with the new dependency
name (`require('lodash')` => `require('awesome-lodash')`). Com apelidos, você tem uma terceira opção.

Publish a new package called `awesome-lodash` and install it using `lodash` as
its alias:

```
pnpm add lodash@npm:awesome-lodash
```

Nenhuma alteração no código é necessária. All the requires of `lodash` will now resolve to
`awesome-lodash`.

Às vezes você vai querer usar duas versões diferentes de um pacote em seu projeto. Fácil:

```sh
pnpm add lodash1@npm:lodash@1
pnpm add lodash2@npm:lodash@2
```

Now you can require the first version of lodash via `require('lodash1')` and the
second via `require('lodash2')`.

Isso fica ainda mais poderoso quando combinado com ganchos. Maybe you want to replace
`lodash` with `awesome-lodash` in all the packages in `node_modules`. You can
easily achieve that with the following `.pnpmfile.cjs`:

```js
function readPackage(pkg) {
  if (pkg.dependencies && pkg.dependencies.lodash) {
    pkg.dependencies.lodash = 'npm:awesome-lodash@^1.0.0'
  }
  return pkg
}

module.exports = {
  hooks: {
    readPackage
  }
}
```
