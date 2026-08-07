---
id: uninstall
title: Desinstalando pnpm
---

## Eliminando los paquetes instalados globalmente

Antes de eliminar la CLI de pnpm, es recomendado eliminar todos los paquetes globales que instaló mediante pnpm.

Para listar todos los paquetes globales, ejecute `pnpm ls -g`. Hay dos formas de eliminar los paquetes globales:

1. Ejecute `pnpm rm -g <pkg>...` con cada paquete global listado.
2. Ejecute `pnpm root -g` para encontrar la ubicación del directorio global y elimínelo manualmente.

## Eliminando la CLI de pnpm

Si utilizó el script para instalar pnpm (o npx), entonces debería poder desinstalar la CLI de pnpm usando:

```
rm -rf "$PNPM_HOME"
```

También puede que quieras quitar la variable `PNPM_HOME` de tu configuración de shell (`$HOME/.bashrc`, `$HOME/.zshrc` o `$HOME/.config/fish/config.fish`).

Si usó npm para instalar pnpm, entonces debe usar npm para desinstalar pnpm:

```
npm rm -g pnpm
```

## Eliminando el almacén direccionable de contenido global

```
rm -rf "$(pnpm store path)"
```

Si usó pnpm en discos no primarios, debe ejecutar el comando anterior en cada disco, donde se usó pnpm. pnpm crea una almacén por disco.

