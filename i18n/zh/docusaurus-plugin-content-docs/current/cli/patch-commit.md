---
id: patch-commit
title: "pnpm patch-commit <path>"
---

从目录中生成一个补丁并保存它（受 Yarn 中类似命令的启发）。

此命令将比较 `path` 与它应该修补的包之间的更改，生成一个补丁文件，将补丁文件保存到 `patchesDir` （可以通过 `--patches-dir` 选项自定义），并在 [`patchesDependencies`][]中添加一个条目。

使用方法：

```sh
pnpm patch-commit <path>
```

* `path` 是正被修补软件包的修改副本目录的路径，这个目录通常是由 [`pnpm patch`](./patch)生成的。

## 配置项

### --patches-dir &lt;patchesDir>

生成的补丁文件将保存到该目录。 默认情况下，补丁保存在项目根目录下的 `patches` 目录中。

[`patchesDependencies`]: ../settings.md#patcheddependencies
