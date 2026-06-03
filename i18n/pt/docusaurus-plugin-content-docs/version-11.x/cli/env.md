---
id: env
title: "pnpm env <cmd>"
---

:::warning Deprecated

`pnpm env` is deprecated. Use [`pnpm runtime`](./runtime.md) instead. For example, `pnpm env use --global lts` becomes `pnpm runtime set node lts -g`.

:::

Gerencia o ambiente Node.js.

:::danger

`pnpm env` does not include the binaries for Corepack. If you want to use Corepack to install other package managers, you need to install it separately (e.g. `pnpm add -g corepack`).

:::

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/84-MzN_0Cng" title="The pnpm patch command demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"></iframe>

## Comandos

### use

Instala e usa a versão especificada do Node.js

Instala a versão LTS do Node.js:

```
pnpm env use --global lts
```

Instala o Node.js v16:

```
pnpm env use --global 16
```

Instala uma versão de pré-lançamento do Node.js:

```
pnpm env use --global nightly
pnpm env use --global rc
pnpm env use --global 16.0.0-rc.0
pnpm env use --global rc/14
```

Instala a versão mais recente do Node.js:

```
pnpm env use --global latest
```

Install an LTS version of Node.js using its [codename]:

```
pnpm env use --global argon
```

[codename]: https://github.com/nodejs/Release/blob/main/CODENAMES.md

### add

Installs the specified version(s) of Node.js without activating them as the current version.

Exemplo:

```
pnpm env add --global lts 18 20.0.1
```

### remove, rm

Removes the specified version(s) of Node.js.

Exemplos de uso:

```
pnpm env remove --global 14.0.0
pnpm env remove --global 14.0.0 16.2.3
```

### list, ls

List Node.js versions available locally or remotely.

Print locally installed versions:

```
pnpm env list
```

Print remotely available Node.js versions:

```
pnpm env list --remote
```

Print remotely available Node.js v16 versions:

```
pnpm env list --remote 16
```

## Opções

### --global, -g

The changes are made systemwide.

