---
id: faq
title: 常見問題
---

## 如果套件都存在全域的儲存區了，為什麼我的 `node_modules` 資料夾仍佔用硬碟空間？

pnpm 會透過 [硬連結][]的方式連結全域存儲到專案資料夾下的 `node_modules` 資料夾。 硬連結會指向硬碟上原始檔所在的同一位置。 因此，例如，如果您的項目中有 `foo` 作為依賴項並且它佔用 1MB 空間，那麼它看起來就像它在項目的 `node_modules` 文件夾中占用了與全局存儲相同的 1MB 空間。 但是，這 1MB 是硬碟上兩個不同位置的*相同空間* 。 所以 `foo` 總共只占用 1MB，而不是 2MB。

有關這個主題的更多資訊：

* [為什麼硬連結似乎與原始連結佔用相同的空間？](https://unix.stackexchange.com/questions/88423/why-do-hard-links-seem-to-take-the-same-space-as-the-originals)
* [Pnpm 聊天室的一則討論串](https://gist.github.com/zkochan/106cfef49f8476b753a9cbbf9c65aff1)
* [Pnpm repo 中的一個 issue](https://github.com/pnpm/pnpm/issues/794)

## pnpm 可以在 Windows 上執行嗎？

一句話：是的。 詳細回答：在 Windows 上使用符號連結會造成許多問題，但 pnpm 有一個暫時的解決方法。 對於 Windows，我們用[junctions][]替代。

## 但是巢狀 `node_modules` 的方式不適用於 Windows？

之前的 npm 版本因巢狀內嵌了所有 `node_modules` 發生問題 (請參閱[此問題][])。 However, pnpm does not create deep folders, it stores all packages flatly and uses symbolic links to create the dependency tree structure.

## What about circular symlinks?

Although pnpm uses linking to put dependencies into `node_modules` folders, circular symlinks are avoided because parent packages are placed into the same `node_modules` folder in which their dependencies are. So `foo`'s dependencies are not in `foo/node_modules`, but `foo` is in `node_modules` together with its own dependencies.

## 為什麼使用硬連結？ 為什麼不直接 symlink 至全域的儲存區？

一個包在一台機器上可以有不同的依賴集。

In project **A** `foo@1.0.0` can have a dependency resolved to `bar@1.0.0`, but in project **B** the same dependency of `foo` might resolve to `bar@1.1.0`; so, pnpm hard links `foo@1.0.0` to every project where it is used, in order to create different sets of dependencies for it.

Direct symlinking to the global store would work with Node's `--preserve-symlinks` flag, however, that approach comes with a plethora of its own issues, so we decided to stick with hard links. For more details about why this decision was made, see [this issue][eps-issue].

## Does pnpm work across different subvolumes in one Btrfs partition?

While Btrfs does not allow cross-device hardlinks between different subvolumes in a single partition, it does permit reflinks. As a result, pnpm utilizes reflinks to share data between these subvolumes.

## Does pnpm work across multiple drives or filesystems?

The package store should be on the same drive and filesystem as installations, otherwise packages will be copied, not linked. This is due to a limitation in how hard linking works, in that a file on one filesystem cannot address a location in another. See [Issue #712][] for more details.

pnpm functions differently in the 2 cases below:

### 已指定儲存區路徑

If the store path is specified via [the store config](configuring.md), then copying occurs between the store and any projects that are on a different disk.

If you run `pnpm install` on disk `A`, then the pnpm store must be on disk `A`. If the pnpm store is located on disk `B`, then all required packages will be directly copied to the project location instead of being linked. This severely inhibits the storage and performance benefits of pnpm.

### 未指定儲存區路徑

If the store path is not set, then multiple stores are created (one per drive or filesystem).

If installation is run on disk `A`, the store will be created on `A` `.pnpm-store` under the filesystem root.  If later the installation is run on disk `B`, an independent store will be created on `B` at `.pnpm-store`. The projects would still maintain the benefits of pnpm, but each drive may have redundant packages.

## What does `pnpm` stand for?

`pnpm` stands for `performant npm`. [@rstacruz](https://github.com/rstacruz/) came up with the name.

## `pnpm` does not work with &lt;YOUR-PROJECT-HERE>?

In most cases it means that one of the dependencies require packages not declared in `package.json`. It is a common mistake caused by flat `node_modules`. If this happens, this is an error in the dependency and the dependency should be fixed. That might take time though, so pnpm supports workarounds to make the buggy packages work.

### 解決方案 1

In case there are issues, you can use the [`nodeLinker: hoisted`][] setting. This creates a flat `node_modules` structure similar to the one created by `npm`.

### 解決方案 2

In the following example, a dependency does **not** have the `iterall` module in its own list of deps.

The easiest solution to resolve missing dependencies of the buggy packages is to **add `iterall` as a dependency to our project's `package.json`**.

You can do so, by installing it via `pnpm add iterall`, and will be automatically added to your project's `package.json`.

```json
  "dependencies": {
    ...
    "iterall": "^1.2.2",
    ...
  }
```

### 解決方案 3

One of the solutions is to use [hooks](pnpmfile.md#hooks) for adding the missing dependencies to the package's `package.json`.

An example was [Webpack Dashboard][] which wasn't working with `pnpm`. It has since been resolved such that it works with `pnpm` now.

It used to throw an error:

```console
Error: Cannot find module 'babel-traverse'
  at /node_modules/inspectpack@2.2.3/node_modules/inspectpack/lib/actions/parse
```

The problem was that `babel-traverse` was used in `inspectpack` which was used by `webpack-dashboard`, but `babel-traverse` wasn't specified in `inspectpack`'s `package.json`. It still worked with `npm` and `yarn` because they create flat `node_modules`.

The solution was to create a `.pnpmfile.mjs` with the following contents:

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

After creating a `.pnpmfile.mjs`, delete `pnpm-lock.yaml` only - there is no need to delete `node_modules`, as pnpm hooks only affect module resolution. Then, rebuild the dependencies & it should be working.

[硬連結]: https://en.wikipedia.org/wiki/Hard_link

[junctions]: https://docs.microsoft.com/en-us/windows/win32/fileio/hard-links-and-junctions

[此問題]: https://github.com/nodejs/node-v0.x-archive/issues/6960

[eps-issue]: https://github.com/nodejs/node-eps/issues/46

[Issue #712]: https://github.com/pnpm/pnpm/issues/712

[`nodeLinker: hoisted`]: settings#nodeLinker

[Webpack Dashboard]: https://github.com/pnpm/pnpm/issues/1043
