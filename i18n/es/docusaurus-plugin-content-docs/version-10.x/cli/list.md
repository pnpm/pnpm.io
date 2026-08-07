---
id: list
title: pnpm list
---

Aliases: `ls`

Este comando generará todas las versiones de los paquetes que están instalados,
así como sus dependencias, en una estructura de árbol.

Positional arguments are `name-pattern@version-range` identifiers, which will
limit the results to only the packages named. For example,
`pnpm list "babel-*" "eslint-*" semver@5`.

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

`pnpm ls --depth 0` (default) will list direct dependencies only.
`pnpm ls --depth -1` will list projects only. Useful inside a workspace when
used with the `-r` option.
`pnpm ls --depth Infinity` will list all dependencies regardless of depth.

### --prod, -P

Display only the dependency graph for packages in `dependencies` and
`optionalDependencies`.

### --dev, -D

Display only the dependency graph for packages in `devDependencies`.

### --no-optional

Don't display packages from `optionalDependencies`.

### --only-projects

Muestra solo las dependencias que también son proyectos dentro del espacio de trabajo.

### --exclude-peers

Exclude peer dependencies from the results (but dependencies of peer dependencies are not ignored).

### --filter &lt;package_selector\>

[Read more about filtering.](../filtering.md)

import FindBy from '../settings/_findBy.mdx'

<FindBy />
