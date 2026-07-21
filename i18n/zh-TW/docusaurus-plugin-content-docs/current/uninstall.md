---
id: uninstall
title: 解除安裝 pnpm
---

## 移除全域安裝的套件

在您刪除 pnpm CLI 之前，請記得先移除所有 pnpm 安裝的全域套件。

想要列出所有全域已安裝的套件，請執行 `pnpm ls -g`。 有兩種方式可以移除全域套件：

1. 執行 `pnpm rm -g <pkg>...` 以移除每一個全域套件清單。
2. 執行 `pnpm root -g` 找到全域目錄的位置並手動移除它。

## 移除 pnpm CLI

如果您是以獨立指令碼安裝 pnpm，可以透過移除 pnpm 安裝的主目錄來解除安裝 pnpm CLI：

```
rm -rf "$PNPM_HOME"
```

您可能還會希望清理 `PNPM_HOME` 您在 shell 組態檔中的 env 變數 (`$HOME/.bashrc`, `$HOME/.zshrc` 或 `$HOME/.config/fish/config.fish`)。

如果您使用 npm 安裝 pnpm，那麼您應該使用 npm 來移除 pnpm：

```
npm rm -g pnpm
```

## 移除全域模組的內容可尋址儲存區

```
rm -rf "$(pnpm store path)"
```

如果您在非主要的磁碟中使用 pnpm，您必須在您使用過 pnpm 的每個磁碟中執行上述的命令。 因為 pnpm 會在每個執行過 pnpm 的磁碟上建立儲存區。

