---
id: aliases
title: Alias
---

Los alias te permiten instalar paquetes con nombres personalizados.

Asumamos que tu utilizas `lodash` en todo tu proyecto. Hay un bug en `lodash`. Tienes una solución a este bug pero `lodash` no lo fusiona en su repositorio. Normalmente instalarías `lodash` con el bug solucionado desde tu fork (como una dependencia hosteada en git) o la publicarías en npm con un nombre diferente. Si usas la segunda opción tendrás que reemplazar todos los require en tu proyecto con el nuevo nombre de la dependencia (`require('lodash')` => `require('awesome-lodash')`). Con los alias tienes una tercera opción.

Publica un nuevo paquete llamado `awesome-lodash` e instálalo usando `lodash` como su alias:

```
pnpm add lodash@npm:awesome-lodash
```

No son necesarios cambios en el código. Todos los requires de `lodash` se resolverán como `awesome-lodash`.

A veces querrás usar diferentes versiones de un paquete en tu proyecto. Fácil:

```sh
pnpm add lodash1@npm:lodash@1
pnpm add lodash2@npm:lodash@2
```

Ahora puedes requerir la primera versión de lodash con `require('lodash1')` y la segunda con `require('lodash2')`.

Eso se vuelve más útil cuando es combinado con los hooks. Tal vez quieras reemplazar `lodash` con `awesome-lodash` en todos los paquetes en la carpeta de `node_modules`. You can easily achieve that with the following `.pnpmfile.mjs`:

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
