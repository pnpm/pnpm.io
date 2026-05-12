---
id: update
title: pnpm update
---

Aliases: `up`, `upgrade`

`pnpm update` updates packages to their latest version based on the specified
range.

Quando utilizado sem argumentos, atualiza todas as dependências.

## Resumo

| Comando              | Resultado                                                                |
| -------------------- | ------------------------------------------------------------------------ |
| `pnpm up`            | Updates all dependencies, adhering to ranges specified in `package.json` |
| `pnpm up --latest`   | Updates all dependencies to their latest versions                        |
| `pnpm up foo@2`      | Updates `foo` to the latest version on v2                                |
| `pnpm up "@babel/*"` | Updates all dependencies under the `@babel` scope                        |

## Selecionando dependências com patterns

É possível utilizar patterns para atualizar dependências específicas.

Update all `babel` packages:

```sh
pnpm update "@babel/*"
```

Update all dependencies, except `webpack`:

```sh
pnpm update "\!webpack"
```

Patterns may also be combined, so the next command will update all `babel` packages, except `core`:

```sh
pnpm update "@babel/*" "\!@babel/core"
```

## Opções

### --recursive, -r

Concurrently runs update in all subdirectories with a `package.json` (excluding
node_modules).

Exemplos de uso:

```sh
pnpm --recursive update
# Atualiza todos os packages em uma profundidade de até 100 subdiretórios.
pnpm --recursive update --depth 100
# atualiza o typescript para a última versão em todos os packages.
pnpm --recursive update typescript@latest
```

### --latest, -L

Update the dependencies to their latest stable version as determined by their `latest` tags (potentially upgrading the packages across major versions) as long as the version range specified in `package.json` is lower than the `latest` tag (i.e. it will not downgrade prereleases).

### --global, -g

Atualiza os pacotes globais.

### --workspace

Tenta vincular todos os pacotes do workspace. As versões são atualizadas para corresponder às versões dos pacotes dentro do workspace.

Se pacotes específicos forem atualizados, o comando falhará se alguma das dependências atualizadas não forem encontradas dentro do workspace. For instance, the following
command fails if `express` is not a workspace package:

```sh
pnpm up -r --workspace express
```

### --prod, -P

Only update packages in `dependencies` and `optionalDependencies`.

### --dev, -D

Only update packages in `devDependencies`.

### --no-optional

Don't update packages in `optionalDependencies`.

### --interactive, -i

Exibe dependências desatualizadas e seleciona quais atualizar.

### --no-save

Don't update the ranges in `package.json`.

### --filter &amp;lt;package_selector\>

[Read more about filtering.](../filtering.md)
