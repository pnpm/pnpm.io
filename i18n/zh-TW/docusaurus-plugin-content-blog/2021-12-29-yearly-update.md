---
title: 2021 年的 pnpm
authors: zkochan
tags:
  - recap
---

對pnpm來說好的一年已經到了尾聲，讓我來看一下我們的進展。

<!--truncate-->

## 使用統計

### 下載統計

今年我的目標是在下載統計數據上打敗 Bower。 我們[在十一月時](https://npm-stat.com/charts.html?package=pnpm&package=bower&from=2021-01-01&to=2021-12-29)已經完成了

![](/img/blog/pnpm-vs-bower-stats.png)

在 2021 年時，pnpm下載量大約比 2020 時[多 3 次以上](https://npm-stat.com/charts.html?package=pnpm&from=2016-12-01&to=2021-12-29)：

![](/img/blog/download-stats-2021.png)

:::note

這些數據沒有測量到 pnpm 所有不同的安裝方式！ 那些數據是只有測量透過 [pnpm npm package](https://www.npmjs.com/package/pnpm) 下載的數據。 在今年，我們也有新增已編譯成二進位版的 pnpm，其發送方式與其他版本不同

:::

### 訪問Docs統計

我們從 Google 分析收集了一些訪問 docs 的客觀的數據。 在 2021 年，我們有時每週會有多於2000個獨一無二的閱讀者。

![](/img/blog/ga-unique-visits-2021.png)

大多數的使用者皆來自美國和中國

![](/img/blog/countries-2021.png)

### GitHub上的星星統計

我們的[主要 GitHub 數據庫](https://github.com/pnpm/pnpm)今年收到 5000 多個星星。

![](/img/blog/stars-2021.png)

### 新使用者統計

今年我們最大的新用戶是 [Bytedance](https://github.com/pnpm/pnpm.io/pull/89) （抖音背後的公司）。

並且，很多不錯的開源專案開始使用 pnpm了。 一些專案因為 monorepos 的良好支援所以切換至 pnpm：

* [Vue](https://github.com/vuejs/vue-next)
* [Vite](https://github.com/vitejs/vite)
* 還有[其他](https://pnpm.io/workspaces#usage-examples)......

或者一些專案因為他們喜歡 pnpm 如此地高效、快速、與美觀：

* [Autoprefixer](https://twitter.com/Autoprefixer/status/1476226146488692736)
* [PostCSS](https://twitter.com/PostCSS/status/1470438664006258701)
* [Browserslist](https://twitter.com/Browserslist/status/1468264308308156419)

## 特色功能

### 新的 lockfile 格式 (於 [v6.0.0](https://github.com/pnpm/pnpm/releases/tag/v6.0.0) 新增)

在今年的重要更新中，最重要且第一個更新就是新的 `pnpm-lock.yaml` 格式。 這是一個突破性更新，所以我們需要以第 6 版釋出。 但那是個成功。 舊的 lockfile 常常造成 Git 衝突。 自從新的格式推出後，我們沒有再接收到與 Git 衝突相關的抱怨。

### 管理 Node.js 版本 (於 [v6.12.0](https://github.com/pnpm/pnpm/releases/tag/v6.12.0) 新增)

我們推出了新命令 `pnpm env`，該命令能讓您管理 Node.js 版本。 所以您可以使用 pnpm 來取代像 nvm、Volta 等 Node.js 版本管理器

並且，pnpm可以獨立下載與運行，所以即使您沒有預先安裝 Node.js，您還是可以運行 pnpm。

### 注入本地依賴套件 （於 [v6.20.0](https://github.com/pnpm/pnpm/releases/tag/v6.20.0) 新增）

您可以「注入」一個本地依賴套件。 預設情況下，本地依賴套件會軟連結至 `node_modules`，但有了這新功能，您可以使 pnpm 硬連結模組文件。

### 改善 peer dependency 問題回報 （於 [v6.24.0](https://github.com/pnpm/pnpm/releases/tag/v6.24.0) 改善）

Peer dependency 問題報告以前是僅印出純文字而且很難理解的。 現在它們已經全部被分類，並且輸出能以很好的層次結構表進行呈現

## 競爭

### Yarn

Yarn 在[版本 3.1](https://dev.to/arcanis/yarn-31-corepack-esm-pnpm-optional-packages--3hak#new-install-mode-raw-pnpm-endraw-) 中新增了 pnpm 連結器。 所以 Yarn 現在也可以創造出與 pnpm 相似的資料夾結構。

而且，Yarn 開發團隊計畫要實作一個內容可定址的儲存區以達到高效利用磁碟空間

### npm

Npm 開發團隊也決定採取 pnpm使用的軟連結 node_modules 資料夾結構（相關的 [RFC](https://github.com/npm/rfcs/blob/main/accepted/0042-isolated-mode.md)）

### 其他

使用Zig、[Volt](https://github.com/voltpkg/volt) 和 Rust 寫出來的 [Bun](https://twitter.com/jarredsumner/status/1473416431291174912/photo/1) 宣稱它比 npm、Yarn、pnpm 都還要快。 但是我還沒對這些模組管理器進行跑分。

## 未來展望

更快、更好
