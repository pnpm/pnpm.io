---
title: pnpm 的 2021 年
authors: zkochan
tags:
  - recap
---

现在是年底，对 pnpm 来说是个好年头，所以让我们看看它的进展情况。

<!--truncate-->

## 使用量

### 下载统计

我今年的目标是在下载量上击败 Bower。 我们在[11月](https://npm-stat.com/charts.html?package=pnpm&package=bower&from=2021-01-01&to=2021-12-29)实现了这个目标：

![](/img/blog/pnpm-vs-bower-stats.png)

2021 年 pnpm 的下载量约为 2020 年的[3倍 ](https://npm-stat.com/charts.html?package=pnpm&from=2016-12-01&to=2021-12-29)：

![](/img/blog/download-stats-2021.png)

:::note

这些统计数据甚至没有衡量 pnpm 可能被安装的所有不同的方式！ 他们只测量了 [pnpm npm package](https://www.npmjs.com/package/pnpm) 的下载量。 今年我们还添加了 pnpm 的二进制编译版本，它们的交付的方式是不同的。

:::

### 文档访问

我们使用 Google Analytics 从我们的文档中收集了一些非个性化的统计数据。 在 2021 年，有时我们每周有超过 2,000 名独立访客。

![](/img/blog/ga-unique-visits-2021.png)

我们的大部分用户来自美国和中国。

![](/img/blog/countries-2021.png)

### GitHub stars

我们的 [主 GitHub 仓库](https://github.com/pnpm/pnpm) 今年获得了 +5,000 颗星。

![](/img/blog/stars-2021.png)

### 新用户

我们今年最大的新用户是 [字节跳动](https://github.com/pnpm/pnpm.io/pull/89) (TikTok 背后的公司)。

此外，许多优秀的开源项目开始使用 pnpm。 有些人转而使用 pnpm 是因为它对 monorepos 的大力支持：

* [Vue](https://github.com/vuejs/vue-next)
* [Vite](https://github.com/vitejs/vite)
* 和 [其他](https://pnpm.io/workspaces#usage-examples)

有些人之所以切换为 pnpm，是因为他们喜欢 pnpm 的高效、快速和美观：

* [Autoprefixer](https://twitter.com/Autoprefixer/status/1476226146488692736)
* [PostCSS](https://twitter.com/PostCSS/status/1470438664006258701)
* [Browserslist](https://twitter.com/Browserslist/status/1468264308308156419)

## 功能亮点

### 新的锁文件格式（自 [v6.0.0](https://github.com/pnpm/pnpm/releases/tag/v6.0.0)）

今年第一个也是最重要的变化之一是新的 `pnpm-lock.yaml` 格式。 这是一个突破性的变化，所以我们不得不发布 v6。 但它是成功的。 旧的锁文件经常导致 Git 冲突。 由于引入了新格式，我们没有收到任何关于 Git 冲突的投诉。

### 管理 Node.js 版本（自 [v6.12.0](https://github.com/pnpm/pnpm/releases/tag/v6.12.0)）

我们发布了一个允许管理 Node.js 版本的新命令（ `pnpm env` ）。 因此，您可以使用 pnpm 而不是像 nvm 或 Volta 这样的 Node.js 版本管理器。

此外，pnpm 是作为独立的可执行文件提供的，因此即使系统上没有预装 Node.js，您也可以运行它。

### 注入本地依赖（自 [v6.20.0](https://github.com/pnpm/pnpm/releases/tag/v6.20.0)）

您可以 “inject” 本地依赖项。 默认情况下，本地依赖项被符号链接至 `node_modules`。但有了这个新功能，你可以指示 pnpm 硬链接包内的文件。

### 改进了 peerDependency 问题的报告（自 [v6.24.0](https://github.com/pnpm/pnpm/releases/tag/v6.24.0)）

PeerDependency 问题曾经被打印为纯文本，很难理解。 它们现在都分组并打印在一个很好的层次结构中。

## 竞争

### Yarn

Yarn 在 [v3.1](https://dev.to/arcanis/yarn-31-corepack-esm-pnpm-optional-packages--3hak#new-install-mode-raw-pnpm-endraw-) 添加了 pnpm 链接器。 因此 Yarn 可以创建一个类似于 pnpm 创建的 node_modules 目录结构。

此外，Yarn 团队计划实现内容可寻址存储，以提高磁盘空间效率。

### npm

Npm 团队决定也采用 pnpm 使用的符号链接的 node_modules 目录结构（相关 [RFC](https://github.com/npm/rfcs/blob/main/accepted/0042-isolated-mode.md)）。

### Others

用 Zig 编写的 [Bun](https://twitter.com/jarredsumner/status/1473416431291174912/photo/1) 以及 [Volt](https://github.com/voltpkg/volt) 都声称比 npm/Yarn/pnpm 更快。 我还没有对这些新的包管理器进行基准测试。

## 未来的计划

更快，更好，最好。
