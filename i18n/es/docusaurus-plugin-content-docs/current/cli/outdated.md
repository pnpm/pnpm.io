---
id: outdated
title: pnpm outdated
---

Comprueba si hay paquetes obsoletos. La comprobación se puede limitar a un subconjunto de los paquetes instalados proporcionando argumentos (se admiten patrones).

Ejemplos:
```sh
pnpm outdated
pnpm outdated "*gulp-*" @babel/core
```

## Opciones

### --recursive, -r

Verifique las dependencias obsoletas en cada paquete que se encuentre en los subdirectorios, o en paquete de espacio de trabajo cuando se ejecute dentro de un espacio de trabajo.

### --filter &lt;package_selector\>

[Leer más acerca del filtrado.](../filtering.md)

### --global, -g

Lista de paquetes globales obsoletos.

### --long

Imprimir los detalles.

### --format &lt;format\>

* Por defecto: **table**
* Tipo: **table**, **list**, **json**

Imprime las dependencias desactualizadas en el formato dado.

### --compatible

Imprime solo las versiones que cumplen las especificaciones de `package.json`.

### --dev, -D

Comprueba solo `devDependencies`.

### --prod, -P

Comprueba solo `dependencies` y `optionalDependencies`.

### --no-optional

No comprueba `optionalDependencies`.

### --sort-by

Specifies the order in which the output results are sorted. Currently only the value `name` is accepted.
