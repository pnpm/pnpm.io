---
id: faq
title: 常见问题
---

## 如果包存储在全局存储中，为什么我的 `node_modules` 会占用磁盘空间？

pnpm 从全局存储创建到项目的 `node_modules`
文件夹的 [硬链接][hard links]。 硬链接指向磁盘上原始文件所在的同一位置。 例如，如果您的项目中有依赖 `foo` 并且它的大小为 1MB，那么看上去它好像会在项目的 `node_modules` 文件夹和全局存储都占用 1MB 空间。 但是，这 1MB 实际上在硬盘中只有存储了一份，只是它被链接到了两个位置上。 所以 `foo` 这个依赖实际上只占用 1MB 而不是 2MB。

[hard links]: https://en.wikipedia.org/wiki/Hard_link

获取有关此主题的更多信息：

- [为什么硬链接似乎占用与原始文件相同的空间？](https://unix.stackexchange.com/questions/88423/why-do-hard-links-seem-to-take-the-same-space-as-the-originals)
- [来自 pnpm 聊天室的一个帖子](https://gist.github.com/zkochan/106cfef49f8476b753a9cbbf9c65aff1)
- [pnpm repo 中的一个议题](https://github.com/pnpm/pnpm/issues/794)

## 它能在 Windows 上运行吗？

简短回答: 是的。
长答案：在 Windows 上使用符号链接至少可以说是有问题的，但是，pnpm 有一个解决方法。 在 Windows 上，我们改用 [Junctions]（软链接）。

[junctions]: https://docs.microsoft.com/en-us/windows/win32/fileio/hard-links-and-junctions

## 但是嵌套的 `node_modules` 组织方式与 Windows 兼容吗？

Npm 的早期版本由于嵌套所有“node\_modules”而存在问题（参见
[此议题][this issue]）。 但是，pnpm 不会创建深层文件夹，它使用符号链接来创建依赖关系树结构。

[this issue]: https://github.com/nodejs/node-v0.x-archive/issues/6960

## 那么循环符号链接怎么样？

尽管 pnpm 使用链接将依赖项放入 `node_modules` 文件夹，但可以避免
循环符号链接，因为父包与其依赖项一起放置在同一个
`node_modules` 文件夹中。 所以 `foo` 的依赖项不在 `foo/node_modules` 中，`foo` 和它的依赖项都在 `node_modules` 中。

## 为什么使用硬链接？ 为什么不直接创建到全局存储的符号链接？

一台机器上一个包在可以有不同的依赖集。

比如，在项目 **A** 中，依赖 `foo@1.0.0` 有一个依赖解析为 `bar@1.0.0`，但在项目 B 中，`foo` 的依赖可能会被解析为 `bar@1.1.0`。 因此，pnpm 将 `foo@1.0.0` 硬链接到每个使用它的项目，以便为其创建不同的依赖。

直接软链接至全局存储与 node 的 `--preserve-symlinks` 选项一起使用是可行的，但是，该方法有问题，因此我们决定使用硬链接。 至于我们为什么做此决定，请参见 [此议题][eps-issue]。

[eps-issue]: https://github.com/nodejs/node-eps/issues/46

## pnpm 是否可以在 Btrfs 分区中的不同子卷工作？

虽然 Btrfs 不允许单个分区中不同子卷之间的跨设备硬链接，但它允许引用链接。 因此，pnpm 利用引用链接在这些子卷之间共享数据。

## pnpm 是否可以跨多个驱动器或文件系统工作？

包存储应与安装的位置处于同一驱动器和文件系统上，否则，包将被复制，而不是被链接。 这是由于硬链接的工作方式带来的一个限制，因为一个文件系统上的文件无法寻址另一个文件系统中的位置。 有关更多详细信息，请参阅[提议#712][Issue #712]。

pnpm 在以下两种情况下的功能有所不同：

[Issue #712]: https://github.com/pnpm/pnpm/issues/712

### 存储路径已指定

如果存储路径是通过[存储配置](configuring.md)指定的，则存储与项目间的复制行为将会发生在不同的磁盘上。

如果你在磁盘 `A` 上执行 `pnpm install`，则 pnpm 存储必须位于磁盘 `A`。
如果 pnpm 存储位于磁盘 B，则所有需要的包将被直接复制到项目位置而不是链接。 这严重抑制了 pnpm 的存储和性能优势。

### 存储路径未指定

如果未设置存储路径，则会创建多个存储（每个驱动器或文件系统一个）。

如果安装在磁盘 A 上运行，则存储将在 A 的文件系统根目录下的 `.pnpm-store` 下被创建。  如果后续在磁盘 B 上安装，则会在 B 上的 `.pnpm-store` 中创建一个独立的存储。 项目仍将保持 pnpm 的优势，但每个驱动器可能有冗余包。

## `pnpm` 代表什么？

`pnpm` 代表 performant（高性能的） npm。
[@rstacruz](https://github.com/rstacruz/) 想出了这个名字。

## pnpm 无法在\<你的项目\>中使用 ？

在大多数情况下，这意味着你项目依赖项的其中之一没有在 `package.json` 中声明。 这是由扁平 `node_modules` 引起的常见错误。 如果发生这种情况，这是依赖项中的错误，应修复依赖项。 但这可能需要时间，因此 pnpm 支持额外的解决方法来使有问题的包工作。

### 解决方案 1

如果出现问题，你可以使用 [`nodeLinker: hoisted`] 设置。
这将创建一个类似于 npm 创建的扁平的 `node_modules` 目录结构。

[`nodeLinker: hoisted`]: settings#nodeLinker

### 解决方案 2

在以下示例中，依赖项在其自己的依赖列表中没有 `iterall` 模块。

解决有缺陷的软件包缺少依赖项的最简单解决方案是
**将 `iterall` 作为依赖项添加到我们项目的 `package.json`**。

你可以这样做，方法是通过 `pnpm add iterall` 安装它，它将自动添加到您项目的 package.json 中。

```json
  "dependencies": {
    ...
    "iterall": "^1.2.2",
    ...
  }
```

### 解决方案 3

解决方案之一是使用 [钩子](pnpmfile.md#hooks) 将缺失的依赖项添加到 `package.json` 中。

一个例子是 [Webpack Dashboard] 不能与 `pnpm` 一起使用。 它已经得到解决，现在可以与 pnpm 一起使用。

它曾经抛出一个错误：

```console
Error: Cannot find module 'babel-traverse'
  at /node_modules/inspectpack@2.2.3/node_modules/inspectpack/lib/actions/parse
```

问题在于 `inspectpack` 中使用了 `babel-traverse`，而 `webpack-dashboard` 使用了 `babel-traverse`，但是在 `inspectpack` 的 `package.json` 中没有指定 `babel-traverse`。 它仍然与 `npm` 和 `yarn` 兼容，因为它们构建扁平的 `node_modules` 结构。

解决方案是创建一个 `.pnpmfile.mjs` ，内容如下：

```js
export const hooks = {
  readPackage: (pkg) => {
    if (pkg.name === "inspectpack") {
      pkg.dependencies['babel-traverse'] = '^6.26.0';
    }
    return pkg;
  }
}
```

创建 `.pnpmfile.mjs` 后，只删除 `pnpm-lock.yaml` - 不需要删除 `node_modules`，因为 pnpm 钩子仅影响模块解析。 然后，重建依赖项，应该就可以正常运行了。

[Webpack Dashboard]: https://github.com/pnpm/pnpm/issues/1043
