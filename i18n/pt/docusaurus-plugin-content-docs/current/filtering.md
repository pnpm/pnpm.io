---
id: filtering
title: Filtragem
---

A filtragem permite restringir comandos a subconjuntos específicos de pacotes.

O pnpm suporta uma sintaxe de seletor rica para selecionar pacotes por nome ou por relação.

Os seletores podem ser especificados por meio do sinalizador `--filter` (ou `-F`):

```sh
pnpm --filter <package_selector> <command>
```

## Coincidindo

### --filter &lt;nome_do_pacote>

Para selecionar um pacote exato apenas especifique o nome (`@scope/pkg`) ou use um padrão para selecionar um conjunto de pacotes (`@scope/*`).

Exemplos:

```sh
pnpm --filter "@babel/core" test
pnpm --filter "@babel/*" test
pnpm --filter "*core" test
```

Especificar o escopo do pacote é opcional, portanto `--filter=core` escolherá `@babel/core` se `core` não for encontrado. No entanto, se o espaço de trabalho tem vários pacotes com o mesmo nome (por exemplo, `@babel/core` e `@types/core`), então a filtragem sem escopo não escolherá nada.

### --filter &lt;nome_do_pacote>...

Para selecionar um pacote e suas dependências (diretas e não diretas), insira o nome do pacote seguido de reticências `<nome_do_pacote>...`. Por exemplo, o próximo comando executará testes de `foo` e todas as suas dependências:

```sh
pnpm --filter foo... test
```

Você pode usar um padrão para selecionar um conjunto de pacotes raiz:

```sh
pnpm --filter "@babel/preset-*..." test
```

### --filter &lt;nome_do_pacote>^...

Para selecionar APENAS as dependências de um pacote (diretas e não diretas), insira as reticências mencionadas precedidas por um acento circunflexo antes do nome. Por exemplo, o próximo comando executará testes para todas as dependências de `foo`:

```sh
pnpm --filter "foo^..." test
```

### --filter ...&lt;nome_do_pacote>

Para selecionar um pacote e suas dependências (diretas e não diretas), insira reticências seguido do nome do pacote: `...<nome_do_pacote>`. Por exemplo, isso executará os testes de `foo` e de todos os pacotes dependentes dele:

```sh
pnpm --filter ...foo test
```

### --filter "...^&lt;nome_do_pacote>"

Para selecionar APENAS as dependências de um pacote (tanto diretas quanto não-diretas), insira reticências seguidas de um acento circunflexo antes do nome do pacote. Por exemplo, isso irá executar testes para todos os pacotes dependentes de `foo`:

```text
pnpm --filter "...^foo" test
```

### --filter `./<glob>`, --filter `{<glob>}`

Um padrão glob relativo ao diretório de trabalho atual correspondendo aos projetos.

```sh
pnpm --filter "./packages/**" <cmd>
```

Inclui todos os projetos que estão sob o diretório especificado.

Ele pode ser usado com os operadores ellipsis e chevron para selecionar dependentes/dependências também:

```sh
pnpm --filter ...{<directory>} <cmd>
pnpm --filter {<directory>}... <cmd>
pnpm --filter ...{<directory>}... <cmd>
```

Também pode ser combinado com `[<since>]`. Por exemplo, para selecionar todos os projetos alterados dentro de um diretório:

```sh
pnpm --filter "{packages/**}[origin/master]" <cmd>
pnpm --filter "...{packages/**}[origin/master]" <cmd>
pnpm --filter "{packages/**}[origem/mestre]..." <cmd>
pnpm --filter "...{packages/**}[origin/master]..." <cmd>
```

Ou você pode selecionar todos os pacotes de um diretório com nomes que correspondam ao padrão fornecido:

```text
pnpm --filter "@babel/*{components/**}" <cmd>
pnpm --filter "@babel/*{components/**}[origin/master]" <cmd>
pnpm --filter "...@babel/*{components/**}[origin/master]" <cmd>
```

### --filter "[&lt;desde>]"

Seleciona todos os pacotes alterados desde o commit/branch especificado. Pode ser sufixado ou prefixado com `...` para incluir dependências/dependentes.

Por exemplo, o próximo comando executará testes em todos os pacotes alterados desde `master` e em quaisquer pacotes dependentes:

```sh
pnpm -- filter "... [origin/master]" teste
```

### --fail-if-no-match

Use this flag if you want the CLI to fail if no packages have matched the filters.

You may also set this permanently with a [`failIfNoMatch` setting][].

## Excluindo

Qualquer um dos seletores de filtro pode funcionar como operadores de exclusão quando tiver um "!" à esquerda de. Em zsh (e possivelmente em outros shells), "!" deve ser escapado: `\!`.

Por exemplo, isso executará um comando em todos os projetos, exceto `foo`:

```sh
pnpm --filter=!foo <cmd>

```

E isso executará um comando em todos os projetos que não estiverem no diretório `lib`:

```sh
pnpm --filter=!./lib <cmd>
```

## Multiplicidade

Quando os pacotes são filtrados, todo pacote que corresponde a pelo menos um dos seletores é obtido. Você pode usar quantos filtros quiser:

```sh
pnpm --filter ...foo --filter bar --filter baz... test
```

## --filter-prod &lt;filtering_pattern>

Atua da mesma forma `--filter`, mas omite `devDependencies` ao selecionar projetos de dependência do espaço de trabalho.

## --test-pattern &lt;glob>

`test-pattern` permite detectar se os arquivos modificados estão relacionados a testes. Se estiverem, os pacotes dependentes desses pacotes modificados não serão incluídos.

Esta opção é útil com o filtro "alterado desde". Por exemplo, o próximo comando executará testes em todos os pacotes alterados e, se as alterações estiverem no código-fonte do pacote, os testes também serão executados nos pacotes dependentes:

```sh
pnpm --filter="...[origin/master]" --test-pattern="test/*" test
```

## --changed-files-ignore-pattern &lt;glob>

Permite ignorar arquivos alterados por padrões glob ao filtrar projetos alterados desde o commit/branch especificado.

Exemplos de uso:

```sh
pnpm --filter="...[origin/master]" --changed-files-ignore-pattern="**/README.md" run build
```

[`failIfNoMatch` setting]: workspaces.md#failifnomatch
