---
id: version-2-pnpm-recursive
title: pnpm recursivo
original_id: pnpm-recursive
---

## tl; dr

| Comando | Significado |
| - | - |
| `pnpm recursive install` | executa a instalação para cada pacote em cada subpasta |
| `pnpm recursive run build --filter foo-*` | constrói todos os pacotes com nomes que começam com` foo-`|
| `pnpm recursive update -- login-page...` || atualiza dependências em `login-page` e qualquer dependência de` login-page` que também está no repositório |

## Opções

### link-workspace-packages

Adicionado em: v2.14.0

* Padrão: **false**
* Tipo: **Boolean**

Quando pacotes `true`, localmente disponíveis, são vinculados a` node_modules` em vez de serem baixados do registro.
Isso é muito conveniente em um repositório de vários pacotes.

#### Uso

Crie um arquivo `.npmrc` na raiz do seu repositório multi-pacote com o seguinte conteúdo:

```
link-workspace-packages = true
```

Crie um arquivo [pnpm-workspace.yaml](workspace.md) com o seguinte conteúdo:

```yaml
packages:
  - '**'
```

Execute o `pnpm recursive install`.

### shared-workspace-shrinkwrap

Adicionado em: v2.17.0

* Padrão: **false**
* Tipo: **Boolean**

Quando `true`, o pnpm cria um único arquivo` shrinkwrap.yaml` na raiz da área de trabalho (no diretório que contém o arquivo `pnpm-workspace.yaml`).
Um shrinkwrap compartilhado também significa que todas as dependências de todos os pacotes do espaço de trabalho estarão em um único `node_modules`.

Vantagens desta opção:

* toda dependência é um singleton
* instalações mais rápidas em um repositório multi-pacote
* menos alterações nas revisões de código

**NOTA:** apesar de todas as dependências estarem linkadas para a raiz `node_modules`, os pacotes terão acesso somente àquelas dependências
que são declarados em seu `package.json`. Portanto, o rigor do pnpm é preservado.

### - & lt; package_selector> ..., --filter & lt; package_selector>

Adicionado em: v2.13.0

Capacidade de passar seletores após `--` adicionado na v2.15.0

Filtros permitem restringir comandos a um subconjunto de pacotes.
Uma rica sintaxe de seletor é suportada para escolher pacotes por nome
ou por relação.

#### --filter & lt; package_name>

Adicionado em: v2.13.0

Para selecionar um pacote exato, basta especificar seu nome (`@ babel / core`) ou usar um padrão
para selecionar um conjunto de pacotes (`@ babel / *`).

Exemplos de uso:

```sh
pnpm recursive install --filter @babel/core
pnpm recursive install --filter @babel/*
# or
pnpm recursive install -- @babel/core
pnpm recursive install -- @babel/*
```


#### --filter & lt; package_name> ...

Adicionado em: v2.13.0

Para selecionar um pacote e suas dependências (diretas e não diretas), sufixar o nome do pacote com 3 pontos: `<nome_do_pacote> ...`.
Por exemplo, o próximo comando executará a instalação em todas as dependências de `foo` e em` foo`:

```sh
pnpm recursive install --filter foo...
# or
pnpm recursive install -- foo...
```

Você pode usar um padrão para selecionar um conjunto de pacotes "root":

```sh
pnpm recursive install --filter @babel/preset-*...
# or
pnpm recursive install -- @babel/preset-*...
```

#### --filter ... & lt; package_name>

Adicionado em: 2.14.0

Para selecionar um pacote e seus pacotes dependentes (direto e não direto), prefixar o nome do pacote com 3 pontos: `... <nome_do_pacote>`.
Por exemplo, o próximo comando executará a instalação em todos os dependentes de `foo` e em` foo`:

```sh
pnpm recursive install --filter ...foo
# or
pnpm recursive install -- ...foo
```

Quando os pacotes no espaço de trabalho são filtrados, cada pacote é obtido correspondendo a pelo menos um dos
os seletores. Você pode usar quantos filtros quiser:

```sh
pnpm recursive install --filter ...foo --filter bar --filter qar...
# or
pnpm recursive install -- ...foo bar qar...
```

#### --filter ./& lt; diretório>

Adicionado em: v2.15.0

### área de trabalho-simultaneidade

Adicionado em: v2.13.0

* Padrão: **4**
* Tipo: **Número**

Defina o número máximo de simultaneidade. Para concorrência ilimitada, use o `Infinity`.

### bail

Adicionado em: v2.13.0

* Padrão: **true**
* Tipo: **Boolean**

Se verdadeiro, pára quando uma tarefa lança um erro.

Exemplo de uso. Execute testes em todos os pacotes. Continue se os testes falharem em um dos pacotes:

```
pnpm recursive test --no-bail
```

### ordenar

Adicionado em: v2.14.0

* Padrão: **true**
* Tipo: **Boolean**

Quando `true`, os pacotes são classificados topologicamente (dependências antes dos dependentes). Passe `--no-sort` para desativar.

Exemplos de uso:

```sh
pnpm recursive test --no-sort
```

## pnpm instalação recursiva

Adicionado em: v1.24.0

```sh
pnpm recursive install [argumentos]
```

Executa simultaneamente a instalação em todos os subdiretórios com um `package.json` (excluindo node_modules).

Exemplos de uso:

```sh
pnpm recursive install
pnpm recursive install --ignore-scripts
```

Atualização recursiva ## pnpm

Adicionado em: v1.24.0

```sh
pnpm recursive update [argumentos]
```

Executa simultaneamente a atualização em todos os subdiretórios com um `package.json` (excluindo node_modules).

Exemplos de uso:

```sh
pnpm recursive update
pnpm recursive update --depth 100
# atualiza o typescript para a versão mais recente em cada pacote
pnpm recursive update typescript@latest
```

## pnpm desinstalação recursiva

Adicionado em: v2.10.0

```sh
pnpm recursive uninstall [<@scope>/]<pkg>...
```

Desinstalar uma dependência de cada pacote

Exemplos de uso:

```sh
pnpm recursive uninstall webpack
```

## pnpm dislink recursivo

Adicionado em: v1.32.0

Um alias de "unlink recursivo" da v2.0.0

```sh
pnpm recursive dislink [arguments]
```

Remove links para pacotes locais e os reinstala do registro.

Exemplos de uso:

```sh
pnpm recursive dislink
```

## pnpm recursiva desatualizada

Adicionado em: v2.2.0

```sh
pnpm recursive outdated [[<@scope>/]<pkg> ...]
```

Verifique se há pacotes desatualizados em todos os projetos do repositório de vários pacotes.

Exemplos de uso:

```sh
pnpm recursive outdated
```

## pnpm lista recursiva

Adicionado em: v2.2.0

```sh
pnpm recursive list [[<@scope>/]<pkg> ...]
```

Listar pacotes em cada projeto do repositório multi-pacote.
Aceita os mesmos argumentos e sinalizadores que o comando regular `pnpm list`.

Exemplos de uso:

```sh
pnpm recursive list
```

Corrida recursiva ## pnpm

Adicionado em: v2.3.0

```sh
pnpm recursive run <command> [-- <args>...]
```


Isso executa um comando arbitrário do objeto "scripts" de cada pacote.
Se um pacote não tiver o comando, ele será ignorado.
Se nenhum dos pacotes tiver o comando, o comando falhará.

Exemplos de uso:

```sh
pnpm recursive run build
```

teste recursivo ## pnpm

Adicionado em: v2.3.0

```sh
pnpm recursive test [-- <args>...]
```

Isso executa o script "test" de cada pacote, se um foi fornecido.

Exemplos de uso:

```sh
pnpm recursive test
```

reconstrução recursiva ## pnpm

Adicionado em: v2.4.0

```sh
pnpm recursive rebuild [[<@scope>/<name>]...]
```

Esse comando executa o comando ** pnpm build ** em todos os pacotes do repositório de vários pacotes.

Exemplos de uso:

```sh
pnpm recursive rebuild
```


## pnpm recursive exec

Adicionado em: v2.9.0

```sh
pnpm recursive exec -- <command> [args...]
```

Esse comando executa um comando em cada pacote do repositório de vários pacotes.

O nome do pacote atual está disponível através da variável de ambiente `PNPM_PACKAGE_NAME` (suportada pelo pnpm v2.22.0).

Exemplos de uso:

```sh
pnpm recursive exec -- rm -rf node_modules
pnpm recursive exec -- pnpm view $PNPM_PACKAGE_NAME
```