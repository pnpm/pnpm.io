---
id: completion
title: pnpm completion
---

Print shell completion code to stdout.

```text
pnpm completion <shell>
```

## Parameters

### &lt;shell&gt;

Shell to print completion code for. Only 4 shells are supported: `bash`, `fish`, `pwsh`, `zsh`.

## Examples

### Activate completion for Bash by sourcing it from ~/.bashrc

```bash
pnpm completion bash > ~/completion-for-pnpm.bash
echo 'source ~/completion-for-pnpm.bash' >> ~/.bashrc
```

### Install completion for Bash directly to its completion directory (for installing pnpm as a Linux distro package)

```bash
mkdir -p /usr/share/bash-completion/completions/
pnpm completion bash > /usr/share/bash-completion/completions/pnpm
```
