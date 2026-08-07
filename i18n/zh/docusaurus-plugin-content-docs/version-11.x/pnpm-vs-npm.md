---
id: pnpm-vs-npm
title: pnpm vs npm
---

## npm 的平铺目录结构

npm 从第 3 版开始维护 [扁平化依赖关系树][flattened dependency tree]。 这可以减少磁盘空间占用， 但却导致 `node_modules` 目录的混乱。

另一方面，pnpm 通过使用硬链接和符号链接到全局磁盘内容可寻址存储来管理 `node_modules`。 这将给你带来减少磁盘空间使用的好处，同时也能保持你的 `node_modules` 整洁。 如果你希望了解更多信息，可以参考 [存储布局][store layout]。

pnpm 正确的 `node_modules` 结构的好处在于，它"
[有助于避免愚蠢的错误][helps to avoid silly bugs]"，因为它让你无法使用不是 `package.json` 中指定的模块。

[flattened dependency tree]: https://github.com/npm/npm/issues/6912
[store layout]: symlinked-node-modules-structure
[helps to avoid silly bugs]: https://www.kochan.io/nodejs/pnpms-strictness-helps-to-avoid-silly-bugs.html

## 安装

pnpm 不允许安装 `package.json` 中没有包含的包。 如果没有参数传递给 `pnpm add`，包将保存为常规依赖项。 与 npm 一样， `--save-dev` 和 `--save-optional` 可以是用于安装包作为开发或可选的依赖。

由于此限制，项目在使用 pnpm 时不会有任何无关的包，除非它们删除依赖项并将其保留为孤立的。 这就是为什么 pnpm 的实现的 [prune command] 不允许你指定包来修剪 - 它总是去除所有多余的和孤儿包。

[prune command]: cli/prune

## 目录依赖

目录依赖以 `file:` 前缀开始，指向文件系统的目录。 与 npm 一样，pnpm 符号链接这些依赖项。 与 npm 不同的是，pnpm 不执行这些文件依赖项的安装。

这意味着如果你有一个名为 `foo` (`<root>/foo`) 的包，它有
`bar@file:../bar` 作为依赖项，则当你在 `foo` 上执行 `pnpm install` 时， `pnpm` 将不会为 `<root>/bar` 安装。

如果你需要同时在多个包中运行安装，例如在 monorepo 的情况下，你应该查看 [`pnpm -r`] 的文档。

[`pnpm -r`]: cli/recursive
