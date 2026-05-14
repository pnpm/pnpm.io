---
id: link
title: pnpm link
---

Aliases: `ln`

Torna o pacote local atual acessível em todo o sistema, ou em outro local.

```text
pnpm link <dir|pkg name>
pnpm link
```

## Opções

### `pnpm link <dir>`

Links package from `<dir>` directory to `node_modules` of package from where you're executing this command.

> For example, if you are inside `~/projects/foo` and you execute `pnpm link ../bar`, then a link to `bar` will be created in `foo/node_modules/bar`.

### `pnpm link`

Links package from location where this command was executed to global `node_modules`, so it can be referred from another package with `pnpm link <pkg>`. Also if the package has a `bin` field, then the package's binaries become available system-wide.

### `pnpm link <pkg>`

Links the specified package (`<pkg>`) from global `node_modules` to the `node_modules` of package from where this command was executed.

## Casos de uso

### Substitua um pacote instalado por sua versão local

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
pnpm install # instala dependências de foo
cd ~/projects/my-project
pnpm link ~/projects/foo # vincula foo à my-project
```

### Adicione um binário globalmente

If you are developing a package that has a binary, for example, a CLI tool, you can use `pnpm link` to make the binary available system-wide.
This is the same as using `pnpm install -g foo`, but it will use the local version of `foo` instead of downloading it from the registry.

Remember that the binary will be available only if the package has a `bin` field in its `package.json`.

```bash
cd ~/projects/foo
pnpm install # install dependencies of foo
pnpm link # link foo globally
```

## What's the difference between `pnpm link` and using the `file:` protocol?

When you use `pnpm link`, the linked package is symlinked from the source code. Você pode modificar o código-fonte do pacote vinculado e as alterações serão refletidas em seu projeto. Com este método o pnpm não instalará as dependências do pacote vinculado, você terá que instalá-las manualmente no código-fonte. This may be useful when you have to use a specific package manager for the linked package, for example, if you want to use `npm` for the linked package, but pnpm for your project.

When you use the `file:` protocol in `dependencies`, the linked package is hard-linked to your project `node_modules`, you can modify the source code of the linked package, and the changes will be reflected in your project. With this method pnpm will also install the dependencies of the linked package, overriding the `node_modules` of the linked package.

:::info

When dealing with **peer dependencies** it is recommended to use the `file:` protocol. It better resolves the peer dependencies from the project dependencies, ensuring that the linked dependency correctly uses the versions of the dependencies specified in your main project, leading to more consistent and expected behaviors.

:::

| Recurso                                      | `pnpm link`                                                                                  | `file:` Protocol                                                        |
| -------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Symlink/Hard-link                            | Symlink                                                                                      | Hard-link                                                               |
| Reflects source code modifications           | Yes                                                                                          | Yes                                                                     |
| Installs dependencies of the linked package  | No (manual installation required)                                         | Yes (overrides `node_modules` of the linked package) |
| Use different package manager for dependency | Possible (e.g., use `npm` for linked pkg) | No, it will use pnpm                                                    |

