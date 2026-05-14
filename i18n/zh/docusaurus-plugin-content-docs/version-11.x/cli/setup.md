---
id: setup
title: pnpm setup
---

pnpm 的独立安装脚本使用此命令。 例如，在 [https://get.pnpm.io/install.sh] 中。

安装程序执行以下操作：

- 为 pnpm CLI 创建一个主目录
- 通过更新 shell 配置文件将 pnpm 主目录添加到 `PATH`
- 将 pnpm 可执行文件复制到 pnpm 主目录

:::tip

After upgrading to pnpm v11, run `pnpm setup` to update your shell configuration. In v11, globally installed binaries are stored in a `bin` subdirectory of `PNPM_HOME`.

:::

[https://get.pnpm.io/install.sh]: https://get.pnpm.io/install.sh