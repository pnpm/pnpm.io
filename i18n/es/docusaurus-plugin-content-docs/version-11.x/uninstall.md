---
id: uninstall
title: Desinstalando pnpm
---

## Eliminando los paquetes instalados globalmente

Antes de eliminar la CLI de pnpm, es recomendado eliminar todos los paquetes globales que instaló mediante pnpm.

To list all the global packages, run `pnpm ls -g`. Hay dos formas de eliminar los paquetes globales:

1. Run `pnpm rm -g <pkg>...` with each global package listed.
2. Run `pnpm root -g` to find the location of the global directory and remove it manually.

## Eliminando la CLI de pnpm

Si utilizó el script para instalar pnpm (o npx), entonces debería poder desinstalar la CLI de pnpm usando:

```
rm -rf "$PNPM_HOME"
```

You might also want to clean the `PNPM_HOME` env variable in your shell configuration file (`$HOME/.bashrc`, `$HOME/.zshrc` or `$HOME/.config/fish/config.fish`).

Si usó npm para instalar pnpm, entonces debe usar npm para desinstalar pnpm:

```
npm rm -g pnpm
```

## Eliminando el almacén direccionable de contenido global

```
rm -rf "$(pnpm store path)"
```

Si usó pnpm en discos no primarios, debe ejecutar el comando anterior en cada disco, donde se usó pnpm.
pnpm crea una almacén por disco.

