---
id: unlink
title: pnpm unlink
---

Desvincula un paquete de todo el sistema (inverso de [`pnpm link`](./link.md)).

If called without arguments, all linked dependencies will be unlinked inside the current project.

Esto es similar a `yarn unlink`, excepto que pnpm vuelve a instalar la dependencia después de eliminar el enlace externo.

:::info

If you want to remove a link made with `pnpm link --global <package>`, you should use `pnpm uninstall --global <package>`. `pnpm unlink` only removes the links in your current directory.

:::

## Opciones

### --recursive, -r

Unlink in every package found in subdirectories or in every workspace package, when executed inside a [workspace](../workspaces.md).

### --filter &lt;selector_de_paquete\>

[Leer más acerca del filtrado.](../filtering.md)
