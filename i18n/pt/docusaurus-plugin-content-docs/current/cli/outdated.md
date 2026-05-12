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

### --filter &lt;package_selector\>

[Leia mais sobre filtragem.](../filtering.md)

### --global, -g

Listar pacotes globais antigos.

### --long

Mostra mais detalhes.

### --format &lt;format\>

* Padrão: **table**
* Tipos: **table**, **list**, **json**

Imprima as dependências desatualizadas no formato especificado.

### --compatible

Imprima apenas as versões que atendem às especificações em `package.json`.

### --dev, -D

Verifique apenas `devDependencies`.

### --prod, -P

Verifique apenas `dependencies` e `optionalDependencies`.

### --no-optional

Não verifica `optionalDependencies`.

### --sort-by

Specifies the order in which the output results are sorted. Currently only the value `name` is accepted.
