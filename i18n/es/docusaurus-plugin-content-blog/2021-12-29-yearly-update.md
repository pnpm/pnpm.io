---
title: El año 2021 para pnpm
authors: zkochan
tags:
  - recap
---

Es fin de año y fue un buen año para pnpm, así que veamos cómo nos fue.

<!--truncate-->

## Uso

### Descargar estadísticas

Mi objetivo este año era vencer a Bower por en número de descargas. Pudimos lograr este objetivo [en Noviembre](https://npm-stat.com/charts.html?package=pnpm&package=bower&from=2021-01-01&to=2021-12-29):

![](/img/blog/pnpm-vs-bower-stats.png)

pnpm se descargó unas [3 veces más](https://npm-stat.com/charts.html?package=pnpm&from=2016-12-01&to=2021-12-29) en 2021 que en 2020:

![](/img/blog/download-stats-2021.png)

:::note

¡Estas estadísticas ni siquiera miden todas las diferentes formas en que se puede instalar pnpm! Solo miden las descargas de[pnpm npm package](https://www.npmjs.com/package/pnpm). Este año también agregamos versiones binarias compiladas de pnpm, que se entregan de manera diferente.

:::

### Visitas a la documentación

Nosotros recogemos estadísticas no personalizadas de nuestra documentación utilizando Google Analytics. En 2021, a veces teníamos mas de 2,000 visitantes únicos a la semana.

![](/img/blog/ga-unique-visits-2021.png)

La mayoría de nuestros usuarios son de los Estados Unidos y China.

![](/img/blog/countries-2021.png)

### Estrellas en GitHub

Nuestro [repositorio principal de GitHub](https://github.com/pnpm/pnpm) recibió +5.000 estrellas este año.

![](/img/blog/stars-2021.png)

### Nuevos usuarios

Nuestro gran nuevo usuario este año es [Bytedance](https://github.com/pnpm/pnpm.io/pull/89) (la compañía detrás de TikTok).

Además, muchos grandes proyectos de código abierto comenzaron a usar pnpm. Algunos cambiaron a pnpm debido a su gran soporte de monorepos:

* [Vue](https://github.com/vuejs/vue-next)
* [Vite](https://github.com/vitejs/vite)
* y [otros](https://pnpm.io/workspaces#usage-examples)

Algunos cambiaron porque les gusta lo eficiente, rápido y hermoso que es pnpm:

* [Autoprefixer](https://twitter.com/Autoprefixer/status/1476226146488692736)
* [PostCSS](https://twitter.com/PostCSS/status/1470438664006258701)
* [Browserslist](https://twitter.com/Browserslist/status/1468264308308156419)

## Características destacadas

### Nuevo formato de archivo de bloqueo (desde [v6.0.0](https://github.com/pnpm/pnpm/releases/tag/v6.0.0))

Uno de los primeros y más importantes cambios de este año fue el nuevo formato `pnpm-lock.yaml`. Este fue un cambio importante, por lo que tuvimos que lanzar v6. Pero fue un éxito. El antiguo archivo de bloqueo causaba conflictos de Git con frecuencia. Desde que se introdujo el nuevo formato, no recibimos ninguna queja sobre conflictos de Git.

### Gestión de versiones de Node.js (desde [v6.12.0](https://github.com/pnpm/pnpm/releases/tag/v6.12.0))

Enviamos un nuevo comando (`pnpm env`) que permite gestionar las versiones de Node.js. Por lo tanto, puede usar pnpm en lugar de los administradores de versiones de Node.js como nvm o Volta.

Además, pnpm se envía como un ejecutable independiente, por lo que puede ejecutarlo incluso sin Node.js preinstalado en el sistema.

### Inyectando dependencias locales (desde [v6.20.0](https://github.com/pnpm/pnpm/releases/tag/v6.20.0))

Puede "inyectar" una dependencia local. Por defecto, las dependencias locales están enlazadas simbólicamente a `node_modules`, pero con esta nueva característica se puede dar instrucciones a pnpm para vincular duramente los archivos del paquete.

### Informe mejorado de problemas de dependencia entre pares (desde [v6.24.0](https://github.com/pnpm/pnpm/releases/tag/v6.24.0))

Los problemas de dependencia entre pares solían imprimirse como texto sin formato y era difícil entenderlos. Ahora están todos agrupados e impresos en una bonita estructura jerárquica.

## La competencia

### Yarn

Yarn agregó un enlazador pnpm en [v3.1](https://dev.to/arcanis/yarn-31-corepack-esm-pnpm-optional-packages--3hak#new-install-mode-raw-pnpm-endraw-). Entonces, Yarn puede crear una estructura de directorio de módulos de node similar a la que crea pnpm.

Además, el equipo de Yarn planea implementar un almacenamiento direccionable por contenido para ser más eficiente en el uso del espacio en disco.

### npm

El equipo de npm decidió adoptar también la estructura de directorios de módulos de node enlazados que utiliza pnpm (relacionada con [RFC](https://github.com/npm/rfcs/blob/main/accepted/0042-isolated-mode.md)).

### Otros

[Bun](https://twitter.com/jarredsumner/status/1473416431291174912/photo/1) escrito en Zig y [Volt](https://github.com/voltpkg/volt) escrito en Rust afirman ser más rápidos que npm/Yarn/pnpm. Todavía no he comparado estos nuevos gestores de paquetes.

## Planes futuros

Más rápido, mejor, el mejor.
