---
id: uninstall
title: Uninstalling pnpm
---

## Removing the globally installed packages

Before removing the pnpm CLI, it might make sense to remove all global packages that were installed by pnpm.

To list all the global packages, run `pnpm ls -g`. There are two ways to remove the global packages:

1. Run `pnpm rm -g <pkg>...` with each global package listed.
2. Run `pnpm root -g` to find the location of the global directory and remove it manually.

## Removing the pnpm CLI

If you used the standalone script to install pnpm, then you should be able to uninstall the pnpm CLI by removing the pnpm home directory:

### On POSIX systems

```
rm -rf "$PNPM_HOME"
```

You might also want to clean the `PNPM_HOME` env variable in your shell configuration file (`$HOME/.bashrc`, `$HOME/.zshrc` or `$HOME/.config/fish/config.fish`).

### On Windows

```powershell
Remove-Item -Recurse -Force $env:PNPM_HOME
[Environment]::SetEnvironmentVariable('PNPM_HOME', $null, 'User')
```

If `PNPM_HOME` was added to your `Path`, remove that entry from your user environment variables as well.

If you used npm to install pnpm, then you should use npm to uninstall pnpm:

```
npm rm -g pnpm
```

## Removing the global content-addressable store

### On POSIX systems

```
rm -rf "$(pnpm store path)"
```

### On Windows

```powershell
Remove-Item -Recurse -Force (pnpm store path)
```

If you used pnpm in non-primary disks, then you must run the above command in every disk, where pnpm was used.
pnpm creates one store per disk.
