---
title: pnpm 的 2022 年
authors: zkochan
image: "/img/blog/2022-review.png"
tags:
  - recap
---

又是一年年底。 真是艰难的一年。 你们应该知道，我住在乌克兰，由于俄罗斯对我们发动战争，指挥这个项目比往年都难。 尽管如此，今年对pnpm来说是很好的一年。 我们有了很多新用户、贡献者，并且我们实现了许多很棒的功能。

![](/img/blog/2022-review.png)

（上图由 Midjourney 生成。 这只老虎象征虎年）

<!--truncate-->

## 使用方法

### 下载统计

我今年的目标是在下载量上击败 Lerna。 我们在8月实现了 [这个目标](https://npm-stat.com/charts.html?package=pnpm&package=lerna&from=2022-01-01&to=2022-12-30):

![](/img/blog/pnpm-vs-lerna-stats.png)

2022 年 pnpm 的下载量比 2021 年多 [5 倍](https://npm-stat.com/charts.html?package=pnpm&from=2016-12-01&to=2022-12-30)：

![](/img/blog/download-stats-2022.png)

### 文档访问

我们使用 Google Analytics 从我们的文档中收集了一些非个性化的统计数据。 在 2022 年，有时我们一周就有超过 20,000 名不同的访客。 这比2021年高10倍！

![](/img/blog/ga-unique-visits-2022.png)

### GitHub stars

我们的 [主 GitHub 仓库](https://github.com/pnpm/pnpm) 今年获得了 +7,000 颗星。

![](/img/blog/stars-2022.png)

### 贡献者

今年我们有很多新的和活跃的贡献者。 这些人在 2022 年合并了至少一个 PR：

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

## 功能亮点

### 支持无符号链接的 hoisted 的`node_modules`(从[v6.25.0](https://github.com/pnpm/pnpm/releases/tag/v6.25.0)开始)

就在 2022 年初，我们增加了对“传统" hoisted 的支持(又称扁平化的 `node_modules`)。 我们使用 Yarn 的 hoist 算法来创建一个正确的 hoisted `node_modules`。 这个新设置基本上使 pnpm 可以兼容所有与 npm CLI 兼容的 Node.js 技术栈。

要使用 hoisted 的 `node_modules` 目录结构，请在 `.npmrc` 文件中使用 `node-linker=hoisted` 设置。

### 副作用缓存Side effects cache (从[v7.0.0](https://github.com/pnpm/pnpm/releases/tag/v7.0.0)开始)

自 v7 以来，默认情况下启用了 [副作用缓存side-effect-cache][] ，因此需要构建的依赖只会被构建一次。 这大大提高了依赖中含有构建脚本的项目的安装速度。

### 依赖补丁Dependencies patching(从[v7.4.0](https://github.com/pnpm/pnpm/releases/tag/v7.4.0)开始)

添加了 [`pnpm patch`][] 命令，用于修补 `node_modules`中的依赖项。

### 基于时间的依赖解析策略Time-based resolution strategy(从 [v7.10.0](https://github.com/pnpm/pnpm/releases/tag/v7.10.0)开始)

pnpm 添加了一种新的解析模式，会使更新依赖项更加安全。 您可以使用 [resolution-mode][] 设置，更改解析模式。

### 列举依赖中的许可证 Listing licenses of dependencies(从 [v7.17.0](https://github.com/pnpm/pnpm/releases/tag/v7.17.0)开始)

你可以使用 [`pnpm licenses list`][] 命令来检查已安装软件包的许可证。

[副作用缓存side-effect-cache]: /npmrc#side-effects-cache

[`pnpm patch`]: /cli/patch

[resolution-mode]: https://pnpm.io/npmrc#resolution-mode

[`pnpm licenses list`]: /cli/licenses

