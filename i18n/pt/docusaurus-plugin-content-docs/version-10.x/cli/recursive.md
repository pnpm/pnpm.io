---
id: recursive
title: pnpm -r, --recursive
---

Aliases: `m`, `multi`, `recursive`, `<command> -r`

Executa um comando em cada projeto de um workspace, quando usado com os seguintes comandos:

- `install`
- `list`
- `outdated`
- `publish`
- `pack`
- `rebuild`
- `remove`
- `unlink`
- `update`
- `why`

Executa um comando em cada projeto de um workspace, excluindo o projeto raiz,
quando usado com os seguintes comandos:

- `exec`
- `run`
- `test`
- `add`

If you want the root project be included even when running scripts, set the [includeWorkspaceRoot] setting to `true`.

Exemplos de uso:

```
pnpm -r publish
```

## Opções

### --link-workspace-packages

- Default: **false**
- Type: **true, false, deep**

Link locally available packages in workspaces of a monorepo into `node_modules`
instead of re-downloading them from the registry. This emulates functionality
similar to `yarn workspaces`.

Quando definido como deep, os pacotes locais também podem ser vinculados a subdependências.

Be advised that it is encouraged instead to use [`pnpm-workspace.yaml`] for this setting, to
enforce the same behaviour in all environments. Esta opção existe apenas para que você
possa substituí-la, se necessário.

[`pnpm-workspace.yaml`]: ../settings.md#linkWorkspacePackages

### --workspace-concurrency

- Default: **4**
- Type: **Number**

Define o número máximo de tarefas a serem executadas simultaneamente. For unlimited concurrency
use `Infinity`.

You can set the `workspace-concurrency` as `<= 0` and it will use amount of cores of the host as: `max(1, (number of cores) - abs(workspace-concurrency))`

### --[no-]bail

- Default: **true**
- Type: **Boolean**

Caso seja true, para quando uma tarefa gera um erro.

Esta configuração não afeta o código de saída.
Even if `--no-bail` is used, all tasks will finish but if any of the tasks fail,
the command will exit with a non-zero code.

Exemplo (executar testes em todos os pacotes, continuar se os testes falharem em um deles):

```sh
pnpm -r --no-bail test
```

### --[no-]sort

- Default: **true**
- Type: **Boolean**

When `true`, packages are sorted topologically (dependencies before dependents).
Pass `--no-sort` to disable.

Exemplo:

```sh
pnpm -r --no-sort test
```

### --reverse

- Default: **false**
- Type: **boolean**

When `true`, the order of packages is reversed.

```
pnpm -r --reverse run clean
```

### --filter &lt;package_selector\>

[Read more about filtering.](../filtering.md)

[includeWorkspaceRoot]: ../settings.md#includeWorkspaceRoot
