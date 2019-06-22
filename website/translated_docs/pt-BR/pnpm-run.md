---
id: pnpm-run-pt-br
title: pnpm run
---

Executa um script de pacote definido.

```
pnpm run <command> [- <args> ...]
```

Além do "PATH" pré-existente do shell, o `pnpm run` adiciona `node_modules/.bin`
para o `PATH` fornecido para `scripts`. A partir da v3.5, quando executado dentro de um espaço de trabalho,
`<raiz da área de trabalho>/node_modules/.bin` também é adicionado ao `PATH`, portanto, se uma ferramenta
está instalado na raiz do espaço de trabalho, ele pode ser chamado em `scripts` de qualquer pacote de espaço de trabalho.

