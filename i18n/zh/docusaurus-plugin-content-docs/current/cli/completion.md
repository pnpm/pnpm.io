---
id: completion
title: pnpm completion
---

将命令行补全的代码打印到 stdout。

```text
pnpm completion <shell>
```

## 参数

### &amp;lt;shell&amp;gt;

用于输出代码的 shell。 仅支持 4 个 shell：`bash`、`fish`、`pwsh`、`zsh`。

## 示例

### 将代码写入 ~/.bashrc 以激活命令补全

```bash
pnpm completion bash > ~/completion-for-pnpm.bash
echo 'source ~/completion-for-pnpm.bash' >> ~/.bashrc
```

### 将 Bash 补全直接安装到它的补全目录（对于以 Linux 发行版软件包安装的 pnpm）

```bash
mkdir -p /usr/share/bash-completion/completions/
pnpm completion bash > /usr/share/bash-completion/completions/pnpm
```
