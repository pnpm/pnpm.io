---
title: El año 2022 para pnpm
authors: zkochan
image: "/img/blog/2022-review.png"
tags:
  - recap
---

Es el final del año. Un año realmente duro. Como sabrán, vivo en Ucrania, así que debido a la guerra de Rusia contra nosotros, fue más difícil liderar este proyecto que en años anteriores. Sin embargo, fue un buen año para pnpm. Tenemos muchos usuarios nuevos, colaboradores y hemos implementado muchas funciones excelentes.

![](/img/blog/2022-review.png)

(La ilustración anterior fue generada por Midjourney. El tigre simboliza el año del tigre)

<!--truncate-->

## Uso

### Estadísticas

Mi objetivo este año era vencer a Lerna por el número de descargas. Pudimos lograr este objetivo [el](https://npm-stat.com/charts.html?package=pnpm&package=lerna&from=2022-01-01&to=2022-12-30)de agosto:

![](/img/blog/pnpm-vs-lerna-stats.png)

pnpm se descargó más de [5 veces más](https://npm-stat.com/charts.html?package=pnpm&from=2016-12-01&to=2022-12-30) en 2022 que en 2021:

![](/img/blog/download-stats-2022.png)

### Visitas a la documentación

Recopilamos algunas estadísticas no personalizadas de nuestros documentos utilizando Google Analytics. En 2022, a veces tuvimos más de 20 000 visitantes únicos por semana. ¡Esto es 10 veces más que en 2021!

![](/img/blog/ga-unique-visits-2022.png)

### Estrellas en GitHub

Nuestro [repositorio principal de GitHub](https://github.com/pnpm/pnpm) recibió casi +7,000 estrellas este año.

![](/img/blog/stars-2022.png)

### Nuestros colaboradores

Tuvimos muchos colaboradores nuevos y activos este año. Estas son las personas que fusionan al menos una PR en 2022:

* [Zoltan Kochan](https://github.com/zkochan)
* [chlorine](https://github.com/lvqq)
* [await-ovo](https://github.com/await-ovo)
* [Brandon Cheng](https://github.com/gluxon)
* [Dominic Elm](https://github.com/d3lm)
* [MCMXC](https://github.com/mcmxcdev)
* [那里好脏不可以](https://github.com/dev-itsheng)
* [Homyee King](https://github.com/HomyeeKing)
* [Shinobu Hayashi](https://github.com/Shinyaigeek)
* [Black-Hole](https://github.com/BlackHole1)
* [Kenrick](https://github.com/kenrick95)
* [Weyert de Boer](https://github.com/weyert)
* [Glen Whitney](https://github.com/gwhitney)
* [Cheng](https://github.com/chengcyber)
* [zoomdong](https://github.com/fireairforce)
* [thinkhalo](https://github.com/ufec)
* [子瞻 Luci](https://github.com/LuciNyan)
* [spencer17x](https://github.com/Spencer17x)
* [liuxingbaoyu](https://github.com/liuxingbaoyu)
* [장지훈](https://github.com/WhiteKiwi)
* [Jon de la Motte](https://github.com/jondlm)
* [Jack Works](https://github.com/Jack-Works)
* [milahu](https://github.com/milahu)
* [David Collins](https://github.com/David-Collins)
* [nikoladev](https://github.com/nikoladev)
* [Igor Bezkrovnyi](https://github.com/ibezkrovnyi)
* [Lev Chelyadinov](https://github.com/illright)
* [javier-garcia-meteologica](https://github.com/javier-garcia-meteologica)

## Características destacadas

### Compatible con `node_modules` elevados sin enlaces simbólicos (desde [v6.25.0](https://github.com/pnpm/pnpm/releases/tag/v6.25.0))

Justo a principios de 2022, agregamos soporte para el izado "tradicional" (también conocido como flat `node_modules`). Usamos el algoritmo de elevación de Yarn para crear un `node_modules`izado adecuado. Esta nueva configuración básicamente ha hecho que pnpm sea compatible con todas las pilas de Node.js que son compatibles con npm CLI.

Para usar la estructura de directorio hoisted `node_modules`, use la configuración `node-linker=hoisted` en un archivo `.npmrc`.

### Caché de efectos secundarios (desde [v7.0.0](https://github.com/pnpm/pnpm/releases/tag/v7.0.0))

Desde v7, [side-effect-cache][] está habilitado de forma predeterminada, por lo que las dependencias que deben construirse solo se crean una vez en una máquina. Esto mejora mucho la velocidad de instalación en proyectos que tienen dependencias con scripts de compilación.

### Caché de efectos secundarios (desde [v7.4.0](https://github.com/pnpm/pnpm/releases/tag/v7.4.0))

Se agregó el comando [`pnpm patch`][] para parchear dependencias en sus `node_modules`.

### Estrategia de resolución basada en el tiempo (desde [v7.10.0](https://github.com/pnpm/pnpm/releases/tag/v7.10.0))

Se agregó un nuevo modo de resolución a pnpm, lo que debería hacer que las dependencias de actualización sean más seguras. Puede cambiar el modo de resolución con la configuración [modo de resolución][].

### Listado de licencias de dependencias (desde [v7.17.0](https://github.com/pnpm/pnpm/releases/tag/v7.17.0))

Ahora puede usar el comando [`pnpm licenses list`][] para verificar las licencias de los paquetes instalados.

[side-effect-cache]: /npmrc#side-effects-cache

[`pnpm patch`]: /cli/patch

[modo de resolución]: https://pnpm.io/npmrc#resolution-mode

[`pnpm licenses list`]: /cli/licenses

