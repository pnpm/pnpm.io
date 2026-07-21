---
id: start
title: pnpm start
---

命令別名：`run start`

執行套件中 `scripts` 物件的 `start` 屬性指定的命令。 如果 `scripts` 物件沒有 `start` 屬性，此命令預設會執行 `node server.js`。兩者都不存在時，則執行失敗。

此屬性的預期用法，是用來指定啟動程式的命令。
