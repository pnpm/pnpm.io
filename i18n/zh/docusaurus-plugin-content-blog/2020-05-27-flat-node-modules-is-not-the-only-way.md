---
title: 平铺的结构不是 node_modules 的唯一实现方式
authors: zkochan
---

Pnpm 的新用户们经常会问我关于 pnpm 创建的奇怪的 `node_modules` 结构。 为什么不是平铺的？ 次级依赖去哪了？

<!--truncate-->

> 我将默认这篇文章的读者已经熟悉了 npm 与 yarn 创建的平铺的 `node_modules`。 如果你不明白为什么 npm3 需要开始在 v3 中使用平铺的 `node_modules`，你可以在这里找到一些背景知识 [Why should we use pnpm?](https://www.kochan.io/nodejs/why-should-we-use-pnpm.html)。

那么为什么 pnpm 的 `node_modules` 会如此不同寻常呢？ 让我们创建两个目录，并在其中一个执行 `npm add express`， 然后在另一个中执行 `pnpm add express`。 以下是你在第一个目录中的 `node_modules` 的顶级项目：

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

你可以在[这里](https://github.com/zkochan/comparing-node-modules/tree/master/npm-example/node_modules)看到整个目录。

然后这一个`node_modules` 是你通过 pnpm 创建的得到的：

```text
.pnpm
.modules.yaml
express
```

你可以在[这里](https://github.com/zkochan/comparing-node-modules/tree/master/pnpm5-example/node_modules)查看。

那么所有的（次级）依赖去哪了呢？ `node_modules` 中只有一个叫 `.pnpm` 的文件夹以及一个叫做 `express` 的符号链接。 不错，我们只安装了 `express`，所以它是唯一一个你的应用必须拥有访问权限的包。

> 要了解关于为什么 pnpm （对依赖项访问控制）的严格把关是件好事，请阅读[此文](https://medium.com/pnpm/pnpms-strictness-helps-to-avoid-silly-bugs-9a15fb306308)

让我们看看在 `express` 中都有些什么：

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

`express` 没有 `node_modules`? `express` 的所有依赖都去哪里了？

诀窍是 `express` 只是一个符号链接。 当 Node.js 解析依赖的时候，它使用这些依赖的真实位置，所以它不保留符号链接。 但是你可能就会问了，`express` 的真实位置在哪呢？

在这里：[node_modules/.pnpm/express@4.17.1/node_modules/express](https://github.com/zkochan/comparing-node-modules/tree/master/pnpm5-example/node_modules/.pnpm/express@4.17.1/node_modules/express)。

OK，所以我们现在知道了 `.pnpm/` 文件夹的用途。 `.pnpm/` 以平铺的形式储存着所有的包，所以每个包都可以在这种命名模式的文件夹中被找到：

```text
.pnpm/<name>@<version>/node_modules/<name>
```

我们称之为虚拟存储目录。

这个平铺的结构避免了 npm v2 创建的嵌套 `node_modules` 引起的长路径问题，但与 npm v3,4,5,6 或 yarn v1 创建的平铺的 `node_modules` 不同的是，它保留了包之间的相互隔离。

现在让我们看看 `express` 的真实位置：

```text
  ▾ express
    ▸ lib
      History.md
      index.js
      LICENSE
      package.json
      Readme.md
```

这是个骗局吗？ 还是没有 `node_modules`！ pnpm 的 `node_modules` 结构的第二个技巧是包的依赖项与依赖包的实际位置位于同一目录级别。 所以 `express` 的依赖不在 `.pnpm/express@4.17.1/node_modules/express/node_modules/` 而是在 [.pnpm/express@4.17.1/node_modules/](https://github.com/zkochan/comparing-node-modules/tree/master/pnpm5-example/node_modules/.pnpm/express@4.17.1/node_modules)：

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

`express` 所有的依赖都软链至了 `node_modules/.pnpm/` 中的对应目录。 把 `express` 的依赖放置在同一级别避免了循环的软链。

正如你所看到的，即使 pnpm 的 `node_modules` 结构一开始看起来很奇怪：

1. 它完全适配了 Node.js。
2. 包与其依赖被完美地组织在一起。

有 peer 依赖的包的结构[更加复杂](/how-peers-are-resolved)一些，但思路是一样的：使用软链与平铺目录来构建一个嵌套结构。
