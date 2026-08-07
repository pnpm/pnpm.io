---
id: start
title: pnpm start
---

Aliases: `run start`

Runs an arbitrary command specified in the package's `start` property of its
`scripts` object. If no `start` property is specified on the `scripts` object,
it will attempt to run `node server.js` as a default, failing if neither are
present.

此屬性的預期用法，是用來指定啟動程式的命令。
