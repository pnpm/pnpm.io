---
id: exec
title: pnpm exec
---

Executa um comando shell no escopo de um projeto.

`node_modules/.bin` is added to the `PATH`, so `pnpm exec` allows executing commands of dependencies.

## Exemplos

If you have Jest as a dependency of your project, there is no need to install Jest globally, just run it with `pnpm exec`:

```
pnpm exec jest
```

The `exec` part is actually optional when the command is not in conflict with a builtin pnpm command, so you may also just run:

```
pnpm jest
```

## Opções

Any options for the `exec` command should be listed before the `exec` keyword.
Options listed after the `exec` keyword are passed to the executed command.

Bom. O pnpm será executado recursivamente:

```
pnpm -r exec jest
```

Bad, pnpm will not run recursively but `jest` will be executed with the `-r` option:

```
pnpm exec jest -r
```

### --recursive, -r

Execute o comando shell em cada projeto do espaço de trabalho.

The name of the current package is available through the environment variable
`PNPM_PACKAGE_NAME`.

#### Exemplos

Prune `node_modules` installations for all packages:

```
pnpm -r exec rm -rf node_modules
```

Ver informações de todos os pacotes. This should be used with the `--shell-mode` (or `-c`) option for the environment variable to work.

```
pnpm -rc exec pnpm view \$PNPM_PACKAGE_NAME
```

### --no-reporter-hide-prefix

Do not hide prefix when running commands in parallel.

### --resume-from &amp;lt;package_name\>

Filtra a execução a um projeto específico. Este comando pode ser útil se você estiver trabalhando em um grande workspace e deseja reiniciar a compilação em um projeto específico sem precisar compilar todos os outros projetos que o precedem na ordem de compilação.

### --parallel

Completely disregard concurrency and topological sorting, running a given script
immediately in all matching packages. Essa opção é preferível para processos com uma longa duração que atinge muitos pacotes, como, por exemplo, um processo de compilação muito demorado.

### --shell-mode, -c

Executa o comando em um shell. Uses `/bin/sh` on UNIX and `\cmd.exe` on Windows.

### --report-summary

[Read about this option in the run command docs](./run.md#--report-summary)

### --filter &amp;lt;package_selector\>

[Read more about filtering.](../filtering.md)
