---
id: symlinked-node-modules-structure
title: Estructura de `node_modules` con enlaces simbólicos
---

:::info

Este artículo solo describe cómo se estructuran la carpeta `node_modules` de pnpm cuando no hay paquetes con dependencias pares. Para el escenario más complejo de dependencias pares, revise [cómo se resuelven las dependencias pares](how-peers-are-resolved.md).

:::

El diseño de la carpeta `node_modules` de pnpm utiliza enlaces simbólicos para crear una estructura anidada de dependencias.

Cada archivo de un paquete dentro de `node_modules` es un vínculo al almacenamiento de contenido direccionable. Digamos vas a instalar `foo@1.0.0` el cual depende de `bar@1.0.0`. pnpm creará un vínculo a estos paquetes en `node_modules` esta manera:

```text
node_modules
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       └── bar
    │           ├── index.js     -> <store>/001
    │           └── package.json -> <store>/002
    └── foo@1.0.0
        └── node_modules
            └── foo
                ├── index.js     -> <store>/003
                └── package.json -> <store>/004
```

Estos son los únicos archivos "reales" en `node_modules`. Una vez que todos los paquetes están vinculados a la carpeta `node_modules`, los enlaces simbólicos son creados para construir la estructura del gráfico de las dependencias anidadas.

Como habrás notado, ambos paquetes están vinculados a una sub carpeta dentro de una carpeta `node_modules`, así: (`foo@1.0.0/node_modules/foo`). Esto es necesario para:

1. **Permitir que los paquetes se importen solos.** El paquete `foo` debería poder `require('foo/package.json')` o `import * as package from "foo/package.json"`.
2. **evitar enlaces simbólicos circulares.** Las dependencias de los paquetes se colocan en la misma carpeta en la que se encuentran los paquetes dependientes. Para Node.js, no hace ninguna diferencia si las dependencias están dentro de la carpeta `node_modules` del paquete o en cualquier otro `node_modules` en los directorios superiores.

La siguiente etapa de la instalación es la creación de los enlaces simbolicos de las dependencias. `bar` va a estar vinculado simbólicamente a la carpeta `foo@1.0.0/node_modules`:

```text
node_modules
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       └── bar -> <store>
    └── foo@1.0.0
        └── node_modules
            ├── foo -> <store>
            └── bar -> ../../bar@1.0.0/node_modules/bar
```

A continuación, se manejan las dependencias directas. `foo` se vinculará simbólicamente a la carpeta raíz `node_modules` debido `foo` es una dependencia del proyecto:

```text
node_modules
├── foo -> ./.pnpm/foo@1.0.0/node_modules/foo
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       └── bar -> <store>
    └── foo@1.0.0
        └── node_modules
            ├── foo -> <store>
            └── bar -> ../../bar@1.0.0/node_modules/bar
```

Este es un ejemplo muy simple. Sin embargo, el diseño mantendrá esta estructura independientemente del número de dependencias y la profundidad del gráfico de dependencia.

Agreguemos `qar@2.0.0` como una dependencia de `bar` y `foo`. Así es como se verá la nueva estructura:

```text
node_modules
├── foo -> ./.pnpm/foo@1.0.0/node_modules/foo
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       ├── bar -> <store>
    │       └── qar -> ../../qar@2.0.0/node_modules/qar
    ├── foo@1.0.0
    │   └── node_modules
    │       ├── foo -> <store>
    │       ├── bar -> ../../bar@1.0.0/node_modules/bar
    │       └── qar -> ../../qar@2.0.0/node_modules/qar
    └── qar@2.0.0
        └── node_modules
            └── qar -> <store>
```

Como puede ver, aunque el gráfico es más profundo ahora (`foo > bar > qar`), la profundidad de los directorios en el sistema de archivos sigue siendo la misma.

Este diseño puede parecer extraño a primera vista, ¡pero es completamente compatible con el algoritmo de resolución de módulos de Node! Al resolver módulos, Node ignora enlaces simbólicos, por lo que cuando se requiere `bar` de `foo@1.0.0/node_modules/foo/index.js`, Node no usa `bar` en `foo@1.0.0/node_modules /bar`, pero en su lugar, `bar` se convierte a su ubicación real (`bar@1.0.0/node_modules/bar`). Como consecuencia, `bar` también puede resolver sus dependencias que se encuentran en `bar@1.0.0/node_modules`.

Una gran ventaja de este diseño es que solo los paquetes que realmente están en las dependencias son accesibles. Con una estructura plana de la carpeta `node_modules`, se puede acceder a los paquetes superiores. To read more about why this is an advantage, see "[pnpm's strictness helps to avoid silly bugs][bugs]"

Unfortunately, many packages in the ecosystem are broken — they use dependencies that are not listed in their `package.json`. To minimize the number of issues new users encounter, pnpm hoists all dependencies by default into `node_modules/.pnpm/node_modules`. To disable this hoisting, set [hoist][] to `false`.

[hoist]: settings.md#hoist

[bugs]: https://www.kochan.io/nodejs/pnpms-strictness-helps-to-avoid-silly-bugs.html
