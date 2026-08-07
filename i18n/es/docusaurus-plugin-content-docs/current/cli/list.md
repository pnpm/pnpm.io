---
id: list
title: pnpm list
---

Alias: `ls`

Este comando generará todas las versiones de los paquetes que están instalados, así como sus dependencias, en una estructura de árbol.

Los argumentos posicionales son identificadores `name-pattern@version-range`, que limitarán los resultados solo a los paquetes nombrados. Por ejemplo, `pnpm lista "babel-*" "eslint-*" semver@5`.

## Opciones

### --recursive, -r

Ejecuta el comando en cada paquete en subdirectorios o en cada paquete de espacio de trabajo, cuando es ejecutado dentro de un espacio de trabajo.

### --json

El registro aparecerá en formato JSON.

### --long

Muestra información ampliada.

### --lockfile-only

Added in: v10.23.0

Read package information from the lockfile instead of checking the actual `node_modules` directory. This is useful for quickly inspecting what would be installed without requiring a full installation.

### --parseable

Genera directorios de paquetes en un formato analizable en lugar de su vista de árbol.

### --global, -g

Enumere los paquetes en el directorio de instalación global en lugar de en el proyecto actual.

### --depth &lt;number\>

Profundidad máxima de visualización del árbol de dependencias.

`pnpm ls --depth 0` (predeterminado) mostrará solo las dependencias directas. `pnpm ls --depth -1` listará proyectos solamente. Útil dentro de un espacio de trabajo cuando es usado con la opción `-r`. `pnpm ls --depth Infinity` listará todas las dependencias independientemente de la profundidad.

### --prod, -P

Muestra solo el gráfico de dependencia para paquetes en `dependencies` y `optionalDependencies`.

### --dev, -D

Muestra solo el gráfico de dependencia para paquetes en `devDependencies`.

### --no-optional

No muestra paquetes de `optionalDependencies`.

### --only-projects

Muestra solo las dependencias que también son proyectos dentro del espacio de trabajo.

### --exclude-peers

Exclude peer dependencies from the results (but dependencies of peer dependencies are not ignored).

### --filter &lt;selector_de_paquete\>

[Leer más acerca del filtrado.](../filtering.md)

import FindBy from '../settings/_findBy.mdx'

<FindBy />
