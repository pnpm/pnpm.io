---
id: completion
title: Command line tab-completion
---

:::info

Completion for pnpm v9 is incompatible with completion for older pnpm versions.
If you already install pnpm completion for version older than v9, you must uninstall it first so that completion for v9 may work properly.
You may do so by removing section of code that contains `__tabtab` in your dot files.

:::

Unlike other popular package managers, which usually require plugins, pnpm
supports command line tab-completion for Bash, Zsh, Fish, and similar shells.

To setup autocompletion for Bash, run:

```text
pnpm completion bash > ~/completion-for-pnpm.bash
echo 'source ~/completion-for-pnpm.bash' >> ~/.bashrc
```

To see examples of completion, read [this article].

[this article]: https://medium.com/pnpm/pnpm-v4-9-comes-with-command-completion-a411715260b4

## Fig (on macOS only)

You can get IDE-style autocompletions for pnpm with [Fig]. It works in Bash, Zsh, and Fish.

To install, run:

```text
brew install fig
```

[Fig]: https://fig.io/

## g-plane/pnpm-shell-completion

[pnpm-shell-completion] is a shell plugin maintained by Pig Fang on Github.

Features:

- Provide completion for `pnpm --filter <package>`.
- Provide completion for `pnpm remove` command, even in workspace's packages (by specifying `--filter` option).
- Provide completion for scripts in `package.json`.

[pnpm-shell-completion]: https://github.com/g-plane/pnpm-shell-completion
