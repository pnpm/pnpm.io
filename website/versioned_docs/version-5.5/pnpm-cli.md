---
id: version-5.5-pnpm-cli
title: pnpm CLI
original_id: pnpm-cli
---

Just use pnpm in place of npm:

```sh
pnpm add lodash
```

## Differences vs npm

Unlike npm, pnpm validates all options. So `pnpm install --foo` will fail as `--foo` is not
a known option for that `install` command.

However, some dependencies may use the `npm_config_` env variable, which is populated from the
CLI options. In this case, you have the following options:

1. explicitly set the env variable: `npm_config_foo=true pnpm install`
1. force the unknown option with `--config.`: `pnpm install --config.foo`

## Options

### -C &lt;path>, --dir &lt;path>

Run as if pnpm was started in `<path>` instead of the current working directory.
