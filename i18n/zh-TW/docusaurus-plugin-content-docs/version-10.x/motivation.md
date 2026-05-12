---
id: motivation
title: 動機
---

## 節省儲存空間

![An illustration of the pnpm content-addressable store. On the illustration there are two projects with node_modules. The files in the node_modules directories are hard links to the same files in the content-addressable store.](/img/pnpm-store.svg)

使用 npm 時，若您有 100 件專案都使用了同個依附套件，磁碟中就會有 100 份該套件的副本。 反之，有了 pnpm，該依附套件會被儲存在一個由內容定址的儲存區，因此：

1. 如果您同時需要該依附套件的不同版本，只有存在差異的檔案才會被加入儲存區。 For instance, if it has 100 files, and a new
   version has a change in only one of those files, `pnpm update` will only add 1
   new file to the store, instead of cloning the entire dependency just for the
   singular change.
2. 所有依賴套件的檔案將被儲存在磁碟中的單一位置。 當依賴套件被
   安裝時，依賴套件的檔案會被硬鏈結至該位置，不會消耗
   額外的磁碟空間。 這將允許您在不同專案之間共享相同版本的依賴套件。

由於上述原因，您將節省大量的磁碟空間，這將與您的
專案和依賴套件的數量成正比，並且將大幅提升安裝的速度！

## 加速安裝

pnpm performs installation in three stages:

1. 解析相依性。 辨識並取得所有需要的相依套件後，將它們置於儲存區。
2. 計算目錄結構。 The `node_modules` directory structure is calculated based on the dependencies.
3. 建立連結。 All remaining dependencies are fetched and hard linked from the store to `node_modules`.

![An illustration of the pnpm install process. Packages are resolved, fetched, and hard linked as soon as possible.](/img/installation-stages-of-pnpm.svg)

This approach is significantly faster than the traditional three-stage installation process of resolving, fetching, and writing all dependencies to `node_modules`.

![An illustration of how package managers like Yarn Classic or npm install dependencies.](/img/installation-stages-of-other-pms.svg)

## Creating a non-flat node_modules directory

When installing dependencies with npm or Yarn Classic, all packages are hoisted to the root of the
modules directory. As a result, source code has access to dependencies that are
not added as dependencies to the project.

By default, pnpm uses symlinks to add only the direct dependencies of the project into the root of the modules directory.

![An illustration of a node_modules directory created by pnpm. Packages in the root node_modules are symlinks to directories inside the node_modules/.pnpm directory](/img/isolated-node-modules.svg)

If you'd like more details about the unique `node_modules` structure that pnpm
creates and why it works fine with the Node.js ecosystem, read:

- [Flat node_modules is not the only way](/blog/2020/05/27/flat-node-modules-is-not-the-only-way)
- [Symlinked node_modules structure](symlinked-node-modules-structure.md)

:::tip

If your tooling doesn't work well with symlinks, you may still use pnpm and set the [nodeLinker](settings#nodeLinker) setting to `hoisted`. This will instruct pnpm to create a node_modules directory that is similar to those created by npm and Yarn Classic.

:::
