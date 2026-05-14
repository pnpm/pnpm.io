---
id: aliases
title: 別名（Aliases）
---

別名讓您可以使用自定義名稱安裝軟件包。

假設你在項目中大量地使用了 `lodash`， 若有一個 bug 在 `lodash` 破換了您的專案。 當您修復了這個問題，但 `lodash` 並不會合併它。 通常您會直接透過您複製的專案中安裝 `lodash` (當作 git 託管的依賴套件)，或是以不同名稱重新發布套件。 如果您使用第二種方法，您必須為您所有有使用的專案中替換新的依賴套件名稱 (`require('lodash')` => `require('awesome-lodash')`)。 透過別名，您將有第三種選擇方式。

發布一個名為 `awesome-lodash` 的新套件，並且使用 `lodash` 作為別名來安裝它：

```
pnpm add lodash@npm:awesome-lodash
```

不需要更改程式碼。 所有的 `lodash` 引用將被解析為 `awesome-lodash`。

有時候您會想要在專案中使用兩個不同版本的套件。 這很簡單：

```sh
pnpm add lodash1@npm:lodash@1
pnpm add lodash2@npm:lodash@2
```

現在，您可以透過 `require('lodash1')` 引用第一個版本，且透過 `require('lodash2')` 引用第二個。

當與 hooks 結合使用時功能將會更強大。 或許您會想要將 `node_modules` 中使用的 `awesome-lodash` 替換為 `lodash`。 您可以很簡單地透過下方 `.pnpmfile.mjs` 的方式來完成它：

```js
function readPackage(pkg) {
  if (pkg.dependencies && pkg.dependencies.lodash) {
    pkg.dependencies.lodash = 'npm:awesome-lodash@^1.0.0'
  }
  return pkg
}

export const hooks = {
  readPackage
}
```
