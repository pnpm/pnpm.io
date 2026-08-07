---
id: why
title: pnpm why
---

Muestra todos los paquetes que dependen del paquete especificado.

The output is a reverse dependency tree: the searched package appears at the root, with its dependents as branches, walking back to workspace roots.

Duplicate subtrees are deduplicated in the output and shown as "deduped".

## Opciones

### --recursive, -r

Show the dependency tree for the specified package on every package in
subdirectories or on every workspace package when executed inside a workspace.

### --json

Show information in JSON format.

### --long

Show verbose output.

### --parseable

Show parseable output instead of tree view.

### --global, -g

Enumere los paquetes en el directorio de instalación global en lugar de en el proyecto actual.

### --prod, -P

Only display the dependency tree for packages in `dependencies`.

### --dev, -D

Only display the dependency tree for packages in `devDependencies`.

### --depth &lt;number\>

Display only dependencies within a specific depth.

### --only-projects

Muestra solo las dependencias que también son proyectos dentro del espacio de trabajo.

### --exclude-peers

Exclude peer dependencies from the results (but dependencies of peer dependencies are not ignored).

### --filter &lt;package_selector\>

[Read more about filtering.](../filtering.md)

import FindBy from '../settings/_findBy.mdx'

<FindBy />
