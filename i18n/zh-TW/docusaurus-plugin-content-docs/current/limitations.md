---
id: limitations
title: Limitations
---

1. `npm-shrinkwrap.json` 與 `package-lock.json` 被忽略。 與 pnpm 不同，npm 可以安裝相同的 `name@version` 並且擁有不同的依賴套件組合。 npm 的 lockfile 被設計於反應扁平化 `node_modules` 的布局，然而，當 pnpm 建立時預設使用隔離布局，因此無法遵循 npm 的 lockfile 格式。 layout, however, as pnpm creates an isolated layout by default, it cannot respect npm's lockfile format. 若您希望將 lockfile 轉換為 pnpm 格式，請參考 [pnpm import][]。
1. Binstubs (在 `node_modules/.bin` 中的檔案) 皆為 shell 檔案，並不是 JS 檔案的符號鏈結。 Shell 檔案被創建來協助可插拔的 CLI 應用程式，在非常規的 `node_modules` 結構中搜尋它的外掛程式。 這是不是常見的問題，若您希望該檔案是 JS 檔案格式，請直接引用 [#736][] 中所描述的原始檔案。

有關於上方這些問題的解決方案嗎？ [分享它們吧！](https://github.com/pnpm/pnpm/issues/new)

[pnpm import]: cli/import.md
[#736]: https://github.com/pnpm/pnpm/issues/736
