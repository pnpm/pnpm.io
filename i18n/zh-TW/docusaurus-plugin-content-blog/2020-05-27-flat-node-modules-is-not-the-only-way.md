---
title: 平面化 node_module 不會是唯一的方法
authors: zkochan
---

新使用者經常問我關於 pnpm 生成出來的奇怪 `node_modules` 資料夾結構。 為什麼它不是扁平化的？ 而且全部的子依賴套件跑去哪了？

<!--truncate-->

> 在此會假設此文讀者已經熟悉了 npm 和 Yarn 創建出來的扁平化 `node_modules` 資料夾。 如果您不了解為什麼 npm 要在第三版開始使用扁平化 `node_modules`，您可以在[為什麼我們應該使用pnpm](https://www.kochan.io/nodejs/why-should-we-use-pnpm.html)文章中找到一些背景

所以為什麼 pnpm 的 `node_modules` 如此特殊？ 讓我們先創建兩個資料夾，然後在其中一個資料夾執行 `npm add express`，另一個資料夾執行 `pnpm add express` 以下是您能在第一個資料夾中的 `node_modules` 內能看到的資料夾：

```text
.bin
accepts
array-flatten
body-parser
bytes
content-disposition
cookie-signature
cookie
debug
depd
destroy
ee-first
encodeurl
escape-html
etag
express
```

您可以在[這裡](https://github.com/zkochan/comparing-node-modules/tree/master/npm-example/node_modules)看到整個資料夾結構

以及，這是您能在 pnpm 創建的 `node_modules` 資料夾中看到的：

```text
.pnpm
.modules.yaml
express
```

您可以在[這裡](https://github.com/zkochan/comparing-node-modules/tree/master/pnpm5-example/node_modules)查看

所以全部的依賴套件跑去哪了？ `node_modules` 裡面只有一個名為 `.pnpm` 的資料夾還有一個名為 `express` 的軟連結。 嗯，因為我們只有安裝 `express`，所以只有那個套件是您的程式可以存取的。

> 您可以[在此](https://medium.com/pnpm/pnpms-strictness-helps-to-avoid-silly-bugs-9a15fb306308)了解更多關於為什麼pnpm的嚴格性是好的東西

讓我們看看 `express`資料夾內有什麼：

```text
▾ node_modules
  ▸ .pnpm
  ▾ express
    ▸ lib
      History.md
      index.js
      LICENSE
      package.json
      Readme.md
  .modules.yaml
```

`express` 中沒有 `node_modules` 資料夾？ 那 `express` 的全部依賴套件跑去哪了？

秘訣就是 `express` 只是一個軟連結。 當 Node.js 解析依賴套件時，因為 Node.js 會使用它們的真實位置，所以 Node.js 不會保留軟連結。 或許你會想問： `express` 的真實位置在哪裡？

答案是在這裡：[node_modules/.pnpm/express@4.17.1/node_modules/express](https://github.com/zkochan/comparing-node-modules/tree/master/pnpm5-example/node_modules/.pnpm/express@4.17.1/node_modules/express)。

好的，所以我們現在瞭解了 `.pnpm/` 資料夾的作用。 `.pnpm/` 是以扁平化的方式儲存所有模組，所以所有模組可以在以下這個路徑找到：

```text
.pnpm/<模組名稱>@<模組版本>/node_modules/<模組名稱>
```

我們稱它為虛擬的儲存資料夾

不像 npm 第 3、4、5、6 版或Yarn的第 1 版的扁平化 `node_modules`，這個扁平化結構除了可以避免巢狀 `node_modules` 帶來的長路徑問題，也能使模組保持獨立。

現在，讓我們來看一下 `express` 真正的位置：

```text
  ▾ express
    ▸ lib
      History.md
      index.js
      LICENSE
      package.json
      Readme.md
```

這是在騙人嗎？ 還是沒有 `node_modules` 資料夾呀！ 第二個 pnpm 的 `node_modules` 資料夾結構秘訣就是，模組的依賴套件會和依賴套件實際位置在同一層資料夾。 所以 `express` 的依賴套件位置不是在 `.pnpm/express@4.17.1/node_modules/express/node_modules/`，而是在 [.pnpm/express@4.17.1/node_modules/](https://github.com/zkochan/comparing-node-modules/tree/master/pnpm5-example/node_modules/.pnpm/express@4.17.1/node_modules)：

```text
▾ node_modules
  ▾ .pnpm
    ▸ accepts@1.3.5
    ▸ array-flatten@1.1.1
    ...
    ▾ express@4.16.3
      ▾ node_modules
        ▸ accepts
        ▸ array-flatten
        ▸ body-parser
        ▸ content-disposition
        ...
        ▸ etag
        ▾ express
          ▸ lib
            History.md
            index.js
            LICENSE
            package.json
            Readme.md
```

`express` 的全部依賴套件都會軟連結至 `node_modules/.pnpm/` 內對應的資料夾。 將 `express` 的依賴模組放在同一層資料夾可以避免軟連結循環。

所以如您所見，雖然一開始似乎會覺得 pnpm 的 `node_modules` 結構很特殊：

1. 但他和 Node.js 完全相容
2. 並且模組和其依賴套件可以被很好的分類

對於有對等依賴套件的模組，結構會稍微[更複雜一點](/how-peers-are-resolved)，但概念還是一樣的：使用軟連結和扁平化資料夾結構創建巢狀結構
