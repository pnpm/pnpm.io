---
id: configuring
title: Configuring
---

pnpm settings are divided into two categories:

- **Registry and auth settings** are stored in INI files: the global `rc` file and local `.npmrc` files.
- **pnpm-specific settings** are stored in YAML files: the global `config.yaml` and the local `pnpm-workspace.yaml`.

pnpm no longer reads non-auth and non-registry settings from rc files. Other settings must be defined in `pnpm-workspace.yaml` or the global `config.yaml`.

pnpm also no longer reads settings from the `pnpm` field of `package.json`. Settings should be defined in `pnpm-workspace.yaml`.

## Local project configuration

Project-level settings go in `pnpm-workspace.yaml`:

```yaml title="pnpm-workspace.yaml"
nodeVersion: "22"
saveExact: true
```

## Global configuration

The global YAML config file (`config.yaml`) is located at one of the following paths:

* If the **$XDG_CONFIG_HOME** env variable is set, then **$XDG_CONFIG_HOME/pnpm/config.yaml**
* On Windows: **~/AppData/Local/pnpm/config/config.yaml**
* On macOS: **~/Library/Preferences/pnpm/config.yaml**
* On Linux: **~/.config/pnpm/config.yaml**

The global `rc` file (for registry and auth settings only) is at:

* If the **$XDG_CONFIG_HOME** env variable is set, then **$XDG_CONFIG_HOME/pnpm/rc**
* On Windows: **~/AppData/Local/pnpm/config/rc**
* On macOS: **~/Library/Preferences/pnpm/rc**
* On Linux: **~/.config/pnpm/rc**

## Environment variables

Environment variables whose names start with `pnpm_config_` are loaded into configuration. These override settings from `pnpm-workspace.yaml` but not CLI arguments.

For example:

```sh
pnpm_config_save_exact=true pnpm add foo
```

If you need pnpm to work across multiple hard drives or filesystems,
please read [the FAQ].

See the [`config` command] for more information on managing configuration.

[the FAQ]: ./faq.md#does-pnpm-work-across-multiple-drives-or-filesystems
[`config` command]: ./cli/config.md
