---
id: completion
title: 命令行 tab 自动补全
---

:::info

pnpm v9+ 的自动补全与旧版本的不兼容 如果你曾安装过 v9 版本之前的 pnpm 自动补全，你必须先卸载它以确保 v9+ 版本可以正常工作。 你可以通过删除点文件中包含 `__tabtab` 的代码段落来实现它。

:::

与其他通常需要插件的流行包管理器不同，pnpm 支持 Bash、Zsh、Fish 和类似 shell 的命令行制表符补全。

要为 Bash 设置自动补全，运行：

```text
pnpm completion bash > ~/completion-for-pnpm.bash
echo 'source ~/completion-for-pnpm.bash' >> ~/.bashrc
```

要为 Fish 设置自动补全，运行：

```text
pnpm completion fish > ~/.config/fish/completions/pnpm.fish
```

## g-plane/pnpm-shell-completion

[pnpm-shell-completion][] 是一个在 Github上由 Pig Fang 维护的终端插件。

特性：

- 为 `pnpm --filter <package>` 提供补全。
- 为 `pnpm remove` 提供补全，即使在工作空间的包中（通过指定 `--filter` 选项）。
- 为 `package.json` 中的脚本提供补全。

[pnpm-shell-completion]: https://github.com/g-plane/pnpm-shell-completion
