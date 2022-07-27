---
id: completion
title: Command line tab-completion
---

Unlike other popular package managers, which usually require plugins, pnpm
supports command line tab-completion for Bash, Zsh, Fish, and similar shells.

To setup autocompletion, run:

```text
pnpm install-completion
```

The CLI will ask for which shell to generate the autocompletion script.
Alternatively, the target shell may be specified in the command line:

```text
pnpm install-completion zsh
```

To see examples of completion, read [this article].

[this article]: https://medium.com/pnpm/pnpm-v4-9-comes-with-command-completion-a411715260b4

### Fig

You can get IDE-style autocompletions for pnpm with <a href="https://fig.io/" target="_blank"><img src="https://fig.io/badges/Logo.svg" width="15" height="15"/></a> [Fig](https://fig.io/). It works in bash, zsh, and fish.

To install, run:

```shell
brew install fig
```
