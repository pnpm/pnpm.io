---
id: store
title: pnpm store
---

管理包存储。

## 命令

### status

查看 store 中已修改的包。

如果包的内容与拆包时相同，返回退出代码 0。

### add

功能上等同于 [`pnpm add`]，不同之处在于它只把包加入存储中，但没有修改存储外的任何项目或文件。

[`pnpm add`]: ./add.md

### prune

从存储中删除 _未引用的包_。

未引用的包是系统上的任何项目中都未使用的包。 在大多数安装操作之后，包有可能会变为未引用状态，例如当依赖项变得多余时。

例如，在 `pnpm install` 期间，包 `foo@1.0.0` 被更新为 `foo@1.0.1`。 pnpm 将在存储中保留 `foo@1.0.0` ，因为它不会自动除去包。 如果包 `foo@1.0.0` 没有被其他任何项目使用，它将变为未引用。 运行 `pnpm store prune` 将会把 `foo@1.0.0` 从存储中删除 。

运行 `pnpm store prune` 是无害的，对你的项目没有副作用。 如果以后的安装需要已经被删除的包，pnpm 将重新下载他们。

最好的做法是运行 `pnpm store prune` 来清理存储，但不要太频繁。 有时，未引用的包会再次被需要。 这可能在切换分支和安装旧的依赖项时发生，在这种情况下，pnpm 需要重新下载所有删除的包，会暂时减慢安装过程。

修剪后，pnpm 会显示已删除文件的总大小。

启用 [全局虚拟存储][global virtual store] 后，`pnpm store prune` 还会对全局虚拟存储的 `links/` 目录执行标记清除垃圾回收。 Projects using the store are registered via symlinks in `{storeDir}/v11/projects/`, allowing pnpm to track active usage and safely remove unused packages from the global virtual store.

[global virtual store]: ../settings.md#enableglobalvirtualstore

### path

返回激活的存储目录的路径。
