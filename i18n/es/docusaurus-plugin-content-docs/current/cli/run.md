---
id: run
title: pnpm run
---

Aliases: `run-script`

Ejecuta un script definido en el archivo de manifiesto del paquete.

## Ejemplos

Digamos que tiene un script `watch` configurado en su `package.json` así:

```json
"scripts": {
    "watch": "webpack --watch"
}
```

¡Ahora puedes ejecutar este script usando `pnpm run watch`! Simple, ¿verdad? Otra cosa a tener en cuenta para aquellos a los que les gusta ahorrar pulsaciones de teclas y tiempo es que todos los scripts tienen un alias como comandos pnpm, por lo que, en última instancia, `pnpm watch` es solo una abreviatura de `pnpm run watch` (SÓLO para scripts que no comparten el mismo nombre que los comandos pnpm ya existentes).

## Ejecutar múltiples scripts

Puede ejecutar varias secuencias de comandos al mismo tiempo utilizando una expresión regular en lugar del nombre de la secuencia de comandos.

```sh
pnpm run "/<regex>/"
```

Ejecutar todos los scripts que comienzan con `watch:`:

```sh
pnpm run "/^watch:.*/"
```

## Detalles

Además del `PATH` preexistente del shell, `pnpm run` incluye `node_modules/.bin` en el `PATH` proporcionado a `scripts`. Esto significa que siempre y cuando tengas un paquete instalado, puedes usarlo en un script como un comando regular. Por ejemplo, si tiene instalado `eslint`, puede escribir un script así:

```json
"lint": "eslint src --fix"
```

Y aunque `eslint` no está instalado globalmente en tu shell, se ejecutará.

Para espacios de trabajo "workspaces", `<workspace root>/node_modules/.bin` también se añade al `PATH`, por lo que si se instala una herramienta en la raíz del espacio de trabajo, puede llamarse en los scripts `de cualquier paquete de espacio de trabajo`.

## Environment

There are some environment variables that pnpm automatically creates for the executed scripts. These environment variables may be used to get contextual information about the running process.

These are the environment variables created by pnpm:

* **npm_command** - contains the name of the executed command. If the executed command is `pnpm run`, then the value of this variable will be "run-script".

## Opciones

Any options for the `run` command should be listed before the script's name. Options listed after the script's name are passed to the executed script.

All these will run pnpm CLI with the `--silent` option:

```sh
pnpm run --silent watch
pnpm --silent run watch
pnpm --silent watch
```

Any arguments after the command's name are added to the executed script. So if `watch` runs `webpack --watch`, then this command:

```sh
pnpm run watch --no-color
```

will run:

```sh
webpack --watch --no-color
```

### --recursive, -r

This runs an arbitrary command from each package's "scripts" object. If a package doesn't have the command, it is skipped. If none of the packages have the command, the command fails.

### --if-present

You can use the `--if-present` flag to avoid exiting with a non-zero exit code when the script is undefined. This lets you run potentially undefined scripts without breaking the execution chain.

### --parallel

Completely disregard concurrency and topological sorting, running a given script immediately in all matching packages with prefixed streaming output. Este es el parámetro preferido para procesos de ejecución prolongada en muchos paquetes, por ejemplo, un proceso de compilación prolongado.

### --stream

Stream output from child processes immediately, prefixed with the originating package directory. This allows output from different packages to be interleaved.

### --aggregate-output

Aggregate output from child processes that are run in parallel, and only print output when the child process is finished. It makes reading large logs after running `pnpm -r <command>` with `--parallel` or with `--workspace-concurrency=<number>` much easier (especially on CI). Only `--reporter=append-only` is supported.

### --resume-from &lt;nombre_paquete\>

Continúa la ejecución de un proyecto en particular. Esto puede ser útil si estás trabajando con un área de trabajo grande y quieres reiniciar una compilación en un proyecto particular sin ejecutar a través de todos los proyectos que lo preceden en el orden de compilación.

### --report-summary

Registre el resultado de las ejecuciones de los scripts en un archivo `pnpm-exec-summary.json`.

Un ejemplo de un archivo `pnpm-exec-summary.json`:

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

Los valores posibles de `status` son: 'passed', 'queued', 'running'.

### --reporter-hide-prefix

Oculta el prefijo del espacio de trabajo de la salida de procesos hijos que se ejecutan en paralelo y solo imprime la salida sin formato. Esto puede ser útil si está ejecutando en CI y la salida debe estar en un formato específico sin ningún prefijo (por ejemplo, [anotaciones de GitHub Actions](https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-an-error-message)). Solo se admite `--reporter=append-only`.

### --filter &lt;package_selector\>

[Leer más acerca del filtrado.](../filtering.md)

## pnpm-workspace.yaml settings

import EnablePrePostScripts from '../settings/_enablePrePostScripts.mdx'

<EnablePrePostScripts />

import ScriptShell from '../settings/_scriptShell.mdx'

<ScriptShell />

import ShellEmulator from '../settings/_shellEmulator.mdx'

<ShellEmulator />
