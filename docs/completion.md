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

## Fig (on macOS only)

You can get IDE-style autocompletions for pnpm with [Fig]. It works in Bash, Zsh, and Fish.

To install, run:

```text
brew install fig
```

[Fig]: https://fig.io/

## More advanced completion

### features
- Provide completion for `pnpm --filter <package>`.
- Provide completion for `pnpm remove` command, even in workspace's packages (by specifying `--filter` option).
- Provide completion for npm scripts in `package.json`.

### installation

please refer to [pnpm-shell-completion](https://github.com/g-plane/pnpm-shell-completion)
