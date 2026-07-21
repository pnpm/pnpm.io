---
id: motivation
title: 项目初衷
---

## 节省磁盘空间

![一个 pnpm 可寻址仓库的插图。 在插图中有两个带有 node_modules 的项目。 node_modules 目录中的文件是指向内容可寻址仓库中相同文件的硬链接。](/img/pnpm-store.svg)

使用 npm 时，依赖每次被不同的项目使用，都会重复安装一次。  而在使用 pnpm 时，依赖会被存储在内容可寻址的存储中，所以：

1. 如果你用到了某依赖项的不同版本，只会将不同版本间有差异的文件添加到仓库。 例如，如果某个包有 100 个文件，而它的新版本只改变了其中 1 个文件。那么 `pnpm update` 时只会向存储中额外添加 1 个新文件，而不会因为单个改变克隆整个依赖。
1. 所有文件都会存储在硬盘上的某一位置。 当软件包被被安装时，包里的文件会硬链接到这一位置，而不会占用额外的磁盘空间。 这允许你跨项目地共享同一版本的依赖。

因此，你在磁盘上节省了大量空间，这与项目和依赖项的数量成正比，并且安装速度要快得多！

## 提高安装速度

pnpm 分三个阶段执行安装：

1. 依赖解析。 仓库中没有的依赖都被识别并获取到仓库。
1. 目录结构计算。 `node_modules` 目录结构是根据依赖计算出来的。
1. 链接依赖项。 所有以前安装过的依赖项都会直接从仓库中获取并链接到 `node_modules`。

![pnpm 安装过程的插图。 所有的包会尽快解析、获取和硬链接。](/img/installation-stages-of-pnpm.svg)

这种方法比传统的三阶段安装过程（解析、获取和将所有依赖项写入 `node_modules`）快得多。

![Yarn Classic 或 npm 等包管理器如何安装依赖项的图示。](/img/installation-stages-of-other-pms.svg)

## 创建一个非扁平的 node_modules 目录

使用 npm 或 Yarn Classic 安装依赖项时，所有的包都被提升到模块目录的根目录。 这样就导致了一个问题，源码可以直接访问和修改依赖，而不是作为只读的项目依赖。

默认情况下，pnpm 使用符号链接将项目的直接依赖项添加到模块目录的根目录中。

![pnpm 创建的 node_modules 目录的图示。 根目录下的 node_modules 中的包是指向 node_modules/.pnpm 目录内目录的符号链接。](/img/isolated-node-modules.svg)

如果你想了解有关 pnpm 创建的独特的 `node_modules` 结构的更多详情，以及它为何能与 Node.js 生态系统良好配合，请阅读：
- [扁平的 node_modules 不是唯一实现方式](/blog/2020/05/27/flat-node-modules-is-not-the-only-way)
- [基于符号链接的 node_modules 结构](symlinked-node-modules-structure.md)

:::tip

如果你的工具不适用于符号链接，你仍然可以使用 pnpm 并将 [node-linker](npmrc#node-linker) 设置设置为 `hoisted`。 这样 pnpm 就会创建一个类似于 npm 和 Yarn Classic 创建的 node_modules 目录。

:::
