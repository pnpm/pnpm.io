---
id: pack
title: pnpm pack
---

从软件包中创建一个 tarball。

## 配置项

### --recursive, -r

添加于：v10.11.0

打包工作空间（Workspace）中的所有包。

### --out &lt;path\>

自定义 tarball 的输出路径。 可以使用 %s 和 %v来添加软件包名称和版本，例如， %s.tgz 或 some-dir/%s-%v.tgz。 默认情况下，tarball 以名称 `<package-name>-<version>.tgz` 保存在当前工作目录中。

### --pack-destination &lt;dir\>

`pnpm pack` 保存 tarball 的目录。 默认值为当前目录。

### --pack-gzip-level &lt;level\>

指定自定义压缩级别。

### --json

JSON 格式的日志输出。

### --filter &lt;package_selector\>

添加于：v10.11.0

[阅读更多有关过滤的内容。](../filtering.md)

### --dry-run

添加于：v10.26.0

做正常运行的一切，除了打包 tarball。 可用于验证 tarball 包的内容。

## 生命周期

- `prepack`
- `prepare`
- `postpack`

:::tip

你还可以使用 [`beforePacking` 钩子](../pnpmfile.md#hooksbeforepackingpkg-pkg--promisepkg) 在创建 tarball 之前以编程方式修改 `package.json` 的内容。 这对于删除仅用于开发的字段或添加发布元数据非常有用，而无需修改本地的 `package.json`。

:::

