---
id: install
title: pnpm install
---

Aliases: `i`

`pnpm install` é usado para instalar todas as dependências de um projeto.

Num ambiente de CI, a instalação falhará se um lockfile estiver presente, mas precise ser atualizado.

Dentro de uma [área de trabalho][], `pnpm install` instala todas as dependências em todos os projetos. Se quiser desativar este comportamento, mude a configuração de `recursive-install` para `false`.

![](/img/demos/pnpm-install.svg)

## Resumo

| Comando                    | Significado                                    |
| -------------------------- | ---------------------------------------------- |
| `pnpm i --offline`         | Instala offline apenas com os pacotes em cache |
| `pnpm i --frozen-lockfile` | O `pnpm-lock.yaml` não é atualizado            |
| `pnpm i --lockfile-only`   | Apenas o `pnpm-lock.yaml` é atualizado         |

## Options for filtering dependencies

Without a lockfile, pnpm has to create one, and it must be consistent regardless of dependencies filtering, so running `pnpm install --prod` on a directory without a lockfile would still resolve the dev dependencies, and it would error if the resolution is unsuccessful. The only exception for this rule are `link:` dependencies.

Without `--frozen-lockfile`, pnpm will check for outdated information from `file:` dependencies, so running `pnpm install --prod` without `--frozen-lockfile` on an environment where the target of `file:` has been removed would error.

### --prod, -P

* Padrão: **false**
* Tipo: **Boolean**

If `true`, pnpm will not install any package listed in `devDependencies` and will remove those insofar they were already installed. If `false`, pnpm will install all packages listed in `devDependencies` and `dependencies`.

### --dev, -D

Only `devDependencies` are installed and `dependencies` are removed insofar they were already installed.

### --no-optional

`optionalDependencies` não serão instaladas.

## Opções

### --force

Força a reinstalação das dependências: busca novamente pacotes modificados na loja, recriando um lockfile e/ou modificando o diretório de módulos criados por uma versão não compatível do pnpm. Instala todas as dependências opcionais, mesmo que elas não satisfaçam o ambiente atual (cpu, os, arch).

### --offline

* Padrão: **false**
* Tipo: **Boolean**

Se `true`, pnpm irá usar apenas os pacotes disponíveis em cache. Se um pacote não for encontrado localmente, a instalação falhará.

### --prefer-offline

* Padrão: **false**
* Tipo: **Boolean**

Se `true`, as verificações de desatualização dos dados cacheados serão ignorados, mas os dados ausentes serão solicitados do servidor. Para forçar o modo offline, use `--offline`.

### --no-lockfile

Don't read or generate a `pnpm-lock.yaml` file.

### --lockfile-only

* Padrão: **false**
* Tipo: **Boolean**

Quando passado, apenas atualiza o `pnpm-lock.yaml` e `package.json`. Nada será escrito no diretório `node_modules`.

### --fix-lockfile

Corrige entradas quebradas no lockfile.

### --frozen-lockfile

* Padrão:
  * Fora de CI: **false**
  * Em CI: **true**, se um lockfile estiver presente
* Tipo: **Boolean**

Se `true`, o pnpm não vai gerar um lockfile e vai falhar a instalação nas seguintes situações: o lockfile não está em conforme com o manifesto, uma atualização é necessária ou não tem nenhum lockfile presente.

Essa configuração é por padrão `true` no [ambiente de CI][]. O seguinte código é usado para detectar ambientes de CI:

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

* Padrão:
    * Em stdout TTY: **default**
    * Em stdout não TTY: **append-only**
* Tipo: **default**, **append-only**, **ndjson**, **silent**

Allows you to choose the reporter that will log debug info to the terminal about the installation progress.

* **silent** - nenhuma informação será impressa no terminal, nem mesmo para erros fatais
* **default** - o relator padrão quando o stdout é TTY
* **append-only** - A saída é sempre adicionada no final. O cursor não é manipulado
* **ndjson** - o relator mais detalhador. Prints all logs in [ndjson](https://github.com/ndjson/ndjson-spec) format

If you want to change what type of information is printed, use the [loglevel][] setting.

### --shamefully-hoist

* Padrão: **false**
* Tipo: **Boolean**

Creates a flat `node_modules` structure, similar to that of `npm` or `yarn`. **WARNING**: This is highly discouraged.

### --ignore-scripts

* Padrão: **false**
* Tipo: **Boolean**

Do not execute any scripts defined in the project `package.json` and its dependencies.

### --filter &lt;package_selector>

[Leia mais sobre filtragem.](../filtering.md)

### --resolution-only

Re-runs resolution: useful for printing out peer dependency issues.

import CpuFlag from '../settings/_cpuFlag.mdx'

<CpuFlag />

import OsFlag from '../settings/_osFlag.mdx'

<OsFlag />

import LibcFlag from '../settings/_libcFlag.mdx'

<LibcFlag />

[área de trabalho]: ../workspaces.md

[ambiente de CI]: https://github.com/watson/ci-info#supported-ci-tools

[loglevel]: ../settings.md#loglevel
