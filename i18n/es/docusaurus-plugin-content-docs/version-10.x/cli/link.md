---
id: link
title: pnpm link
---

Aliases: `ln`

Hace que el paquete local actual sea accesible en todo el sistema, o en otra ubicación.

```text
pnpm link <dir|pkg name>
pnpm link
```

## Opciones

### `pnpm link <dir>`

Links package from `<dir>` directory to `node_modules` of package from where you're executing this command.

> For example, if you are inside `~/projects/foo` and you execute `pnpm link ../bar`, then a link to `bar` will be created in `foo/node_modules/bar`.

### `pnpm link`

Links package from location where this command was executed to global `node_modules`, so it can be referred from another package with `pnpm link <pkg>`. Also if the package has a `bin` field, then the package's binaries become available system-wide.

### `pnpm link <pkg>`

Links the specified package (`<pkg>`) from global `node_modules` to the `node_modules` of package from where this command was executed.

## Casos de uso

### Reemplazar un paquete instalado con una versión local del mismo

Let's say you have a project that uses `foo` package. You want to make changes to `foo` and test them in your project. In this scenario, you can use `pnpm link` to link the local version of `foo` to your project.

```bash
cd ~/projects/foo
pnpm install # install dependencies of foo
pnpm link # link foo globally
cd ~/projects/my-project
pnpm link foo # link foo to my-project
```

You can also link a package from a directory to another directory, without using the global `node_modules` directory:

```bash
cd ~/projects/foo
pnpm install # instala dependencias de foo
cd ~/projects/my-project
pnpm link ~/projects/foo # vincula foo a my-project
```

### Añadir un binario globalmente

If you are developing a package that has a binary, for example, a CLI tool, you can use `pnpm link` to make the binary available system-wide.
This is the same as using `pnpm install -g foo`, but it will use the local version of `foo` instead of downloading it from the registry.

Remember that the binary will be available only if the package has a `bin` field in its `package.json`.

```bash
cd ~/projects/foo
pnpm install # install dependencies of foo
pnpm link # link foo globally
```

## What's the difference between `pnpm link` and using the `file:` protocol?

When you use `pnpm link`, the linked package is symlinked from the source code. Usted puede modificar el código fuente del paquete vinculado y los cambios se reflejarán en su proyecto. Con este método, pnpm no instalará las dependencias del paquete vinculado, tendrá que instalarlas manualmente en el código fuente. This may be useful when you have to use a specific package manager for the linked package, for example, if you want to use `npm` for the linked package, but pnpm for your project.

When you use the `file:` protocol in `dependencies`, the linked package is hard-linked to your project `node_modules`, you can modify the source code of the linked package, and the changes will be reflected in your project. With this method pnpm will also install the dependencies of the linked package, overriding the `node_modules` of the linked package.

:::info

When dealing with **peer dependencies** it is recommended to use the `file:` protocol. Resuelve de mejor manera las dependencias peer de las dependencias del proyecto, asegurando que la dependencia vinculada usará correctamente las versiones de las dependencias especificadas en su proyecto principal, generando comportamientos más consistentes y esperados.

:::

| Feature                                                        | `pnpm link`                                                                                  | `file:` Protocol                                                        |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Enlace simbólico/Enlace duro                                   | Enlace simbólico                                                                             | Enlace duro                                                             |
| Refleja las modificaciones del código fuente                   | Sí                                                                                           | Sí                                                                      |
| Instala dependencias del paquete vinculado                     | No (requiere instalación manual)                                          | Yes (overrides `node_modules` of the linked package) |
| Usa un administrador de paquetes diferente para la dependencia | Possible (e.g., use `npm` for linked pkg) | No, usará pnpm                                                          |

