---
id: unlink
title: pnpm unlink
---

Remove um pacote acessível a todo sistema (inverso de [`pnpm link`](./link.md)).

Se chamado sem argumentos, todas as dependências vinculadas serão desvinculadas dentro do projeto atual.

Semelhante a `yarn unlink`, excepto que pnpm reinstala as dependências depois de remover o link externo.

:::info

If you want to remove a link made with `pnpm link --global <package>`, you should use `pnpm uninstall --global <package>`. `pnpm unlink` only removes the links in your current directory.

:::

## Opções

### --recursive, -r

Unlink in every package found in subdirectories or in every workspace package, when executed inside a [workspace](../workspaces.md).

### --filter &lt;package_selector\>

[Leia mais sobre filtragem.](../filtering.md)
