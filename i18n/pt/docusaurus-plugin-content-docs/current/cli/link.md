---
id: link
title: pnpm link
---

Aliases: `ln`

Links a local package to the current project's `node_modules`.

```text
pnpm link <dir>
```

## Opções

### `pnpm link <dir>`

Links package from `<dir>` directory to `node_modules` of package from where you're executing this command. `<dir>` must be a relative or absolute path.

> For example, if you are inside `~/projects/foo` and you execute `pnpm link ../bar`, then a link to `bar` will be created in `foo/node_modules/bar`.

:::note Breaking changes in v11

`pnpm link` no longer resolves packages from the global store. Only relative or absolute paths are accepted (use `pnpm link ./foo` instead of `pnpm link foo`).

`pnpm link --global` has been removed. To register a local package's bins globally, use `pnpm add -g .` instead.

`pnpm link` with no arguments has been removed. Always pass an explicit path.

:::

## Casos de uso

### Substitua um pacote instalado por sua versão local

Digamos que você tenha um projeto que usa o pacote `foo`. Você deseja fazer alterações em `foo` e testá-las em seu projeto. In this scenario, you can use `pnpm link` to link the local version of `foo` to your project:

```bash
cd ~/projects/foo
pnpm install # instala dependências de foo
cd ~/projects/my-project
pnpm link ~/projects/foo # vincula foo à my-project
```

### Adicione um binário globalmente

To make a local package's binaries available system-wide, use `pnpm add -g .` instead:

```bash
cd ~/projects/foo
pnpm install # install dependencies of foo
pnpm add -g . # register foo's bins globally
```

Lembre-se que o binário estará disponível somente se o pacote tiver um campo `bin` em seu `package.json`.

## Qual é a diferença entre `pnpm link` e usar o protocolo `file:`?

Quando você usa `pnpm link`, o pacote é vinculado simbolicamente ao código-fonte. Você pode modificar o código-fonte do pacote vinculado e as alterações serão refletidas em seu projeto. Com este método o pnpm não instalará as dependências do pacote vinculado, você terá que instalá-las manualmente no código-fonte. This may be useful when you have to use a specific package manager for the linked package, for example, if you want to use `npm` for the linked package, but pnpm for your project.

Quando você usa o protocolo `file:` em `dependencies`, o pacote é vinculado fisicamente ao seu projeto `node_modules`, você pode modificar o código-fonte do pacote vinculado e as alterações serão refletidas em seu projeto. Com este método o pnpm também instalará as dependências do projeto vinculado, substituindo o `node_modules` do pacote vinculado.

:::info

When dealing with **peer dependencies** it is recommended to use the `file:` protocol. It better resolves the peer dependencies from the project dependencies, ensuring that the linked dependency correctly uses the versions of the dependencies specified in your main project, leading to more consistent and expected behaviors.

:::

| Recurso                                      | `pnpm link`                               | `file:` Protocol                                     |
| -------------------------------------------- | ----------------------------------------- | ---------------------------------------------------- |
| Symlink/Hard-link                            | Symlink                                   | Hard-link                                            |
| Reflects source code modifications           | Yes                                       | Yes                                                  |
| Installs dependencies of the linked package  | No (manual installation required)         | Yes (overrides `node_modules` of the linked package) |
| Use different package manager for dependency | Possible (e.g., use `npm` for linked pkg) | No, it will use pnpm                                 |
