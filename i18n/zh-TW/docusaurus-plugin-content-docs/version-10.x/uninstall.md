---
id: uninstall
title: 解除安裝 pnpm
---

## 移除全域安裝的套件

在您刪除 pnpm CLI 之前，請記得先移除所有 pnpm 安裝的全域套件。

To list all the global packages, run `pnpm ls -g`. 有兩種方式可以移除全域套件：

1. Run `pnpm rm -g <pkg>...` with each global package listed.
2. Run `pnpm root -g` to find the location of the global directory and remove it manually.

## 移除 pnpm CLI

如果您是以獨立指令碼安裝 pnpm，可以透過移除 pnpm 安裝的主目錄來解除安裝 pnpm CLI：

```
rm -rf "$PNPM_HOME"
```

You might also want to clean the `PNPM_HOME` env variable in your shell configuration file (`$HOME/.bashrc`, `$HOME/.zshrc` or `$HOME/.config/fish/config.fish`).

如果您使用 npm 安裝 pnpm，那麼您應該使用 npm 來移除 pnpm：

```
npm rm -g pnpm
```

## 移除全域模組的內容可尋址儲存區

```
rm -rf "$(pnpm store path)"
```

如果您在非主要的磁碟中使用 pnpm，您必須在您使用過 pnpm 的每個磁碟中執行上述的命令。
因為 pnpm 會在每個執行過 pnpm 的磁碟上建立儲存區。

