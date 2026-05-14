---
id: pnpm-vs-npm
title: pnpm vs npm
---

## npm 的平鋪資料夾結構

從 npm v3 開始，npm 使用[平鋪的依賴結構][]。 這可以減少硬碟空間的占用， 但卻導致 `node_modules` 資料夾的混亂。

另一方面，pnpm 通過使用硬連接和符號連接到全局硬碟內容可尋址存儲來管理 `node_modules`。 This lets you get the benefits of far less disk space usage, while also keeping your `node_modules` clean. 如果你希望了解更多資訊，可以參考[儲存結構][]。

pnpm 正確的 `node_modules` 結構的好處在於，它"[有助於避免愚蠢的錯誤][]"，因為它讓你無法使用沒有在 `package.json` 中指定的套件。

## 安裝

pnpm 不允許安裝 `package.json` 中沒有包含的套件。 如果沒有傳遞參數給 `pnpm add`，套件將保存為常規依賴項。 與 npm 一樣， `--save-dev` 和 `--save-optional` 可以是用於安裝套件作為開發或可選的依賴。

由於此限制，專案在使用 pnpm 時不會有任何無關的套件，除非它們刪除依賴項並將其保留為孤立的。 這就是為什麼 pnpm 的實現的 [prune command][] 不允許你指定包來修剪 - 因為它總會去除所有多餘的包和孤兒包。

## 資料夾依賴

資料夾依賴以 `file:` 前綴開始，指向文件系統的資料夾。 與 npm 一樣，pnpm 符號連接這些依賴項。 與 npm 不同的是，pnpm 不會執行這些文件依賴項的安裝。

這意味著如果您有一個名為 `foo` (`<root>/foo`) 的套件，它有 `bar@file:../bar` 作為依賴項，則當你在 `foo` 上執行 `pnpm install` 時， pnpm 將不會為 `<root>/bar` 安裝。

如果您需要同時在多個套件中運行安裝，例如在 monorepo 的情況下，您應該查看 [`pnpm -r`][] 的說明。

[平鋪的依賴結構]: https://github.com/npm/npm/issues/6912
[儲存結構]: symlinked-node-modules-structure
[有助於避免愚蠢的錯誤]: https://www.kochan.io/nodejs/pnpms-strictness-helps-to-avoid-silly-bugs.html

[prune command]: cli/prune

[`pnpm -r`]: cli/recursive
