---
id: setup
title: pnpm setup
---

此命令用於 pnpm 的單獨安裝指令稿。 For instance, in [https://get.pnpm.io/install.sh].

安裝指令稿會執行以下操作：

- 為 pnpm CLI 建立主目錄
- adds the pnpm home directory to the `PATH` by updating the shell configuration file
- 將 pnpm 的可執行檔複製到 pnpm 主目錄中

:::tip

After upgrading to pnpm v11, run `pnpm setup` to update your shell configuration. In v11, globally installed binaries are stored in a `bin` subdirectory of `PNPM_HOME`.

:::

[https://get.pnpm.io/install.sh]: https://get.pnpm.io/install.sh