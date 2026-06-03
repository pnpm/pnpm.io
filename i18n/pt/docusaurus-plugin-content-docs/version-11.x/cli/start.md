---
id: start
title: pnpm start
---

Aliases: `run start`

Runs an arbitrary command specified in the package's `start` property of its
`scripts` object. If no `start` property is specified on the `scripts` object,
it will attempt to run `node server.js` as a default, failing if neither are
present.

O propósito da propriedade é especificar um comando que inicia seu programa.
