---
title: Pnpm 的 Node-Modules 設定選項
authors: zkochan
---

有很多方法可以創建 node_modules 目錄。 目標一定是創建最嚴格的 node_modules，但如果那不可能的話，也有選項讓您可以產生一個鬆散的 node_modules。

<!--truncate-->

## 預設設定

預設情況下， pnpm 第五版會創建一個半嚴格的 node_modules 資料夾。 「半嚴格」意思是您的應用程式只能匯入新增至 `package.json` 的依賴套件（當然也有一些例外）。 不過這樣的話，您的依賴套件將能存取任何套件。

預設的設定看起來像這樣：

```ini
;將所有模組都提升至 node_modules/.pnpm/node_modules
hoist-pattern[]=*

;將所有型別宣告提升至根目錄以讓 TypeScript 能找到
public-hoist-pattern[]=*types*

;將所有與ESLint相關的模組提升至根目錄
public-hoist-pattern[]=*eslint*
```

## Plug'n'Play－ 最嚴格的設定

pnpm 從 5.9 版開始支援 [Yarn 的 Plug'n'Play](https://yarnpkg.com/features/pnp) 。 當使用 PnP 時，您的應用程式和其依賴套件將只能存取它們宣告的依賴套件。 這比設定 `hoist=false` 還要嚴格，因為在 Monorepo 中，您的應用程式甚至無法存取根專案的依賴套件。

如果要使用 Plug'n'Play，請使用以下設定：

```ini
node-linker=pnp
symlink=false
```

## 一個嚴格，傳統的模組目錄

如果您還沒有準備好要使用 PnP，您仍然可以透過將以下設定設定為 false 來允許模組只能存取自己的依賴模組，以保障其嚴格性：

```ini
hoist=false
```

不過，如果您的一些依賴模組嘗試存取沒有依賴套件的模組，您有兩個選擇：

1. 創建一個 `pnpmfile.js` 檔案並且使用[鉤子](/pnpmfile)將遺失的依賴套件新增至依賴套件名單。

2. 將一組表達式填入 `hoist-pattern` 設定。 例如，如果是 `babel-core` 模組找不到，請將以下設定加入 `.npmrc`：

    ```ini
    hoist-pattern[]=babel-core
    ```

## 最不好的情況－提升所有東西至根目錄

一些工具可能即使使用 pnpm 預設設定也沒辦法正常執行，因為pnpm預設設定會將所有東西提升至根目錄並將一些模組提升至根目錄。 這種情況下，您可以選擇將所有東西或者部分依賴套件提升至根目錄：

將所有項目提升到 node_modules 的根目錄:

```ini
shamefully-hoist=true
```

僅提升符合以下表達式的模組：

```ini
public-hoist-pattern[]=babel-*
```
