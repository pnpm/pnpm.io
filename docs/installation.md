---
id: installation
title: Installation
---

## Prerequisites

If you don't use the standalone script or `@pnpm/exe` to install pnpm, then you need to have Node.js (at least v22) to be installed on your system.

:::info

Looking for pnpm 12? It is currently in beta and installed differently from pnpm 11. See [Installing the pnpm 12 beta](#installing-the-pnpm-12-beta).

:::

## Using a standalone script

You may install pnpm even if you don't have Node.js installed, using the following scripts.

### On Windows

:::warning

Sometimes, Windows Defender may block our executable if you install pnpm this way.

Due to this issue, we currently recommend installing pnpm using [npm](#using-npm) or [Corepack](#using-corepack) on Windows.

:::

Using PowerShell:

```powershell
Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
```

On Windows, Microsoft Defender can significantly slow down installation of packages. You can add pnpm to Microsoft Defender's list
of excluded folders in a PowerShell window with administrator rights by executing:

```powershell
Add-MpPreference -ExclusionPath $(pnpm store path)
```

### On POSIX systems

:::warning Not supported on Intel macOS

On pnpm 11, the standalone script does not run on Intel Macs (`darwin-x64`). Use [npm](#using-npm), [Corepack](#using-corepack), or [Homebrew](#using-homebrew) instead. See [#11423](https://github.com/pnpm/pnpm/issues/11423) for context.

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

## Using Corepack

Due to an issue with [outdated signatures in Corepack](https://github.com/nodejs/corepack/issues/612), Corepack should be updated to its latest version first:

```
npm install --global corepack@latest
```

Since v16.13, Node.js is shipping [Corepack](https://nodejs.org/api/corepack.html) for managing package managers. This is an experimental feature, so you need to enable it by running:

:::info

If you have installed Node.js with `pnpm runtime` Corepack won't be installed on your system, you will need to install it separately. See [#4029](https://github.com/pnpm/pnpm/issues/4029).

:::

```
corepack enable pnpm
```

This will automatically install pnpm on your system.

You can pin the version of pnpm used on your project using the following command:

```
corepack use pnpm@latest-11
```

This will add a `"packageManager"` field in your local `package.json` which will instruct Corepack to always use a specific version on that project. This can be useful if you want reproducability, as all developers who are using Corepack will use the same version as you. When a new version of pnpm is released, you can re-run the above command.

:::warning

Corepack cannot install pnpm 12 yet. It expects the pnpm package to contain a `bin/pnpm.mjs` file, which the native pnpm 12 package does not have. Use [`pnpm self-update`](#pnpm-12-using-pnpm), [npm](#pnpm-12-using-npm), or the [standalone script](#pnpm-12-using-a-standalone-script) to install the beta.

:::

## Using other package managers

### Using npm

We provide two packages of pnpm CLI, `pnpm` and `@pnpm/exe`. On pnpm 12 the two are identical, so there is no reason to prefer one over the other; the difference below applies to pnpm 11.

- [`pnpm`](https://www.npmjs.com/package/pnpm) is an ordinary version of pnpm, which needs Node.js to run. Since v11, pnpm is distributed as pure ESM.
- [`@pnpm/exe`](https://www.npmjs.com/package/@pnpm/exe) is packaged with Node.js into an executable, so it may be used on a system with no Node.js installed. On Linux, glibc and musl builds are both provided and the right one is selected automatically; the glibc build requires glibc 2.27 or newer and `libatomic.so.1` (see [Linux runtime requirements](#on-posix-systems) for details). **Not available for Intel macOS** (`darwin-x64`) — install `pnpm` instead, see [#11423](https://github.com/pnpm/pnpm/issues/11423).

```sh
npx pnpm@latest-11 dlx @pnpm/exe@latest-11 setup
```

or

```sh
npm install -g pnpm@latest-11
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

## Installing the pnpm 12 beta

:::warning

pnpm 12 is a rewrite of pnpm in Rust and is currently in **beta**. It is not recommended for production use yet. Please [report any issues](https://github.com/pnpm/pnpm/issues) you run into.

:::

pnpm 12 has no intentional breaking changes compared to pnpm 11, so the rest of this documentation applies to both versions. Only installation differs while v12 is in beta: it is published under the `next-12` tag on npm and as a prerelease on GitHub, so Homebrew, winget, Scoop and Chocolatey don't offer it yet.

### Using pnpm {#pnpm-12-using-pnpm}

If you already have pnpm v11.10.0 or newer, this is the easiest way to switch:

```
pnpm self-update next-12
```

pnpm links the native binary directly, so nothing else is needed. Note that inside a project that pins pnpm through the `packageManager` field, [`self-update`] only updates that pin instead of installing pnpm globally.

### Using npm {#pnpm-12-using-npm}

If you don't have pnpm installed yet:

```sh
npm install -g --allow-scripts=pnpm pnpm@next-12
```

:::info

`--allow-scripts=pnpm` is required. The published package is a small wrapper whose `preinstall` script replaces it with the native binary for your platform, and recent versions of npm block install scripts by default. Without the flag, `pnpm` is left as a placeholder file that fails to run. For the same reason, don't install pnpm 12 with `--ignore-scripts` or `--no-optional`. If you install it with pnpm or Bun, allow the build scripts of the `pnpm` package.

:::

Node.js 18 or newer is needed to run that install script, but not to run pnpm afterwards — pnpm 12 is a native binary.

### Using a standalone script {#pnpm-12-using-a-standalone-script}

Set `PNPM_VERSION` to the exact beta version (the POSIX script does not accept npm dist-tags).

On POSIX systems:

```sh
curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=12.0.0-beta.2 sh -
```

On Windows, using PowerShell:

```powershell
$env:PNPM_VERSION="12.0.0-beta.2"; Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
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
