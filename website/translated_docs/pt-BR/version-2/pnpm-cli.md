---
id: versão-2-pnpm-cli
title: pnpm CLI
original_id: pnpm-cli
---

Basta usar o pnpm no lugar do npm:

```sh
pnpm install lodash
```

Comandos npm que são reimplementados no pnpm:

* [install](pnpm-install.md)
* `update`
* `uninstall`
* `link`
* `prune`
* `list`
* `install-test`
* `outdated`
* `rebuild`
* `root`
* `help`

Além disso, existem alguns comandos exclusivos para o pnpm:

* [recursive](pnpm-recursive.md)
* [store](pnpm-store.md)
* [server](pnpm-server.md)
* [import](pnpm-import.md)

Os demais comandos passam para o npm.

Para usar a API programática, use o mecanismo do pnpm: [supi](https://github.com/pnpm/supi).