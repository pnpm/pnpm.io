---
id: install
title: pnpm install
---

Alias: `i`

`pnpm install` se utiliza para instalar todas las dependencias para un proyecto.

En ambiente CI, la installación falla si el lockfile existe pero necesita ser actualizado.

Dentro de un [workspace][], `pnpm install` instala todas las dependencias en todos los proyectos. Si deseas desactivar este comportamiento, define la configuración`recursive-install` a `false`.

![](/img/demos/pnpm-install.svg)

## TL;DR

| Comando                    | Significado                                          |
| -------------------------- | ---------------------------------------------------- |
| `pnpm i --offline`         | Instala modo offline desde el almacenamiento interno |
| `pnpm i --frozen-lockfile` | `pnpm-lock.yaml` no es actualizado                   |
| `pnpm i --lockfile-only`   | Solo `pnpm-lock.yaml` es actualizado                 |

## Options for filtering dependencies

Without a lockfile, pnpm has to create one, and it must be consistent regardless of dependencies filtering, so running `pnpm install --prod` on a directory without a lockfile would still resolve the dev dependencies, and it would error if the resolution is unsuccessful. The only exception for this rule are `link:` dependencies.

Without `--frozen-lockfile`, pnpm will check for outdated information from `file:` dependencies, so running `pnpm install --prod` without `--frozen-lockfile` on an environment where the target of `file:` has been removed would error.

### --prod, -P

* Por defecto: **false**
* Tipo: **Boolean**

If `true`, pnpm will not install any package listed in `devDependencies` and will remove those insofar they were already installed. If `false`, pnpm will install all packages listed in `devDependencies` and `dependencies`.

### --dev, -D

Only `devDependencies` are installed and `dependencies` are removed insofar they were already installed.

### --no-optional

`optionalDependencies` no son instaladas.

## Opciones

### --force

Fuerza la reinstalación de las dependencias: recupera los paquetes modificados en la tienda, recrea un lockfile y/o un directorio de módulos creado por una versión no compatible de pnpm. Instala todas las dependencias opcionales, incluso si no satisfacen el entorno actual (cpu, os, arch).

### --offline

* Por defecto: **false**
* Tipo: **Boolean**

Si es `true`, pnpm usará solo los paquetes que ya están disponibles en la tienda. Si un paquete no se encuentra localmente, la instalación fallará.

### --prefer-offline

* Por defecto: **false**
* Tipo: **Boolean**

Si `verdadero`, se omitirán las comprobaciones de obsolescencia de los datos almacenados en caché, pero los datos faltantes se solicitarán al servidor. Para forzar el modo offline, usa `--offline`.

### --no-lockfile

Don't read or generate a `pnpm-lock.yaml` file.

### --lockfile-only

* Por defecto: **false**
* Tipo: **Boolean**

Cuando se usa, solo se actualiza `pnpm-lock.yaml` y `package.json`. No se escribe nada en el directorio `node_modules`.

### --fix-lockfile

Arregla las entradas lockfile roto automaticamente.

### --frozen-lockfile

* Por defecto
  * No para CI: **false**
  * Para CI: **true**, si lockfile esta presente
* Tipo: **Boolean**

Si es `true`, pnpm no genera un lockfile y falla al instalar si el lockfile no está sincronizado con el manifiesto / se necesita una actualización o no hay ningún lockfile presente.

Esta configuración es `true` de forma predeterminada en [entornos de CI][]. El siguiente código se utiliza para detectar entornos de CI:

```js title="https://github.com/watson/ci-info/blob/44e98cebcdf4403f162195fbcf90b1f69fc6e047/index.js#L54-L61"
exports.isCI = !!(
  env.CI || // Travis CI, CircleCI, Cirrus CI, GitLab CI, Appveyor, CodeShip, dsari
  env.CONTINUOUS_INTEGRATION || // Travis CI, Cirrus CI
  env.BUILD_NUMBER || // Jenkins, TeamCity
  env.RUN_ID || // TaskCluster, dsari
  exports.name ||
  false
)
```

### --merge-git-branch-lockfiles

Merge all git branch lockfiles. [Read more about git branch lockfiles.](../git_branch_lockfiles)


### --reporter=&lt;name\>

* Por defecto
    * Para TTY stdout: **default**
    * Sin  non-TTY stdout: **append-only**
* Tipo: **default**, **append-only**, **ndjson**, **silent**

Allows you to choose the reporter that will log debug info to the terminal about the installation progress.

* **silent** - no se registra ninguna salida en la consola, ni siquiera errores fatales
* **default** - el reporte por defecto cuando la salida stdout es TTY
* **append-only** - la salida siempre se agrega al final. No se realizan manipulaciones del cursor
* **ndjson** - el reporte con más detalle. Prints all logs in [ndjson](https://github.com/ndjson/ndjson-spec) format

If you want to change what type of information is printed, use the [loglevel][] setting.

### --shamefully-hoist

* Por defecto: **false**
* Tipo: **Boolean**

Creates a flat `node_modules` structure, similar to that of `npm` or `yarn`. **WARNING**: This is highly discouraged.

### --ignore-scripts

* Por defecto: **false**
* Tipo: **Boolean**

Do not execute any scripts defined in the project `package.json` and its dependencies.

### --filter &lt;package_selector>

[Leer más acerca del filtrado.](../filtering.md)

### --resolution-only

Re-runs resolution: useful for printing out peer dependency issues.

import CpuFlag from '../settings/_cpuFlag.mdx'

<CpuFlag />

import OsFlag from '../settings/_osFlag.mdx'

<OsFlag />

import LibcFlag from '../settings/_libcFlag.mdx'

<LibcFlag />

[workspace]: ../workspaces.md

[entornos de CI]: https://github.com/watson/ci-info#supported-ci-tools

[loglevel]: ../settings.md#loglevel
