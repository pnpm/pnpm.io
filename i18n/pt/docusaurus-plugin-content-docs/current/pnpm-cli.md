---
id: pnpm-cli
title: pnpm CLI
---

## Short aliases

Added in: v11.0.0

`pn` is available as a short alias for `pnpm`, and [`pnx`](./cli/pnx.md) as a short alias for `pnpm dlx`. You can use them anywhere you'd use `pnpm` or `pnpx`:

```sh
pn install
pn add express
pn build
pn test
pnx create-vue my-app
```

## Diferenças vs npm

Ao contrário do npm, o pnpm valida todas as opções. Por exemplo, `pnpm install --target_arch x64` falhará porque `--target_arch` não é uma opção válida para `pnpm install`.

No entanto, algumas dependências podem utilizar a variável de ambiente `npm_config_`, que é preenchida a partir das opções da CLI. Neste caso, você tem as seguintes opções:

1. defina explicitamente a variável de ambiente: `npm_config_target_arch=x64 pnpm install`
1. force a opção desconhecida com `--config.`: `pnpm install --config.target_arch=x64`

## Opções

### -C &lt;caminho\>, --dir &lt;caminho\>

Execute como se o pnpm tivesse sido iniciado em `<caminho>` em vez do diretório de trabalho atual.

### -w, --workspace-root

Run as if pnpm was started in the root of the [workspace](./workspaces.md) instead of the current working directory.

## Comandos

Para obter mais informações, consulte a documentação de comandos CLI individuais. Aqui está uma lista de comandos úteis equivalentes ao npm para você começar:

| npm command           | pnpm equivalent          |
| --------------------- | ------------------------ |
| `npm install`         | [`pnpm install`][]       |
| `npm i <pkg>`   | [`pnpm add <pkg>`] |
| `npm run <cmd>` | [`pnpm <cmd>`]     |
| `npx <pkg>`     | [`pnx <pkg>`]      |

Quando um comando desconhecido é usado, o pnpm buscará um script com o nome fornecido, então `pnpm run lint` é o mesmo que `pnpm lint`. If there is no script with the specified name, then pnpm will execute the command as a shell script, so you can do things like `pnpm eslint` (see [`pnpm exec`][]).

## Environment variables

Some environment variables that are not pnpm related might change the behaviour of pnpm:

* [`CI`](./cli/install.md#--frozen-lockfile)

These environment variables may influence what directories pnpm will use for storing global information:

* `XDG_CACHE_HOME`
* `XDG_CONFIG_HOME`
* `XDG_DATA_HOME`
* `XDG_STATE_HOME`

You can search the docs to find the settings that leverage these environment variables.

[`pnpm install`]: ./cli/install.md
[`pnpm exec`]: ./cli/exec.md
