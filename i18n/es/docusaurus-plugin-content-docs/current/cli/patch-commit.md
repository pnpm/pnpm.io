---
id: patch-commit
title: "pnpm patch-commit <path>"
---

Genere un parche a partir de un directorio y guárdelo (inspirado en un comando similar en Yarn).

This command will compare the changes from `path` to the package it was supposed to patch, generate a patch file, save the a patch file to `patchesDir` (which can be customized by the `--patches-dir` option), and add an entry to [`patchedDependencies`][].

Uso:

```sh
pnpm patch-commit <path>
```

* `path` es la ruta a una copia modificada del paquete de destino del parche; generalmente es un directorio temporal generado por [`pnpm patch`](./patch).

## Opciones

### ---patches-dir &lt;patchesDir>

El archivo de patch generado se guardará en este directorio. Por defecto, los patches se guardan en el directorio `patches` en la raíz del proyecto.

[`patchedDependencies`]: ../settings.md#patcheddependencies
