---
id: update
title: pnpm update
---

Aliases: `up`, `upgrade`

`pnpm update` atualiza os pacotes para suas últimas versões baseando-se no intervalo do versões especificado.

Quando utilizado sem argumentos, atualiza todas as dependências.

## Resumo

| Comando              | Resultado                                                                           |
| -------------------- | ----------------------------------------------------------------------------------- |
| `pnpm up`            | Atualiza todas as dependências, conforme o intervalo especificado no `package.json` |
| `pnpm up --latest`   | Updates all dependencies to their latest versions                                   |
| `pnpm up foo@2`      | Atualiza `foo` para a última versão em v2                                           |
| `pnpm up "@babel/*"` | Atualiza todas as dependências do scope `@babel`                                    |

## Selecionando dependências com patterns

É possível utilizar patterns para atualizar dependências específicas.

Para atualizar todos os pacotes de `babel`:

```sh
pnpm update "@babel/*"
```

Atualizar todas as dependências, exceto o `webpack`:

```sh
pnpm update "\!webpack"
```

Os patterns também podem ser combinados, dessa forma o próximo comando atualizará todas as dependências de `babel`, exceto `core`:

```sh
pnpm update "@babel/*" "\!@babel/core"
```

## Opções

### --recursive, -r

Executa simultaneamente a atualização em todos os subdiretórios com `package.json` (excluindo node_modules).

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

Se pacotes específicos forem atualizados, o comando falhará se alguma das dependências atualizadas não forem encontradas dentro do workspace. Por exemplo, o seguinte comando falhará se `express` não for um pacote do workspace:

```sh
pnpm up -r --workspace express
```

### --prod, -P

Atualiza apenas pacotes em `dependencies` e `optionalDependencies`.

### --dev, -D

Atualize apenas pacotes em `devDependencies`.

### --no-optional

Não atualiza pacotes em `optionalDependencies`.

### --interactive, -i

Exibe dependências desatualizadas e seleciona quais atualizar.

### --no-save

Don't update the ranges in `package.json`.

### --filter &lt;package_selector\>

[Leia mais sobre filtragem.](../filtering.md)
