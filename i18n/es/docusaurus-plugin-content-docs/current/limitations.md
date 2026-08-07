---
id: limitations
title: Limitaciones
---

1. `npm-shrinkwrap.json` y `package-lock.json` se ignoran. A diferencia de pnpm, npm puede instalar el mismo `nombre@versión` varias veces y con diferentes conjuntos de dependencias. El archivo de bloqueo de npm está diseñado para reflejar la estructura plana de `node_modules` sin embargo, ya que pnpm crea una estructura aislada por defecto, no puede respetar el formato de archivo de bloqueo de npm. Vea [pnpm import][] si a pesar de todo desea convertir un archivo de bloqueo al formato de pnpm.
1. Los binstubs (archivos en `node_modules/.bin`) son siempre archivos de shell, no enlaces simbólicos a archivos JS. Los archivos de shell se crean para ayudar a las aplicaciones CLI conectables en la búsqueda de sus plugins en la inusual estructura de `node_modules`. Esto es muy raramente un problema y si espera que el archivo sea un archivo JS, en su lugar, haga referencia al archivo original directamente, como se describe en [#736][].

¿Tienes una idea para solucionar estos problemas? [Compártelos.](https://github.com/pnpm/pnpm/issues/new)

[pnpm import]: cli/import.md
[#736]: https://github.com/pnpm/pnpm/issues/736
