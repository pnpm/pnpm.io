---
id: install
title: pnpm install
---

Aliases: `i`

`pnpm install` is used to install all dependencies for a project.

En ambiente CI, la installación falla si el lockfile existe pero necesita ser actualizado.

Inside a [workspace], `pnpm install` installs all dependencies in all the
projects. If you want to disable this behavior, set the `recursive-install`
setting to `false`.

![](/img/demos/pnpm-install.svg)

[workspace]: ../workspaces.md

## TL;DR

| Comando                    | Significado                                          |
| -------------------------- | ---------------------------------------------------- |
| `pnpm i --offline`         | Instala modo offline desde el almacenamiento interno |
| `pnpm i --frozen-lockfile` | `pnpm-lock.yaml` is not updated                      |
| `pnpm i --lockfile-only`   | Only `pnpm-lock.yaml` is updated                     |

## Options for filtering dependencies

Without a lockfile, pnpm has to create one, and it must be consistent regardless of dependencies
filtering, so running `pnpm install --prod` on a directory without a lockfile would still resolve the
dev dependencies, and it would error if the resolution is unsuccessful. The only exception for this rule
are `link:` dependencies.

Without `--frozen-lockfile`, pnpm will check for outdated information from `file:` dependencies, so
running `pnpm install --prod` without `--frozen-lockfile` on an environment where the target of `file:`
has been removed would error.

### --prod, -P

- Default: **false**
- Type: **Boolean**

If `true`, pnpm will not install any package listed in `devDependencies` and will remove
those insofar they were already installed.
If `false`, pnpm will install all packages listed in `devDependencies` and `dependencies`.

### --dev, -D

Only `devDependencies` are installed and `dependencies` are removed insofar they
were already installed.

### --no-optional

`optionalDependencies` are not installed.

## Opciones

### --force

Fuerza la reinstalación de las dependencias: recupera los paquetes modificados en la tienda, recrea un lockfile y/o un directorio de módulos creado por una versión no compatible de pnpm. Instala todas las dependencias opcionales, incluso si no satisfacen el entorno actual (cpu, os, arch).

### --offline

- Default: **false**
- Type: **Boolean**

If `true`, pnpm will use only packages already available in the store.
Si un paquete no se encuentra localmente, la instalación fallará.

### --prefer-offline

- Default: **false**
- Type: **Boolean**

If `true`, staleness checks for cached data will be bypassed, but missing data
will be requested from the server. To force full offline mode, use `--offline`.

### --no-lockfile

Don't read or generate a `pnpm-lock.yaml` file.

### --lockfile-only

- Default: **false**
- Type: **Boolean**

When used, only updates `pnpm-lock.yaml` and `package.json`. Nothing gets written to the `node_modules` directory.

### --fix-lockfile

Arregla las entradas lockfile roto automaticamente.

### --frozen-lockfile

- Por defecto
  - For non-CI: **false**
  - For CI: **true**, if a lockfile is present
- Type: **Boolean**

If `true`, pnpm doesn't generate a lockfile and fails to install if the lockfile
is out of sync with the manifest / an update is needed or no lockfile is
present.

This setting is `true` by default in [CI environments]. El siguiente código se utiliza para detectar entornos de CI:

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

[CI environments]: https://github.com/watson/ci-info#supported-ci-tools

### --merge-git-branch-lockfiles

Merge all git branch lockfiles.
[Read more about git branch lockfiles.](../git_branch_lockfiles)

### --reporter=&lt;name\>

- Por defecto
  - For TTY stdout: **default**
  - For non-TTY stdout: **append-only**
- Type: **default**, **append-only**, **ndjson**, **silent**

Allows you to choose the reporter that will log debug info to the terminal about
the installation progress.

- **silent** - no output is logged to the console, not even fatal errors
- **default** - the default reporter when the stdout is TTY
- **append-only** - the output is always appended to the end. No se realizan manipulaciones del cursor
- **ndjson** - the most verbose reporter. Prints all logs in [ndjson](https://github.com/ndjson/ndjson-spec) format

If you want to change what type of information is printed, use the [loglevel] setting.

[loglevel]: ../settings.md#loglevel

### --use-store-server

- Default: **false**
- Type: **Boolean**

:::danger

Deprecated feature

:::

Starts a store server in the background. The store server will keep running
after installation is done. To stop the store server, run `pnpm server stop`

### --shamefully-hoist

- Default: **false**
- Type: **Boolean**

Creates a flat `node_modules` structure, similar to that of `npm` or `yarn`.
**WARNING**: This is highly discouraged.

### --ignore-scripts

- Default: **false**
- Type: **Boolean**

Do not execute any scripts defined in the project `package.json` and its
dependencies.

### --filter &lt;package_selector>

[Read more about filtering.](../filtering.md)

### --resolution-only

Re-runs resolution: useful for printing out peer dependency issues.

import CpuFlag from '../settings/_cpuFlag.mdx'

<CpuFlag />

import OsFlag from '../settings/_osFlag.mdx'

<OsFlag />

import LibcFlag from '../settings/_libcFlag.mdx'

<LibcFlag />
