---
id: aliases
title: Alias
---

Los alias te permiten instalar paquetes con nombres personalizados.

Let's assume you use `lodash` all over your project. There is a bug in `lodash`
that breaks your project. You have a fix but `lodash` won't merge it. Normally
you would either install `lodash` from your fork directly (as a git-hosted
dependency) or publish it with a different name. If you use the second solution
you have to replace all the requires in your project with the new dependency
name (`require('lodash')` => `require('awesome-lodash')`). Con los alias tienes una tercera opción.

Publish a new package called `awesome-lodash` and install it using `lodash` as
its alias:

```
pnpm add lodash@npm:awesome-lodash
```

No son necesarios cambios en el código. All the requires of `lodash` will now resolve to
`awesome-lodash`.

A veces querrás usar diferentes versiones de un paquete en tu proyecto. Fácil:

```sh
pnpm add lodash1@npm:lodash@1
pnpm add lodash2@npm:lodash@2
```

Now you can require the first version of lodash via `require('lodash1')` and the
second via `require('lodash2')`.

Eso se vuelve más útil cuando es combinado con los hooks. Maybe you want to replace
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
