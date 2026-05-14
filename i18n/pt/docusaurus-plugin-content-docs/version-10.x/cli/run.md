---
id: run
title: pnpm run
---

Aliases: `run-script`

Executa um script definido no arquivo de manifesto do pacote.

## Exemplos

Let's say you have a `watch` script configured in your `package.json`, like so:

```json
"scripts": {
    "watch": "webpack --watch"
}
```

You can now run that script by using `pnpm run watch`! Simples, certo?
Another thing to note for those that like to save keystrokes and time is that
all scripts get aliased in as pnpm commands, so ultimately `pnpm watch` is just
shorthand for `pnpm run watch` (ONLY for scripts that do not share the same name
as already existing pnpm commands).

## Executando múltiplos scripts

Você pode executar múltiplos scripts ao mesmo tempo usando expressões regulares (regex) em vez do nome do script.

```sh
pnpm run "/<regex>/"
```

Run all scripts that start with `watch:`:

```sh
pnpm run "/^watch:.*/"
```

## Detalhes

In addition to the shell’s pre-existing `PATH`, `pnpm run` includes
`node_modules/.bin` in the `PATH` provided to `scripts`. Isso significa que desde que você tenha um pacote instalado, você pode usá-lo em um script como um comando comum. For example, if you have `eslint` installed, you can write up a script
like so:

```json
"lint": "eslint src --fix"
```

And even though `eslint` is not installed globally in your shell, it will run.

For workspaces, `<workspace root>/node_modules/.bin` is also added
to the `PATH`, so if a tool is installed in the workspace root, it may be called
in any workspace package's `scripts`.

## Environment

Há algumas variáveis de ambiente que o pnpm automaticamente cria para os scripts executados.
Essas variáveis de ambiente podem ser usadas para obter informação contextual sobre os processos que estão rodando.

Essas são as variáveis de ambiente criadas pelo pnpm:

- **npm_command** - contains the name of the executed command. If the executed command is `pnpm run`, then the value of this variable will be "run-script".

## Opções

Any options for the `run` command should be listed before the script's name.
Opções passadas após o nome do script serão passadas para o script executado.

All these will run pnpm CLI with the `--silent` option:

```sh
pnpm run --silent watch
pnpm --silent run watch
pnpm --silent watch
```

Qualquer argumento passado após o nome do comando é adicionado ao script executado.
So if `watch` runs `webpack --watch`, then this command:

```sh
pnpm run watch --no-color
```

vai executar:

```sh
webpack --watch --no-color
```

### --recursive, -r

This runs an arbitrary command from each package's "scripts" object.
If a package doesn't have the command, it is skipped.
If none of the packages have the command, the command fails.

### --if-present

You can use the `--if-present` flag to avoid exiting with a non-zero exit code
when the script is undefined. This lets you run potentially undefined scripts
without breaking the execution chain.

### --parallel

Completely disregard concurrency and topological sorting, running a given script
immediately in all matching packages with prefixed streaming output. Essa opção é preferível para processos com uma longa duração que atinge muitos pacotes, como, por exemplo, um processo de compilação muito demorado.

### --stream

Stream output from child processes immediately, prefixed with the originating
package directory. This allows output from different packages to be interleaved.

### --aggregate-output

Aggregate output from child processes that are run in parallel, and only print output when the child process is finished. It makes reading large logs after running `pnpm -r <command>` with `--parallel` or with `--workspace-concurrency=<number>` much easier (especially on CI). Only `--reporter=append-only` is supported.

### --resume-from &lt;package_name\>

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

[Read more about filtering.](../filtering.md)

## pnpm-workspace.yaml settings

import EnablePrePostScripts from '../settings/_enablePrePostScripts.mdx'

<EnablePrePostScripts />

import ScriptShell from '../settings/_scriptShell.mdx'

<ScriptShell />

import ShellEmulator from '../settings/_shellEmulator.mdx'

<ShellEmulator />
