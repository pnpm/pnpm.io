---
id: limitations
title: 局限性
---

1. `npm-shrinkwrap.json` 和 `package-lock.json` 被忽略。 与 pnpm 不同，npm 可以多次安装相同的 `name@version` ，并且具有不同的依赖项组合。 npm 的锁文件旨在反映平铺的 `node_modules` 布局，但是，由于 pnpm 默认创建隔离布局，它无法由 npm 的锁文件格式反映出来。 如果你希望将锁定文件转换为 pnpm 的格式，请看 [pnpm import][]。
1. Binstubs（在 `node_modules/.bin` 中的文件）总是 shell 文件，而不是指向 JS 文件的符号链接。 创建 shell 文件是为了帮助支持插件的 CLI 的程序在特殊的 `node_modules` 结构中能够正确地找到它们的插件。 这是很少有的问题，如果你希望文件是 JS 文件，应直接引用原始文件，如 [#736][] 所示。

有关于上述问题的解决方法的想法吗？ [分享它们。](https://github.com/pnpm/pnpm/issues/new)

[pnpm import]: cli/import.md
[#736]: https://github.com/pnpm/pnpm/issues/736
