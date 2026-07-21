---
id: unlink
title: pnpm unlink
---

Unlinks a system-wide package (inverse of [`pnpm link`](./link.md)).

Se chamado sem argumentos, todas as dependências vinculadas serão desvinculadas dentro do projeto atual.

This is similar to `yarn unlink`, except pnpm re-installs the dependency after
removing the external link.

:::info

If you want to remove a link made with `pnpm link --global <package>`, you should use `pnpm uninstall --global <package>`.
`pnpm unlink` only removes the links in your current directory.

:::

## Opções

### --recursive, -r

Unlink in every package found in subdirectories or in every workspace package,
when executed inside a [workspace](../workspaces.md).

### --filter &lt;package_selector\>

[Read more about filtering.](../filtering.md)
