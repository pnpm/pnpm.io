---
id: run
title: pnpm run
---

Aliases: `run-script`

Executa um script definido no arquivo de manifesto do pacote.

## Exemplos

Digamos que você tenha um script `watch` configurado em seu `package.json`, da seguinte forma:

```json
"scripts": {
    "watch": "webpack --watch"
}
```

Agora você pode executar esse script usando `pnpm run watch`! Simples, certo? Outra coisa a notar para aqueles que gostam de economizar teclas e tempo é que todos os scripts possuem um alias de comando pnpm, por isso, no fim das contas, `pnpm watch` é apenas uma abreviação para `pnpm run watch` (SOMENTE para scripts que não compartilham o mesmo nome de comandos existentes do pnpm).

## Executando múltiplos scripts

Você pode executar múltiplos scripts ao mesmo tempo usando expressões regulares (regex) em vez do nome do script.

```sh
pnpm run "/<regex>/"
```

Rode todos os scripts que comecem com `watch:`:

```sh
pnpm run "/^watch:.*/"
```

## Detalhes

Em adição ao `PATH` pré-existente do shell, o `pnpm run` incluí também o diretório `node_modules/.bin` no `PATH` usado pelos `scripts`. Isso significa que desde que você tenha um pacote instalado, você pode usá-lo em um script como um comando comum. Por exemplo, se você tiver `eslint` instalado, poderá escrever um script da seguinte forma:

```json
"lint": "eslint src --fix"
```

E mesmo que `eslint` não esteja instalado globalmente em seu shell, ele será executado.

Em workspaces o diretório `/node_modules/.bin` também é adicionado ao `PATH`, então qualquer ferramenta instalada na raiz do workspace pode ser chamada nos `scripts` dos projetos daquele workspace.

## Environment

Há algumas variáveis de ambiente que o pnpm automaticamente cria para os scripts executados. Essas variáveis de ambiente podem ser usadas para obter informação contextual sobre os processos que estão rodando.

Essas são as variáveis de ambiente criadas pelo pnpm:

* **npm_command** - contém o nome do comando executado. Se o comando executado é `pnpm run`, então o valor dessa variável será "run-script".

## Opções

Quaisquer opções para o comando `run` devem ser listadas antes do nome do script. Opções passadas após o nome do script serão passadas para o script executado.

Nesses casos, o comando run do pnpm CLI vai ser executado com a opção `--silent`:

```sh
pnpm run --silent watch
pnpm --silent run watch
pnpm --silent watch
```

Qualquer argumento passado após o nome do comando é adicionado ao script executado. Logo, se `watch` executa `webpack --watch`, então esse comando:

```sh
pnpm run watch --no-color
```

vai executar:

```sh
webpack --watch --no-color
```

### --recursive, -r

This runs an arbitrary command from each package's "scripts" object. If a package doesn't have the command, it is skipped. If none of the packages have the command, the command fails.

### --if-present

You can use the `--if-present` flag to avoid exiting with a non-zero exit code when the script is undefined. This lets you run potentially undefined scripts without breaking the execution chain.

### --parallel

Completely disregard concurrency and topological sorting, running a given script immediately in all matching packages with prefixed streaming output. Essa opção é preferível para processos com uma longa duração que atinge muitos pacotes, como, por exemplo, um processo de compilação muito demorado.

### --stream

Stream output from child processes immediately, prefixed with the originating package directory. This allows output from different packages to be interleaved.

### --aggregate-output

Aggregate output from child processes that are run in parallel, and only print output when the child process is finished. It makes reading large logs after running `pnpm -r <command>` with `--parallel` or with `--workspace-concurrency=<number>` much easier (especially on CI). Only `--reporter=append-only` is supported.

### --resume-from &lt;nome_do_pacote\>

Filtra a execução a um projeto específico. Este comando pode ser útil se você estiver trabalhando em um grande workspace e deseja reiniciar a compilação em um projeto específico sem precisar compilar todos os outros projetos que o precedem na ordem de compilação.

### --report-summary

Record the result of the scripts executions into a `pnpm-exec-summary.json` file.

An example of a `pnpm-exec-summary.json` file:

```json
{
  "executionStatus": {
    "/Users/zoltan/src/pnpm/pnpm/cli/command": {
      "status": "passed",
      "duration": 1861.143042
    },
    "/Users/zoltan/src/pnpm/pnpm/cli/common-cli-options-help": {
      "status": "passed",
      "duration": 1865.914958
    }
  }
```

Possible values of `status` are: 'passed', 'queued', 'running'.

### --reporter-hide-prefix

Hide workspace prefix from output from child processes that are run in parallel, and only print the raw output. This can be useful if you are running on CI and the output must be in a specific format without any prefixes (e.g. [GitHub Actions annotations](https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-an-error-message)). Only `--reporter=append-only` is supported.

### --filter &lt;package_selector\>

[Leia mais sobre filtragem.](../filtering.md)

## pnpm-workspace.yaml settings

import EnablePrePostScripts from '../settings/_enablePrePostScripts.mdx'

<EnablePrePostScripts />

import ScriptShell from '../settings/_scriptShell.mdx'

<ScriptShell />

import ShellEmulator from '../settings/_shellEmulator.mdx'

<ShellEmulator />
