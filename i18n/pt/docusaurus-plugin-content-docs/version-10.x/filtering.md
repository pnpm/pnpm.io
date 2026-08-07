---
id: filtering
title: Filtragem
---

A filtragem permite restringir comandos a subconjuntos específicos de pacotes.

O pnpm suporta uma sintaxe de seletor rica para selecionar pacotes por nome ou por relação.

Selectors may be specified via the `--filter` (or `-F`) flag:

```sh
pnpm --filter <package_selector> <command>
```

## Coincidindo

### --filter &lt;package_name>

To select an exact package, just specify its name (`@scope/pkg`) or use a
pattern to select a set of packages (`@scope/*`).

Exemplos:

```sh
pnpm --filter "@babel/core" test
pnpm --filter "@babel/*" test
pnpm --filter "*core" test
```

Specifying the scope of the package is optional, so `--filter=core` will pick `@babel/core` if `core` is not found.
However, if the workspace has multiple packages with the same name (for instance, `@babel/core` and `@types/core`),
then filtering without scope will pick nothing.

### --filter &lt;package_name>...

To select a package and its dependencies (direct and non-direct), suffix the
package name with an ellipsis: `<package_name>...`. For instance, the next
command will run tests of `foo` and all of its dependencies:

```sh
pnpm --filter foo... test
```

Você pode usar um padrão para selecionar um conjunto de pacotes raiz:

```sh
pnpm --filter "@babel/preset-*..." test
```

### --filter &lt;package_name>^...

Para selecionar APENAS as dependências de um pacote (diretas e não diretas),
insira as reticências mencionadas precedidas por um acento circunflexo antes do nome. For
instance, the next command will run tests for all of `foo`'s
dependencies:

```sh
pnpm --filter "foo^..." test
```

### --filter ...&lt;package_name>

To select a package and its dependent packages (direct and non-direct), prefix
the package name with an ellipsis: `...<package_name>`. For instance, this will
run the tests of `foo` and all packages dependent on it:

```sh
pnpm --filter ...foo test
```

### --filter "...^&lt;package_name>"

Para selecionar APENAS as dependências de um pacote (tanto diretas quanto não-diretas), insira reticências seguidas de um acento circunflexo antes do nome do pacote. For instance, this will
run tests for all packages dependent on `foo`:

```text
pnpm --filter "...^foo" test
```

### --filter `./<glob>`, --filter `{<glob>}`

Um padrão glob relativo ao diretório de trabalho atual correspondendo aos projetos.

```sh
pnpm --filter "./packages/**" <cmd>
```

Inclui todos os projetos que estão sob o diretório especificado.

Ele pode ser usado com os operadores ellipsis e chevron para selecionar
dependentes/dependências também:

```sh
pnpm --filter ...{<directory>} <cmd>
pnpm --filter {<directory>}... <cmd>
pnpm --filter ...{<directory>}... <cmd>
```

It may also be combined with `[<since>]`. Por exemplo, para selecionar todos os projetos
alterados dentro de um diretório:

```sh
pnpm --filter "{packages/**}[origin/master]" <cmd>
pnpm --filter "...{packages/**}[origin/master]" <cmd>
pnpm --filter "{packages/**}[origin/master]..." <cmd>
pnpm --filter "...{packages/**}[origin/master]..." <cmd>
```

Ou você pode selecionar todos os pacotes de um diretório com nomes que correspondam ao padrão
fornecido:

```text
pnpm --filter "@babel/*{components/**}" <cmd>
pnpm --filter "@babel/*{components/**}[origin/master]" <cmd>
pnpm --filter "...@babel/*{components/**}[origin/master]" <cmd>
```

### --filter "[&lt;since>]"

Seleciona todos os pacotes alterados desde o commit/branch especificado. May be
suffixed or prefixed with `...` to include dependencies/dependents.

For example, the next command will run tests in all changed packages since
`master` and on any dependent packages:

```sh
pnpm -- filter "... [origin/master]" teste
```

### --fail-if-no-match

Use this flag if you want the CLI to fail if no packages have matched the filters.

You may also set this permanently with a [`failIfNoMatch` setting].

[`failIfNoMatch` setting]: settings.md#failifnomatch

## Excluindo

Qualquer um dos seletores de filtro pode funcionar como operadores de exclusão quando tiver um "!" à esquerda de. In zsh (and possibly other shells), "!" should be escaped: `\!`.

For instance, this will run a command in all projects except for `foo`:

```sh
pnpm --filter=!foo <cmd>
```

And this will run a command in all projects that are not under the `lib`
directory:

```sh
pnpm --filter=!./lib <cmd>
```

## Multiplicidade

Quando os pacotes são filtrados, todo pacote que corresponde a pelo menos um dos
seletores é obtido. Você pode usar quantos filtros quiser:

```sh
pnpm --filter ...foo --filter bar --filter baz... test
```

## --filter-prod &lt;filtering_pattern>

Acts the same a `--filter` but omits `devDependencies` when selecting dependency projects
from the workspace.

## --test-pattern &lt;glob>

`test-pattern` allows detecting whether the modified files are related to tests.
Se estiverem, os pacotes dependentes desses pacotes modificados não serão incluídos.

Esta opção é útil com o filtro "alterado desde". Por exemplo, o próximo comando
executará testes em todos os pacotes alterados e, se as alterações estiverem no código-fonte
do pacote, os testes também serão executados nos pacotes dependentes:

```sh
pnpm --filter="...[origin/master]" --test-pattern="test/*" test
```

## --changed-files-ignore-pattern &lt;glob>

Permite ignorar arquivos alterados por padrões glob ao filtrar projetos alterados desde o commit/branch especificado.

Exemplos de uso:

```sh
pnpm --filter="...[origin/master]" --changed-files-ignore-pattern="**/README.md" run build
```
