---
title: El node_modules plano no es la única forma
authors: zkochan
---

Los nuevos usuarios de pnpm me preguntan con frecuencia sobre la extraña estructura de `node_modules` que crea pnpm. ¿Por qué no es plano? ¿Dónde están todas las sub-dependencias?

<!--truncate-->

> Voy a suponer que los lectores del artículo ya están familiarizados con el `node_modules` plano creado por npm y Yarn. Si no entiendes por qué npm 3 tuvo que empezar a usar planos `node_modules` en v3, puedes encontrar algo de prehistoria en [ ¿Por qué debemos usar pnpm?](https://www.kochan.io/nodejs/why-should-we-use-pnpm.html) *(en inglés)*.

Entonces, ¿por qué es inusual el `node_modules de pnpm`? Vamos a crear dos directorios y ejecutar `npm add express` en uno de ellos y `pnpm add express` en el otro. Aquí está la parte superior de lo que obtienes en `node_modules` del primer directorio:

```text
.bin
accepts
array-flatten
body-parser
bytes
content-disposition
cookie-signature
cookie
debug
depd
destroy
ee-first
encodeurl
escape-html
etag
express
```

Puedes ver todo el directorio [aquí](https://github.com/zkochan/comparing-node-modules/tree/master/npm-example/node_modules).

Y esto es lo que obtienes en los `node_modules` creados por pnpm:

```text
.pnpm
.modules.yaml
express
```

Puedes comprobarlo [aquí](https://github.com/zkochan/comparing-node-modules/tree/master/pnpm5-example/node_modules).

Entonces, ¿dónde están todas las sub-dependencias? Solo hay una carpeta en `node_modules` llamada `.pnpm` y un enlace simbólico llamado `express`. Bueno, solo hemos instalado `express`, así que este es el único paquete al que tu aplicación tiene que tener acceso

> Lea más sobre por qué la rigurosidad de pnpm es algo bueno [aquí](https://medium.com/pnpm/pnpms-strictness-helps-to-avoid-silly-bugs-9a15fb306308) *(en inglés)*

Veamos qué hay dentro de `express`:

```text
▾ node_modules
  ▸ .pnpm
  ▾ express
    ▸ lib
      History.md
      index.js
      LICENSE
      package.json
      Readme.md
  .modules.yaml
```

¿`express` no tiene `node_modules`? ¿Dónde están todas las dependencias de `express`?

El truco está en que `express` es sólo un enlace simbólico. Cuando Node.js resuelve las dependencias, usa sus ubicaciones reales, por lo que no conserva los enlaces simbólicos. Pero, ¿dónde está la ubicación real de `express`, podrías preguntarte?

Aquí: [node_modules/.pnpm/express@4.17.1/node_modules/express](https://github.com/zkochan/comparing-node-modules/tree/master/pnpm5-example/node_modules/.pnpm/express@4.17.1/node_modules/express).

OK, ahora conocemos el propósito de la carpeta `.pnpm/`. `.pnpm/` almacena todos los paquetes en una estructura de carpetas plana, por lo que cada paquete se puede encontrar en una carpeta nombrada con este patrón:

```text
.pnpm/<name>@<version>/node_modules/<name>
```

Lo llamamos el directorio de almacenamiento virtual.

Esta estructura plana evita los problemas de ruta larga causados por los `node_modules` anidados creados por npm v2, pero mantiene los paquetes aislados a diferencia de los `node_modules` planos creados por npm v3,4,5,6 o Yarn v1.

Ahora veamos la ubicación real de `express`:

```text
  ▾ express
    ▸ lib
      History.md
      index.js
      LICENSE
      package.json
      Readme.md
```

¿Es una estafa? ¡Todavía le falta `node_modules`! The second trick of pnpm's `node_modules` structure is that the dependencies of packages are on the same directory level as the real location of the dependent package. Así que las dependencias de `express` no están en `.pnpm/express@4.17.1/node_modules/express/node_modules/` sino en [.pnpm/express@4.17.1/node_modules/](https://github.com/zkochan/comparing-node-modules/tree/master/pnpm5-example/node_modules/.pnpm/express@4.17.1/node_modules):

```text
▾ node_modules
  ▾ .pnpm
    ▸ accepts@1.3.5
    ▸ array-flatten@1.1.1
    ...
    ▾ express@4.16.3
      ▾ node_modules
        ▸ accepts
        ▸ array-flatten
        ▸ body-parser
        ▸ content-disposition
        ...
        ▸ etag
        ▾ express
          ▸ lib
            History.md
            index.js
            LICENSE
            package.json
            Readme.md
```

Todas las dependencias de `express` son enlaces simbólicos a los directorios apropiados en `node_modules/.pnpm/`. Colocar dependencias de `expreso` en un nivel superior permite evitar enlaces simbólicos circulares.

Así que como puedes ver, a pesar de que la estructura `node_modules` de pnpm parece inusual al principio:

1. es completamente compatible con Node.js
2. los paquetes están bien agrupados con sus dependencias

La estructura es un poco [más compleja](/how-peers-are-resolved) para paquetes con dependencias entre pares, pero la idea es la misma: usar enlaces simbólicos para crear un anidamiento con una estructura de directorio plana.
