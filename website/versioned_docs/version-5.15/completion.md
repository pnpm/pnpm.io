---
id: version-5.15-completion
title: Command line tab-completion
original_id: completion
---

Added in: v4.9.0

pnpm supports command line tab-completion for Bash, Zsh, and Fish shells.

To setup autocompletion, run:

```text
pnpm install-completion
```

The CLI will ask for which shell to generate the autocompletion script. Alternatively, the target shell may be specified in the command line (since v5.15.0):

```text
pnpm install-completion zsh
```

To see examples of completion, read [this article](https://medium.com/pnpm/pnpm-v4-9-comes-with-command-completion-a411715260b4).
