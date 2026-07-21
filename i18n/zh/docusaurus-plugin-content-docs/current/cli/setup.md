---
id: setup
title: pnpm setup
---

pnpm 的独立安装脚本使用此命令。 例如，在 [https://get.pnpm.io/install.sh][]中。

安装程序执行以下操作：

* 为 pnpm CLI 创建一个主目录
* 通过更新 shell 配置文件将 pnpm 主目录添加到 `PATH`
* 将 pnpm 可执行文件复制到 pnpm 主目录

:::tip

升级到 pnpm v11 后，运行 `pnpm setup` 来更新 shell 配置。 在 v11 中，全局安装的二进制文件存储在 `bin` 子目录中，位于 `PNPM_HOME` 目录下。

:::

[https://get.pnpm.io/install.sh]: https://get.pnpm.io/install.sh