---
id: outdated
title: pnpm outdated
---

Procura pacotes antigos. A verificação pode ser limitada a um subconjunto de pacotes instalados passando argumentos (regex não é suportado).

Exemplos:

```sh
pnpm outdated
pnpm outdated "*gulp-*" @babel/core
```

## Opções

### --recursive, -r

Procura por pacotes antigos em todos os pacotes encontrados em um subdiretorio, ou em todos os pacotes da workspace caso for executado em uma workspace.

### --filter &amp;lt;package_selector\>

[Read more about filtering.](../filtering.md)

### --global, -g

Listar pacotes globais antigos.

### --long

Mostra mais detalhes.

### --format &amp;lt;format\>

- Default: **table**
- Type: **table**, **list**, **json**

Imprima as dependências desatualizadas no formato especificado.

### --compatible

Prints only versions that satisfy specifications in `package.json`.

### --dev, -D

Checks only `devDependencies`.

### --prod, -P

Checks only `dependencies` and `optionalDependencies`.

### --no-optional

Doesn't check `optionalDependencies`.

### --sort-by

Specifies the order in which the output results are sorted. Currently only the value `name` is accepted.
