---
id: completion
title: Completar linha de comando utilizando tab
---

:::info

Completion for pnpm v9+ is incompatible with completion for older pnpm versions. If you have already installed pnpm completion for a version older than v9, you must uninstall it first to ensure that completion for v9+ works properly. You can do this by removing the section of code that contains `__tabtab` in your dot files.

:::

Unlike other popular package managers, which usually require plugins, pnpm supports command line tab-completion for Bash, Zsh, Fish, and similar shells.

To setup autocompletion for Bash, run:

```text
pnpm completion bash > ~/completion-for-pnpm.bash
echo 'source ~/completion-for-pnpm.bash' >> ~/.bashrc
```

To setup autocompletion for Fish, run:

```text
pnpm completion fish > ~/.config/fish/completions/pnpm.fish
```

## g-plane/pnpm-shell-completion

[pnpm-shell-completion][] is a shell plugin maintained by Pig Fang on Github.

Features:

- Prove auto completar para `pnpm --filter <package>`.
- Prove auto completar para o comando `pnpm remove`, mesmo em pacotes do workspace (quando especificando a opção `--filter`).
- Prove auto completar para scripts em `package.json`.

[pnpm-shell-completion]: https://github.com/g-plane/pnpm-shell-completion
