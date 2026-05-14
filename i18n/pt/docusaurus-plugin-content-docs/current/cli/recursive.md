---
id: recursive
title: pnpm -r, --recursive
---

Aliases: `m`, `multi`, `recursive`, `<command> -r`

Executa um comando em cada projeto de um workspace, quando usado com os seguintes comandos:

* `install`
* `list`
* `outdated`
* `publish`
* `pack`
* `rebuild`
* `remove`
* `unlink`
* `update`
* `why`

Executa um comando em cada projeto de um workspace, excluindo o projeto raiz, quando usado com os seguintes comandos:

* `exec`
* `run`
* `test`
* `add`

If you want the root project be included even when running scripts, set the [includeWorkspaceRoot][] setting to `true`.

Exemplos de uso:

```
pnpm -r publish
```

## Opções

### --link-workspace-packages

* Padrão: **false**
* Tipo: **true, false, deep**

Vincula pacotes disponíveis localmente em workspaces de um monorepo na pasta `node_modules` em vez de baixá-los novamente do registry. Isso emula uma funcionalidade semelhante a `yarn workspaces`.

Quando definido como deep, os pacotes locais também podem ser vinculados a subdependências.

Be advised that it is encouraged instead to use [`pnpm-workspace.yaml`][] for this setting, to enforce the same behaviour in all environments. Esta opção existe apenas para que você possa substituí-la, se necessário.

### --workspace-concurrency

* Padrão: **4**
* Tipo: **Number**

Define o número máximo de tarefas a serem executadas simultaneamente. Para controle de concorrência ilimitada use `Infinity`.

You can set the `workspace-concurrency` as `<= 0` and it will use amount of cores of the host as: `max(1, (number of cores) - abs(workspace-concurrency))`

### --[no-]bail

* Padrão: **true**
* Tipo: **Boolean**

Caso seja true, para quando uma tarefa gera um erro.

Esta configuração não afeta o código de saída. Mesmo se `--no-bail` for usado, todas as tarefas terminarão, mas se alguma das tarefas falhar, o comando sairá com um código diferente de zero.

Exemplo (executar testes em todos os pacotes, continuar se os testes falharem em um deles):
```sh
pnpm -r --no-bail test
```

### --[no-]sort

* Padrão: **true**
* Tipo: **Boolean**

Quando `true`, os pacotes são classificados topologicamente (dependências antes de dependentes). Passe `--no-sort` para desabilitar.

Exemplo:
```sh
pnpm -r --no-sort test
```

### --reverse

* Padrão: **false**
* Tipo: **Boolean**

Quando `true`, a ordem dos pacotes é invertida.

```
pnpm -r --reverse run clean
```

### --filter &lt;package_selector\>

[Leia mais sobre filtragem.](../filtering.md)

[`pnpm-workspace.yaml`]: ../settings.md#linkWorkspacePackages

[includeWorkspaceRoot]: ../settings.md#includeWorkspaceRoot
