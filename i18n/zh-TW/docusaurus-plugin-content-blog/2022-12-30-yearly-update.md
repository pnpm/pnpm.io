---
title: The year 2022 for pnpm
authors: zkochan
image: "/img/blog/2022-review.png"
tags:
  - recap
---

現在是年底了, 是一個艱難的一年 如你所知道的，我生活在烏克蘭，所以由於俄羅斯對我們的發起的戰爭，比起前些年使得這個項目更難被去領導。 儘管如此，對 pnpm 來說依然是一個好年頭。 我們新增了很多新用戶、貢獻者，而且我們也實現了很多很讚的功能。

![](/img/blog/2022-review.png)

(上圖由 Midjourney 生成。 老虎象徵虎年)

<!--truncate-->

## 使用方法

### 下載統計

我今年的目標是在下載量上擊敗Lerna。 We were able to achieve this goal [in August](https://npm-stat.com/charts.html?package=pnpm&package=lerna&from=2022-01-01&to=2022-12-30):

![](/img/blog/pnpm-vs-lerna-stats.png)

2022 年 pnpm 的下載量是 比 2021 年[多5倍](https://npm-stat.com/charts.html?package=pnpm&from=2016-12-01&to=2022-12-30) ：

![](/img/blog/download-stats-2022.png)

### 訪問Docs統計

我們從 Google 分析收集了一些訪問 docs 的客觀的數據。 在 2022 年，有時我們每周有超過 2 萬名獨立的訪客。 這比 2021 年多了 10 倍！

![](/img/blog/ga-unique-visits-2022.png)

### GitHub上的星星統計

[我們的 主要 GitHub 儲存庫](https://github.com/pnpm/pnpm) 今年收獲近 +7000 顆星。

![](/img/blog/stars-2022.png)

### 我們的貢獻者

今年我們有很多新的活躍貢獻者。 這些是在 2022 年合併至少一項 PR 的人：

* [Zoltan Kochan](https://github.com/zkochan)
* [chlorine](https://github.com/lvqq)
* [await-ovo](https://github.com/await-ovo)
* [Brandon Cheng](https://github.com/gluxon)
* [Dominic Elm](https://github.com/d3lm)
* [MCMXC](https://github.com/mcmxcdev)
* [那里好脏不可以](https://github.com/dev-itsheng)
* [Homyee King](https://github.com/HomyeeKing)
* [Shinobu Hayashi](https://github.com/Shinyaigeek)
* [Black-Hole](https://github.com/BlackHole1)
* [Kenrick](https://github.com/kenrick95)
* [Weyert de Boer](https://github.com/weyert)
* [Glen Whitney](https://github.com/gwhitney)
* [Cheng](https://github.com/chengcyber)
* [zoomdong](https://github.com/fireairforce)
* [thinkhalo](https://github.com/ufec)
* [子瞻 Luci](https://github.com/LuciNyan)
* [spencer17x](https://github.com/Spencer17x)
* [liuxingbaoyu](https://github.com/liuxingbaoyu)
* [장지훈](https://github.com/WhiteKiwi)
* [Jon de la Motte](https://github.com/jondlm)
* [Jack Works](https://github.com/Jack-Works)
* [milahu](https://github.com/milahu)
* [David Collins](https://github.com/David-Collins)
* [nikoladev](https://github.com/nikoladev)
* [Igor Bezkrovnyi](https://github.com/ibezkrovnyi)
* [Lev Chelyadinov](https://github.com/illright)
* [javier-garcia-meteologica](https://github.com/javier-garcia-meteologica)

## 特色功能

### Supporting a symlinkless hoisted `node_modules` (since [v6.25.0](https://github.com/pnpm/pnpm/releases/tag/v6.25.0))

Right at the beginning of 2022, we have added support for the "traditional" hoisted (a.k.a flat `node_modules`). We use Yarn's hoisting algorithm to create a proper hoisted `node_modules`. This new setting has basically made pnpm compatible with all Node.js stack that are compatible with npm CLI.

To use the hoisted `node_modules` directory structure, use the `node-linker=hoisted` setting in an `.npmrc` file.

### Side effects cache (since [v7.0.0](https://github.com/pnpm/pnpm/releases/tag/v7.0.0))

Since v7, [side-effect-cache][] is enabled by default, so dependencies that should be built are only built once on a machine. This improves installation speed by a lot in projects that have dependencies with build scripts.

### Dependencies patching (since [v7.4.0](https://github.com/pnpm/pnpm/releases/tag/v7.4.0))

The [`pnpm patch`][] command have been added for patching dependencies in your `node_modules`.

### Time-based resolution strategy (since [v7.10.0](https://github.com/pnpm/pnpm/releases/tag/v7.10.0))

A new resolution mode was added to pnpm, which should make updating dependencies more secure. You can change the resolution mode with the [resolution-mode][] setting.

### Listing licenses of dependencies (since [v7.17.0](https://github.com/pnpm/pnpm/releases/tag/v7.17.0))

You may now use the [`pnpm licenses list`][] command to check the licenses of the installed packages.

[side-effect-cache]: /npmrc#side-effects-cache

[`pnpm patch`]: /cli/patch

[resolution-mode]: https://pnpm.io/npmrc#resolution-mode

[`pnpm licenses list`]: /cli/licenses

