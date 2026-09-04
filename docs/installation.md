---
id: installation
title: Installation
---

## Prerequisites

If you don't use the standalone script or `@pnpm/exe` to install pnpm, then you need to have Node.js (at least v22) to be installed on your system.

:::info

Looking for pnpm 12? It is released, but `latest` on npm is still pnpm 11, so it is installed differently. See [Installing pnpm 12](#installing-pnpm-12).

:::

## Using a standalone script

You may install pnpm even if you don't have Node.js installed, using the following scripts.

### On Windows

:::warning

Sometimes, Windows Defender may block our executable if you install pnpm this way.

Due to this issue, we currently recommend installing pnpm using [npm](#using-npm) on Windows.

:::

Using PowerShell:

```powershell
irm https://get.pnpm.io/install.ps1 | iex
```

On Windows, Microsoft Defender can significantly slow down installation of packages. You can add pnpm to Microsoft Defender's list
of excluded folders in a PowerShell window with administrator rights by executing:

```powershell
Add-MpPreference -ExclusionPath $(pnpm store path)
```

### On POSIX systems

:::warning Not supported on Intel macOS in pnpm 11

On pnpm 11, the standalone script does not run on Intel Macs (`darwin-x64`). Use [Homebrew](#using-homebrew), or install pnpm 12, which ships an Intel build. See [#11423](https://github.com/pnpm/pnpm/issues/11423) for context.

pnpm 12 ships an Intel macOS build again, so this limitation doesn't apply to it.

:::

```sh
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

If you don't have curl installed, you would like to use wget:

```sh
wget -qO- https://get.pnpm.io/install.sh | sh -
```

:::info Linux runtime requirements

The install script picks a glibc or musl build based on your system's libc, and a separate musl build is provided for Alpine and other musl-based distros. The glibc build requires glibc 2.27 or newer plus `libatomic.so.1` — both are present on most full distros but may be missing from minimal container images. If you see `error while loading shared libraries: libatomic.so.1`, install it with your distro's package manager:

- Debian/Ubuntu: `apt-get install -y libatomic1`
- Fedora/RHEL: `dnf install -y libatomic`

:::

:::tip

You may use the [pnpm runtime] command then to install Node.js.

:::

### In a Docker container

```sh
# bash
wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -
# sh
wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh -
# dash
wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.dashrc" SHELL="$(which dash)" dash -
```

### Installing a specific version

Prior to running the install script, you may optionally set an env variable `PNPM_VERSION` to install a specific version of pnpm:

```sh
curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=<version> sh -
```

## Using other package managers

### Using npm

```sh
npx get-pnpm
```

### Using Homebrew

If you have the package manager installed, you can install pnpm using the following command:

```
brew install pnpm
```

### Using winget

If you have winget installed, you can install pnpm using the following command:

```
winget install -e --id pnpm.pnpm
```

### Using Scoop

If you have Scoop installed, you can install pnpm using the following command:

```
scoop install nodejs-lts pnpm
```

### Using Choco

If you have Chocolatey installed, you can install pnpm using the following command:

```
choco install pnpm
```

:::tip

Do you wanna use pnpm on CI servers? See: [Continuous Integration](./continuous-integration.md).

:::

## Installing pnpm 12

pnpm 12, the Rust rewrite, is stable since v12.0.0 (August 26, 2026). Please [report any issues](https://github.com/pnpm/pnpm/issues) you run into.

Apart from a short list of differences, pnpm 12 does not change the way you use pnpm 11, so the rest of this documentation applies to both versions — see [What's different in pnpm 12](/blog/whats-different-in-pnpm-12). Only installation differs: `latest` on npm still points at the pnpm 11 line, so pnpm 12 is installed from the `next-12` tag, and Homebrew, winget, Scoop and Chocolatey don't offer it yet.

### Using pnpm {#pnpm-12-using-pnpm}

If you already have pnpm v11.10.0 or newer, this is the easiest way to switch:

```
pnpm self-update next-12
```

pnpm links the native binary directly, so nothing else is needed. Note that inside a project that pins pnpm through the `packageManager` field, [`self-update`] only updates that pin instead of installing pnpm globally.

### Using npm {#pnpm-12-using-npm}

If you don't have pnpm installed yet:

```sh
npx get-pnpm next-12
```

Node.js 22.13 or newer is needed to run that install script, but not to run pnpm afterwards — pnpm 12 is a native binary.

### Using a standalone script {#pnpm-12-using-a-standalone-script}

Set `PNPM_VERSION` to `next-12`, or to an exact version.

On POSIX systems:

```sh
curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=next-12 sh -
```

On Windows, using PowerShell:

```powershell
$env:PNPM_VERSION="next-12"; Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
```

This installs pnpm without requiring Node.js, and unlike pnpm 11 it also works on Intel macOS.

## Compatibility

Here is a list of past pnpm versions with respective Node.js version support.

| Node.js    | pnpm 8 | pnpm 9 | pnpm 10 | pnpm 11 | pnpm 12 |
|------------|--------|--------|---------|---------|---------|
| Node.js 14 | ❌     | ❌     | ❌      | ❌      | ❌      |
| Node.js 16 | ✔️      | ❌     | ❌      | ❌      | ❌      |
| Node.js 18 | ✔️      | ✔️      | ✔️       | ❌      | ✔️       |
| Node.js 20 | ✔️      | ✔️      | ✔️       | ❌      | ✔️       |
| Node.js 22 | ✔️      | ✔️      | ✔️       | ✔️       | ✔️       |
| Node.js 24 | ✔️      | ✔️      | ✔️       | ✔️       | ✔️       |
| Node.js 26 | ✔️      | ✔️      | ✔️       | ✔️       | ✔️       |

pnpm 12 only needs Node.js when it is installed from npm; the version installed by the standalone script runs without Node.js.

## Troubleshooting

If pnpm is broken and you cannot fix it by reinstalling, you might need to remove it manually from the PATH.

Let's assume you have the following error when running `pnpm install`:

```
C:\src>pnpm install
internal/modules/cjs/loader.js:883
  throw err;
  ^



Error: Cannot find module 'C:\Users\Bence\AppData\Roaming\npm\pnpm-global\4\node_modules\pnpm\bin\pnpm.js'
←[90m    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:880:15)←[39m
←[90m    at Function.Module._load (internal/modules/cjs/loader.js:725:27)←[39m
←[90m    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:72:12)←[39m
←[90m    at internal/main/run_main_module.js:17:47←[39m {
  code: ←[32m'MODULE_NOT_FOUND'←[39m,
  requireStack: []
}
```

First, try to find the location of pnpm by running: `which pnpm`. If you're on Windows, run `where.exe pnpm.*`.
You'll get the location of the pnpm command, for instance:

```
$ which pnpm
/c/Program Files/nodejs/pnpm
```

Now that you know where the pnpm CLI is, open that directory and remove any pnpm-related files (`pnpm.cmd`, `pnpx.cmd`, `pnpm`, etc).
Once done, install pnpm again and it should work as expected.

## Updating pnpm

To update pnpm, run the [`self-update`] command:

```
pnpm self-update
```

[`self-update`]: ./cli/self-update.md

## Uninstalling pnpm

If you need to remove the pnpm CLI from your system and any files it has written to your disk, see [Uninstalling pnpm].

[Uninstalling pnpm]: ./uninstall.md
[pnpm runtime]: ./cli/runtime.md
