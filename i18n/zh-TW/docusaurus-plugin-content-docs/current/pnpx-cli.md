---
id: pnpx-cli
title: pnpx CLI
---

:::warning

此命令已被棄置！ 請改用 [`pnpm exec`][] 和 [`pnpm dlx`][] 命令。

:::

## 對於新使用者

`pnpx` (PNPm eXecute) 是一個命令列工具，它可以從套件庫抓取套件且不將它視為依賴套件安裝，並在抓取完成後直接載入和執行該套件包含的預設二進位檔案。

例如：如果您想在任何地方使用 `create-react-app` 初始化一個 react 專案，您不需要安裝它，直接執行以下命令即可：

```sh
pnpx create-react-app my-project
```

這會從套件庫抓取 `create-react-app` 並且使用您給予的參數執行該命令。 若想了解更多資訊，您可以在 npm 上查看 [npx][] 的資訊，因為除了它背後使用的是 `npm` 而非 `pnpm` 外，它提供了相同介面。

如果您只是想執行專案中已安裝的依賴套件模組中的二進位檔案，請參考 [`pnpm exec`][]。

## 對於 npm 使用者

npm 有一個很不錯的套件執行命令叫 [npx][]。 pnpm 透過 `pnpx` 命令提供了相同的功能。 唯一差別就只有 `pnpx` 會使用 `pnpm` 安裝套件而已。

[npx]: https://www.npmjs.com/package/npx
[`pnpm exec`]: ./cli/exec.md
[`pnpm dlx`]: ./cli/dlx.md
