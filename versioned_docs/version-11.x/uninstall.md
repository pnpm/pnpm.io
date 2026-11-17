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

```sh
rm -rf "$PNPM_HOME"
```

You might also want to clean the `PNPM_HOME` env variable in your shell configuration file (`$HOME/.bashrc`, `$HOME/.zshrc`, `$HOME/.config/fish/config.fish`, or `$HOME/.config/powershell/profile.ps1`).

### On Windows

In PowerShell:

```powershell
Remove-Item -Recurse -Force -LiteralPath $env:PNPM_HOME
```

You may also want to remove the `PNPM_HOME` environment variable from your user environment and delete it from your `Path`:

```powershell
[Environment]::SetEnvironmentVariable('PNPM_HOME', $null, 'User')
```

If you used npm to install pnpm, then you should use npm to uninstall pnpm:

```sh
npm rm -g pnpm
```

## Removing the global content-addressable store

### On POSIX systems

```sh
rm -rf "$(pnpm store path)"
```

### On Windows

In PowerShell:

```powershell
Remove-Item -Recurse -Force -LiteralPath (pnpm store path)
```

If you used pnpm in non-primary disks, then you must run the above command in every disk, where pnpm was used.
pnpm creates one store per disk.
