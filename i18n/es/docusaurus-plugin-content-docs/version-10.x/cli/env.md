---
id: env
title: "pnpm env <cmd>"
---

Administra el entorno de Node.js.

:::danger

`pnpm env` does not include the binaries for Corepack. If you want to use Corepack to install other package managers, you need to install it separately (e.g. `pnpm add -g corepack`).

:::

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/84-MzN_0Cng" title="The pnpm patch command demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"></iframe>

## Commands

### uso

Instale y use la versión especificada de Node.js

Instalar la versión LTS de Node.js:

```
pnpm env use --global lts
```

Instalar Node.js v16:

```
pnpm env use --global 16
```

Instalar una versión pre-lanzamiento de Node.js:

```
pnpm env use --global nightly
pnpm env use --global rc
pnpm env use --global 16.0.0-rc.0
pnpm env use --global rc/14
```

Instalar la última versión de Node.js:

```
pnpm env use --global latest
```

Install an LTS version of Node.js using its [codename]:

```
pnpm env use --global argon
```

[codename]: https://github.com/nodejs/Release/blob/main/CODENAMES.md

### add

Instala las versiones especificadas de Node.js sin activarlas como la versión actual.

Ejemplo:

```
pnpm env add --global lts 18 20.0.1
```

### remove, rm

Removes the specified version(s) of Node.js.

Ejemplo de uso:

```
pnpm env remove --global 14.0.0
pnpm env remove --global 14.0.0 16.2.3
```

### list, ls

Enumere las versiones de Node.js disponibles de forma local o remota.

Mostrar las versiones instaladas localmente:

```
pnpm env list
```

Mostrar las versiones de Node.js disponibles de forma remota:

```
pnpm env list --remote
```

Mostrar versiones de Node.js v16 disponibles de forma remota:

```
pnpm env list --remote 16
```

## Opciones

### --global, -g

Los cambios se realizan en todo el proyecto.

