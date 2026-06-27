---
id: store
title: pnpm store
---

Gestión del almacén de paquetes.

## Comandos

### status

Busca por paquetes modificados en el almacen de paquetes.

Devuelve el código de salida 0 si el contenido del paquete es el mismo que en el momento de desempaquetar.

### add

Funcionalmente equivalente a [`pnpm añadir`][], excepto esto añade nuevos paquetes a la tienda directamente sin modificar ningún proyecto o archivos fuera de la tienda.

### prune

Remueve _paquetes no referenciados_ del almacén de paquetes.

Los paquetes no referenciados son paquetes que no son utilizados por ningún proyecto en el sistema. Los paquetes pueden dejar de ser referenciados después de la mayoría de las operaciones de instalación, por ejemplo cuando las dependencias son redundantes.

Por ejemplo, durante `pnpm install`, el paquete `foo@1.0.0` es actualizado a `foo@1.0.1`. pnpm mantendrá el paquete `foo@1.0.0` en el almacén de paquetes, ya que no remueve paquetes automáticamente. Si el paquete `foo@1.0.0` no es utilizado por ningún otro proyecto en el sistema, deja de ser referenciado. Ejecutar `pnpm store prune` removería el paquete `foo@1.0.0` del almacén de paquetes.

Ejecutar `pnpm store prune` no representa un riesgo y no tiene efectos secundarios en tus proyectos. En el caso de que futuras instalaciónes requieran paquetes removidos, pnpm los descargará de nuevo.

It is best practice to run `pnpm store prune` occasionally to clean up the store, but not too frequently. Sometimes, unreferenced packages become required again. This could occur when switching branches and installing older dependencies, in which case pnpm would need to re-download all removed packages, briefly slowing down the installation process.

After pruning, pnpm displays the total size of removed files.

When the [global virtual store][] is enabled, `pnpm store prune` also performs mark-and-sweep garbage collection on the global virtual store's `links/` directory. Projects using the store are registered via symlinks in `{storeDir}/v11/projects/`, allowing pnpm to track active usage and safely remove unused packages from the global virtual store.

### path

Returns the path to the active store directory.

[`pnpm añadir`]: ./add.md

[global virtual store]: ../settings.md#enableglobalvirtualstore
