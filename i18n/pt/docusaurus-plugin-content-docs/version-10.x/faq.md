---
id: faq
title: Perguntas frequentes
---

## Why does my `node_modules` folder use disk space if packages are stored in a global store?

pnpm creates [hard links] from the global store to the project's `node_modules`
folders. Hard links apontam para o mesmo espaço no disco onde os arquivos originais estão. So, for example, if you have `foo` in your project as a dependency
and it occupies 1MB of space, then it will look like it occupies 1MB of space in
the project's `node_modules` folder and the same amount of space in the global
store. However, that 1MB is _the same space_ on the disk addressed from two
different locations. So in total `foo` occupies 1MB, not 2MB.

[hard links]: https://en.wikipedia.org/wiki/Hard_link

Para mais sobre este assunto:

- [Why do hard links seem to take the same space as the originals?](https://unix.stackexchange.com/questions/88423/why-do-hard-links-seem-to-take-the-same-space-as-the-originals)
- [A thread from the pnpm chat room](https://gist.github.com/zkochan/106cfef49f8476b753a9cbbf9c65aff1)
- [An issue in the pnpm repo](https://github.com/pnpm/pnpm/issues/794)

## Ele funciona no Windows?

Resposta curta: Sim.
Resposta longa: Usando um link simbólico no Windows é problemático pra dizer o mínimo, entretanto, pnpm tem uma solução alternativa/gambiarra. For Windows, we use [junctions] instead.

[junctions]: https://docs.microsoft.com/en-us/windows/win32/fileio/hard-links-and-junctions

## But the nested `node_modules` approach is incompatible with Windows?

Early versions of npm had issues because of nesting all `node_modules` (see
[this issue]). No entanto, pnpm não cria pastas profundas, ele armazena todos os pacotes de forma plana e utiliza links simbólicos para criar a estrutura de dependências.

[this issue]: https://github.com/nodejs/node-v0.x-archive/issues/6960

## E quanto aos links simbólicos circulares?

Although pnpm uses linking to put dependencies into `node_modules` folders,
circular symlinks are avoided because parent packages are placed into the same
`node_modules` folder in which their dependencies are. So `foo`'s dependencies
are not in `foo/node_modules`, but `foo` is in `node_modules` together with its
own dependencies.

## Por que usar hard links? Por que não criar um link simbólico direto para o armazenamento global?

Um pacote pode ter diferentes conjuntos de dependências numa mesma máquina.

In project **A** `foo@1.0.0` can have a dependency resolved to `bar@1.0.0`, but
in project **B** the same dependency of `foo` might resolve to `bar@1.1.0`; so,
pnpm hard links `foo@1.0.0` to every project where it is used, in order to
create different sets of dependencies for it.

Direct symlinking to the global store would work with Node's
`--preserve-symlinks` flag, however, that approach comes with a plethora of its
own issues, so we decided to stick with hard links. For more details about why
this decision was made, see [this issue][eps-issue].

[eps-issue]: https://github.com/nodejs/node-eps/issues/46

## O pnpm funciona em diferentes subvolumes em uma partição Btrfs?

Embora o Btrfs não permita hardlinks entre dispositivos de diferentes subvolumes em uma única partição, ele permite reflinks. Como resultado, o pnpm utiliza reflinks para compartilhar dados entre esses subvolumes.

## O pnpm funciona com diversas unidades de armazenamento ou sistemas de arquivos?

O armazenamento global de pacotes deve estar na mesma unidade de armazenamento e utilizando o mesmo sistema de arquivos da instalação. Caso contrário, os pacotes serão copiados, e não vinculados. Isso ocorre devido a uma limitação de como os hard links funcionam - um arquivo num determinado sistema de arquivos não pode ser direcionado para um endereço em outro sistema. See [Issue #712] for more details.

pnpm funciona de maneira diferente nos dois casos abaixo:

[Issue #712]: https://github.com/pnpm/pnpm/issues/712

### O caminho para o armazenamento global é especificado

If the store path is specified via [the store config](configuring.md), then copying
occurs between the store and any projects that are on a different disk.

If you run `pnpm install` on disk `A`, then the pnpm store must be on disk `A`.
If the pnpm store is located on disk `B`, then all required packages will be
directly copied to the project location instead of being linked. Isso inibe severamente os benefícios de armazenamento e desempenho do pnpm.

### O caminho para o armazenamento global NÃO é especificado

Se o caminho do armazenamento não estiver definido, vários armazenamentos serão criados (um por unidade ou
sistema de arquivos).

If installation is run on disk `A`, the store will be created on `A`
`.pnpm-store` under the filesystem root.  If later the installation is run on
disk `B`, an independent store will be created on `B` at `.pnpm-store`. Os projetos ainda manteriam os benefícios do pnpm, mas cada unidade pode ter pacotes redundantes.

## What does `pnpm` stand for?

`pnpm` stands for `performant npm`.
[@rstacruz](https://github.com/rstacruz/) came up with the name.

## `pnpm` does not work with &lt;YOUR-PROJECT-HERE>?

In most cases it means that one of the dependencies require packages not
declared in `package.json`. It is a common mistake caused by flat
`node_modules`. Se isso acontecer, é um erro na dependência e a dependência
deve ser corrigida. Isso pode levar algum tempo, então o pnpm suporta soluções alternativas para fazer os pacotes com bugs funcionarem.

### Solução 1

In case there are issues, you can use the [`nodeLinker: hoisted`] setting.
This creates a flat `node_modules` structure similar to the one created by `npm`.

[`nodeLinker: hoisted`]: settings#nodeLinker

### Solução 2

In the following example, a dependency does **not** have the `iterall` module in
its own list of deps.

The easiest solution to resolve missing dependencies of the buggy packages is to
**add `iterall` as a dependency to our project's `package.json`**.

You can do so, by installing it via `pnpm add iterall`, and will be
automatically added to your project's `package.json`.

```json
  "dependencies": {
    ...
    "iterall": "^1.2.2",
    ...
  }
```

### Solução 3

One of the solutions is to use [hooks](pnpmfile.md#hooks) for adding the missing
dependencies to the package's `package.json`.

An example was [Webpack Dashboard] which wasn't working with `pnpm`. It has
since been resolved such that it works with `pnpm` now.

Costumava gerar um erro:

```console
Error: Cannot find module 'babel-traverse'
  at /node_modules/inspectpack@2.2.3/node_modules/inspectpack/lib/actions/parse
```

The problem was that `babel-traverse` was used in `inspectpack` which
was used by `webpack-dashboard`, but `babel-traverse` wasn't specified in
`inspectpack`'s `package.json`. It still worked with `npm` and `yarn` because
they create flat `node_modules`.

The solution was to create a `.pnpmfile.cjs` with the following contents:

```js
module.exports = {
  hooks: {
    readPackage: (pkg) => {
      if (pkg.name === "inspectpack") {
        pkg.dependencies['babel-traverse'] = '^6.26.0';
      }
      return pkg;
    }
  }
};
```

After creating a `.pnpmfile.cjs`, delete `pnpm-lock.yaml` only - there is no need
to delete `node_modules`, as pnpm hooks only affect module resolution. Then,
rebuild the dependencies & it should be working.

[Webpack Dashboard]: https://github.com/pnpm/pnpm/issues/1043
