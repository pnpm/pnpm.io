---
id: pnpm-store-pt-br
title: pnpm store
---

Comandos relacionados ao repositório de pacotes [pnpm](about-the-package-store).

## pnpm status da store

```sh
pnpm store status
```

Verifica pacotes modificados na store.

Retorna o código de saída 0 se o conteúdo do pacote for o mesmo que estava no momento da descompactação.

## pnpm store add

Adicionado em: v2.12.0

```sh
pnpm store add [<scope> /] <pkg> ...
```

Adiciona novos pacotes ao armazenamento pnpm diretamente.
Não modifica nenhum projeto ou arquivo fora da store.

Exemplos de uso:

```sh
store pnpm add express @ 4 typescript @ 2
```

## pnpm store usages

Adicionado em: v2.21.0

```sh
Usos da store pnpm [<@scope> /] <pkg> ...
```

Lista todos os projetos pnpm no sistema de arquivos atual que dependem dos pacotes especificados na store.

Exemplos de uso:

```sh
pnpm store usages flatmap-stream
pnpm store usages is-odd@3.0.0 is-even@2.0.0
pnpm store usages @babel/core ansi-regex
```

> Note que este comando pode ser lento para stores muito grandes.
> Estamos trabalhando para melhorar o desempenho.

## pnpm store prune

```sh
pnpm store prune
```

Remove pacotes não referenciados (estranhos, órfãos) da store.

Podar a store não é prejudicial, mas pode retardar futuras instalações.

Por favor, leia [o FAQ] (faq.md # what-does-pnpm-store-prune-do-é-ele-prejudicial) para obter mais informações sobre pacotes não referenciados e as melhores práticas do `pnpm store prune`.

> Este comando é proibido quando um [store server](pnpm-server) está sendo executado.
