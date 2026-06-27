---
id: store
title: pnpm store
---

Gestión del almacén de paquetes.

## Commands

### status

Busca por paquetes modificados en el almacen de paquetes.

Devuelve el código de salida 0 si el contenido del paquete es el mismo que en el momento de desempaquetar.

### add

Functionally equivalent to [`pnpm add`], except this adds new packages to the
store directly without modifying any projects or files outside of the store.

[`pnpm add`]: ./add.md

### prune

Removes _unreferenced packages_ from the store.

Los paquetes no referenciados son paquetes que no son utilizados por ningún proyecto en el sistema. Los paquetes pueden dejar de ser referenciados después de la mayoría de las operaciones de instalación, por ejemplo cuando las dependencias son redundantes.

For example, during `pnpm install`, package `foo@1.0.0` is updated to
`foo@1.0.1`. pnpm will keep `foo@1.0.0` in the store, as it does not
automatically remove packages. If package `foo@1.0.0` is not used by any other
project on the system, it becomes unreferenced. Running `pnpm store prune` would
remove `foo@1.0.0` from the store.

Running `pnpm store prune` is not harmful and has no side effects on your
projects. En el caso de que futuras instalaciónes requieran paquetes removidos, pnpm los descargará de nuevo.

It is best practice to run `pnpm store prune` occasionally to clean up the
store, but not too frequently. Sometimes, unreferenced packages become required
again. This could occur when switching branches and installing older
dependencies, in which case pnpm would need to re-download all removed packages,
briefly slowing down the installation process.

When the [global virtual store] is enabled, `pnpm store prune` also performs mark-and-sweep garbage collection on the global virtual store's `links/` directory. Projects using the store are registered via symlinks in `{storeDir}/v10/projects/`, allowing pnpm to track active usage and safely remove unused packages from the global virtual store.

[global virtual store]: ../settings.md#enableglobalvirtualstore

Please note that this command is prohibited when a [store server] is running.

[store server]: ./server.md

### path

Returns the path to the active store directory.
