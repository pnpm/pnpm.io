---
id: install
title: pnpm install
---

Aliases: `i`

`pnpm install` is used to install all dependencies for a project.

Num ambiente de CI, a instalação falhará se um lockfile estiver presente, mas precise ser atualizado.

Inside a [workspace], `pnpm install` installs all dependencies in all the
projects. If you want to disable this behavior, set the `recursive-install`
setting to `false`.

![](/img/demos/pnpm-install.svg)

[workspace]: ../workspaces.md

## Resumo

| Comando                    | Resultado                                      |
| -------------------------- | ---------------------------------------------- |
| `pnpm i --offline`         | Instala offline apenas com os pacotes em cache |
| `pnpm i --frozen-lockfile` | `pnpm-lock.yaml` is not updated                |
| `pnpm i --lockfile-only`   | Only `pnpm-lock.yaml` is updated               |

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

## Opções

### --force

Força a reinstalação das dependências: busca novamente pacotes modificados na loja, recriando um lockfile e/ou modificando o diretório de módulos criados por uma versão não compatível do pnpm. Instala todas as dependências opcionais, mesmo que elas não satisfaçam o ambiente atual (cpu, os, arch).

### --offline

- Default: **false**
- Type: **Boolean**

If `true`, pnpm will use only packages already available in the store.
Se um pacote não for encontrado localmente, a instalação falhará.

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

Corrige entradas quebradas no lockfile.

### --frozen-lockfile

- Padrão:
  - For non-CI: **false**
  - For CI: **true**, if a lockfile is present
- Type: **Boolean**

If `true`, pnpm doesn't generate a lockfile and fails to install if the lockfile
is out of sync with the manifest / an update is needed or no lockfile is
present.

This setting is `true` by default in [CI environments]. O seguinte código é usado para detectar ambientes de CI:

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

- Padrão:
  - For TTY stdout: **default**
  - For non-TTY stdout: **append-only**
- Type: **default**, **append-only**, **ndjson**, **silent**

Allows you to choose the reporter that will log debug info to the terminal about
the installation progress.

- **silent** - no output is logged to the console, not even fatal errors
- **default** - the default reporter when the stdout is TTY
- **append-only** - the output is always appended to the end. O cursor não é manipulado
- **ndjson** - the most verbose reporter. Prints all logs in [ndjson](https://github.com/ndjson/ndjson-spec) format

If you want to change what type of information is printed, use the [loglevel] setting.

[loglevel]: ../settings.md#loglevel

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
