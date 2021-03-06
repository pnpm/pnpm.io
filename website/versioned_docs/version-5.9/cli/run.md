---
id: run
title: pnpm run
original_id: run
---

Aliases: `run-script`

Runs a defined package script.

## Synopsis

```text
pnpm run [[-r] [--no-bail] [--no-sort] [--workspace-concurrency=&lt;number>]]
     &lt;command> [-- &lt;args>...]
```

## Examples

Run the `watch` task:

```text
pnpm run watch
```

Same thing without the `run` keyword will work as well:

```text
pnpm watch
```

## Details

In addition to the shell’s pre-existing `PATH`, `pnpm run` adds `node_modules/.bin`
to the `PATH` provided to `scripts`. As of v3.5, when executed inside a workspace,
`<workspace root>/node_modules/.bin` is also added to the `PATH`, so if a tool
is installed in the workspace root, it may be called in any workspace package's `scripts`.

## Options

### shell-emulator

Added in: v5.8.0

* Default: **false**
* Type: **Boolean**

When `true`, pnpm will use a JavaScript implementation of a [bash-like shell](https://www.npmjs.com/package/@yarnpkg/shell) to execute scripts.

This option simplifies cross-platform scripting. For instance, by default the next script will fail on Windows:

```
{
  "scripts": {
    "test": "NODE_ENV=test node test.js"
  }
```

But if the `shell-emulator` setting is set to `true`, it will work on all platforms.

### --recursive, -r

This runs an arbitrary command from each package's "scripts" object.
If a package doesn't have the command, it is skipped.
If none of the packages have the command, the command fails.

### --if-present

Added in: v4.5.0

You can use the `--if-present` flag to avoid exiting with a non-zero exit code
when the script is undefined. This lets you run potentially undefined scripts
without breaking the execution chain.

### --parallel

Added in: v5.1.0

Completely disregard concurrency and topological sorting, running a given script
immediately in all matching packages with prefixed streaming output. This is the
preferred flag for long-running processes such as watch run over many packages.

```text
pnpm run --parallel watch
```

### --stream

Added in: v5.1.0

Stream output from child processes immediately, prefixed with the originating package directory.
This allows output from different packages to be interleaved.

### --filter &lt;package_selector>

[Read more about filtering.](../filtering)
