---
id: exec
title: pnpm exec
---

Executa um comando shell no escopo de um projeto.

`node_modules/.bin` é adicionado ao `PATH`, então `pnpm exec` permite executar comandos de dependências.

## Exemplos

Se você tem o Jest como dependência do seu projeto, não há necessidade de instalar o Jest globalmente, basta executá-lo com `pnpm exec`:

```
pnpm exec jest
```

A parte do `exec` é realmente opcional quando o comando não está em conflito com um comando interno pnpm, então você também pode executar:

```
pnpm jest
```

## Opções

Quaisquer opções para o comando `exec` devem ser listadas antes de sua palavra-chave. As opções listadas após a palavra-chave `exec` são passadas para o comando executado.

Bom. O pnpm será executado recursivamente:

```
pnpm -r exec jest
```

Ruim. O pnpm não será executado recursivamente, mas `jest` será executado com a opção `-r`:

```
pnpm exec jest -r
```

### --recursive, -r

Execute o comando shell em cada projeto do espaço de trabalho.

O nome do pacote atual está disponível através da variável de ambiente `PNPM_PACKAGE_NAME`.

#### Exemplos

Remove instalações da `node_modules` de todos os pacotes:

```
pnpm -r exec rm -rf node_modules
```

Ver informações de todos os pacotes. Isso deve ser usado com a opção `--shell-mode` (ou `-c`) para que a variável de ambiente funcione.

```
pnpm -rc exec pnpm view \$PNPM_PACKAGE_NAME
```

### --no-reporter-hide-prefix

Do not hide prefix when running commands in parallel.

### --resume-from &lt;nome_do_pacote\>

Filtra a execução a um projeto específico. Este comando pode ser útil se você estiver trabalhando em um grande workspace e deseja reiniciar a compilação em um projeto específico sem precisar compilar todos os outros projetos que o precedem na ordem de compilação.

### --parallel

Completely disregard concurrency and topological sorting, running a given script immediately in all matching packages. Essa opção é preferível para processos com uma longa duração que atinge muitos pacotes, como, por exemplo, um processo de compilação muito demorado.

### --shell-mode, -c

Executa o comando dentro de um shell. Utiliza `/bin/sh` no UNIX e `\cmd.exe` no Windows.

### --report-summary

[Leia mais sobre essa opção na documentação de run command](./run.md#--report-summary)

### --filter &lt;package_selector\>

[Leia mais sobre filtragem.](../filtering.md)
