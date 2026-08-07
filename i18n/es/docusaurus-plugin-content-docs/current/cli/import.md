---
id: import
title: pnpm import
---

`pnpm import` genera un archivo `pnpm-lock.yaml` desde el lockfile de otro gestor de paquetes. Archivos fuente soportados:
* `package-lock.json`
* `npm-shrinkwrap.json`
* `yarn.lock`

Ten en cuenta que si tienes espacios de trabajo para los que deseas importar dependencias, necesitarán ser declarados en un archivo [pnpm-workspace.yaml](../pnpm-workspace_yaml.md) de antemano.
