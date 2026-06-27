---
id: start
title: pnpm start
---

别名: `run start`

运行软件包 `scripts` 对象中 `start` 属性指定的任意命令。 如果 `scripts` 对象没有指定 `start` 属性，那么默认将尝试执行 `node server.js`，如果都不存在则会执行失败。

该属性的预期用途是指定一个启动你程序的命令。
