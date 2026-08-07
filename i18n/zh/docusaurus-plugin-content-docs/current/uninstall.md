---
id: uninstall
title: 卸载 pnpm
---

## 移除全局安装的包

在删除 pnpm CLI 之前，删除 pnpm 安装的全局包可能具有一定意义。

要列出所有全局包，请运行 `pnpm ls -g`。 有两种方法可以删除全局包：

1. 运行 `pnpm rm -g <pkg>...` 列出每个全局包。
2. 运行 `pnpm root -g` 找到全局目录的位置并手动删除它。

## 移除 pnpm CLI

如果你的 pnpm 是通过独立脚本进行安装的，你应该可以直接删除 pnpm 的主目录。

```
rm -rf "$PNPM_HOME"
```

你可能还想清理 shell 配置文件中 `PNPM_HOME` 的环境变量（`$HOME/.bashrc` 、 `$HOME/.zshrc` 或者 `$HOME/.config/fish/config.fish`）

如果你使用 npm 安装 pnpm，那么应该使用 npm 卸载 pnpm：

```
npm rm -g pnpm
```

## 删除全局内容可寻址存储

```
rm -rf "$(pnpm store path)"
```

如果你不在主磁盘中使用 pnpm ，你必须在使用 pnpm 的每一个磁盘中运行上述命令。 因为 pnpm 会为每一个磁盘创建一个专用的存储空间。

