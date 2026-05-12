---
id: exec
title: pnpm exec
---

Ejecuta un comando de shell en el ámbito de un proyecto.

`node_modules/.bin` is added to the `PATH`, so `pnpm exec` allows executing commands of dependencies.

## Ejemplos

If you have Jest as a dependency of your project, there is no need to install Jest globally, just run it with `pnpm exec`:

```
pnpm exec jest
```

The `exec` part is actually optional when the command is not in conflict with a builtin pnpm command, so you may also just run:

```
pnpm jest
```

## Opciones

Any options for the `exec` command should be listed before the `exec` keyword.
Options listed after the `exec` keyword are passed to the executed command.

Bien. pnpm se ejecutará recursivamente:

```
pnpm -r exec jest
```

Bad, pnpm will not run recursively but `jest` will be executed with the `-r` option:

```
pnpm exec jest -r
```

### --recursive, -r

Ejecuta un comando de shell en cada proyecto del workspace.

The name of the current package is available through the environment variable
`PNPM_PACKAGE_NAME`.

#### Ejemplos

Prune `node_modules` installations for all packages:

```
pnpm -r exec rm -rf node_modules
```

Ver la información de todos los paquetes. This should be used with the `--shell-mode` (or `-c`) option for the environment variable to work.

```
pnpm -rc exec pnpm view \$PNPM_PACKAGE_NAME
```

### --no-reporter-hide-prefix

Do not hide prefix when running commands in parallel.

### --resume-from &lt;package_name\>

Continúa la ejecución de un proyecto en particular. Esto puede ser útil si estás trabajando con un área de trabajo grande y quieres reiniciar una compilación en un proyecto particular sin ejecutar a través de todos los proyectos que lo preceden en el orden de compilación.

### --parallel

Completely disregard concurrency and topological sorting, running a given script
immediately in all matching packages. Este es el
parámetro preferido para procesos de ejecución prolongada en muchos paquetes, por ejemplo, un
proceso de compilación prolongado.

### --shell-mode, -c

Ejecuta el comando dentro de un shell. Uses `/bin/sh` on UNIX and `\cmd.exe` on Windows.

### --report-summary

[Read about this option in the run command docs](./run.md#--report-summary)

### --filter &lt;package_selector\>

[Read more about filtering.](../filtering.md)
