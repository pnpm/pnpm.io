---
id: outdated
title: pnpm outdated
---

Comprueba si hay paquetes obsoletos. La comprobación se puede limitar a un subconjunto de los
paquetes instalados proporcionando argumentos (se admiten patrones).

Ejemplos:

```sh
pnpm outdated
pnpm outdated "*gulp-*" @babel/core
```

## Opciones

### --recursive, -r

Verifique las dependencias obsoletas en cada paquete que se encuentre en los subdirectorios, o en
paquete de espacio de trabajo cuando se ejecute dentro de un espacio de trabajo.

### --filter &amp;lt;package_selector\>

[Read more about filtering.](../filtering.md)

### --global, -g

Lista de paquetes globales obsoletos.

### --long

Imprimir los detalles.

### --format &amp;lt;format\>

- Default: **table**
- Type: **table**, **list**, **json**

Imprime las dependencias desactualizadas en el formato dado.

### --compatible

Prints only versions that satisfy specifications in `package.json`.

### --dev, -D

Checks only `devDependencies`.

### --prod, -P

Checks only `dependencies` and `optionalDependencies`.

### --no-optional

Doesn't check `optionalDependencies`.

### --sort-by

Specifies the order in which the output results are sorted. Currently only the value `name` is accepted.
