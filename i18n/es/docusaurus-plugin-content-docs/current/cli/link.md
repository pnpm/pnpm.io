---
id: link
title: pnpm link
---

Alias: `ln`

Links a local package to the current project's `node_modules`.

```text
pnpm link <dir>
```

## Opciones

### `pnpm link <dir>`

Links package from `<dir>` directory to `node_modules` of package from where you're executing this command. `<dir>` must be a relative or absolute path.

> For example, if you are inside `~/projects/foo` and you execute `pnpm link ../bar`, then a link to `bar` will be created in `foo/node_modules/bar`.

:::note Breaking changes in v11

`pnpm link` no longer resolves packages from the global store. Only relative or absolute paths are accepted (use `pnpm link ./foo` instead of `pnpm link foo`).

`pnpm link --global` has been removed. To register a local package's bins globally, use `pnpm add -g .` instead.

`pnpm link` with no arguments has been removed. Always pass an explicit path.

:::

## Casos de uso

### Reemplazar un paquete instalado con una versión local del mismo

Digamos que tienes un proyecto que utiliza el paquete `foo`. Desea realizar cambios en `foo` y probarlos en su proyecto. In this scenario, you can use `pnpm link` to link the local version of `foo` to your project:

```bash
cd ~/projects/foo
pnpm install # instala dependencias de foo
cd ~/projects/my-project
pnpm link ~/projects/foo # vincula foo a my-project
```

### Añadir un binario globalmente

To make a local package's binaries available system-wide, use `pnpm add -g .` instead:

```bash
cd ~/projects/foo
pnpm install # install dependencies of foo
pnpm add -g . # register foo's bins globally
```

Recuerde que el binario estará disponible solo si el paquete tiene un campo `bin` dentro de su `package.json`.

## ¿Cuál es la diferencia entre `pnpm link` y usar el protocolo `file:`?

Cuando utiliza `pnpm link`, el paquete vinculado está vinculado simbólicamente desde el código fuente. Usted puede modificar el código fuente del paquete vinculado y los cambios se reflejarán en su proyecto. Con este método, pnpm no instalará las dependencias del paquete vinculado, tendrá que instalarlas manualmente en el código fuente. This may be useful when you have to use a specific package manager for the linked package, for example, if you want to use `npm` for the linked package, but pnpm for your project.

Cuando utiliza el protocolo `file:` en `dependencies`, el paquete vinculado está vinculado físicamente al `node_modules` de su proyecto, puede modificar el código fuente del paquete vinculado y los cambios se reflejarán en su proyecto. Con este método pnpm también instalará las dependencias del paquete vinculado, sobreescribiendo el `node_modules` del paquete vinculado.

:::info

Cuando se trabaja con las **dependencias peer** se recomienda usar el `file:` protocolo. Resuelve de mejor manera las dependencias peer de las dependencias del proyecto, asegurando que la dependencia vinculada usará correctamente las versiones de las dependencias especificadas en su proyecto principal, generando comportamientos más consistentes y esperados.

:::

| Características                                                | `pnpm link`                                        | Protocolo `file:`                                         |
| -------------------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------- |
| Enlace simbólico/Enlace duro                                   | Enlace simbólico                                   | Enlace duro                                               |
| Refleja las modificaciones del código fuente                   | Sí                                                 | Sí                                                        |
| Instala dependencias del paquete vinculado                     | No (requiere instalación manual)                   | Sí (sobreescribe el `node_modules` del paquete vinculado) |
| Usa un administrador de paquetes diferente para la dependencia | Posible (p. ej., use `npm` para paquete vinculado) | No, usará pnpm                                            |
