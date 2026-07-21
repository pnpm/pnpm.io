---
id: installation
title: Instalación
---

## Requisitos previos

If you don't use the standalone script or `@pnpm/exe` to install pnpm, then you need to have Node.js (at least v22) to be installed on your system.

## Usando el script autónomo

Puede instalar pnpm incluso si no tiene instalado Node.js, utilizando los siguientes scripts.

### Windows

:::warning

Sometimes, Windows Defender may block our executable if you install pnpm this way.

Due to this issue, we currently recommend installing pnpm using [npm](#using-npm) or [Corepack](#using-corepack) on Windows.

:::

Usando PowerShell:

```powershell
Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
```

On Windows, Microsoft Defender can significantly slow down installation of packages. You can add pnpm to Microsoft Defender's list of excluded folders in a PowerShell window with administrator rights by executing:

```powershell
Add-MpPreference -ExclusionPath $(pnpm store path)
```

### Sistemas POSIX

:::warning Not supported on Intel macOS

The standalone script does not run on Intel Macs (`darwin-x64`). Use [npm](#using-npm), [Corepack](#using-corepack), or [Homebrew](#using-homebrew) instead. See [#11423](https://github.com/pnpm/pnpm/issues/11423) for context.

:::

```sh
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

Si no tiene curl instalado, puede usar wget:

```sh
wget -qO- https://get.pnpm.io/install.sh | sh -
```

:::info Linux runtime requirements

The install script picks a glibc or musl build based on your system's libc, and a separate musl build is provided for Alpine and other musl-based distros. The glibc build requires glibc 2.27 or newer plus `libatomic.so.1` — both are present on most full distros but may be missing from minimal container images. If you see `error while loading shared libraries: libatomic.so.1`, install it with your distro's package manager:

- Debian/Ubuntu: `apt-get install -y libatomic1`
- Fedora/RHEL: `dnf install -y libatomic`

:::

:::tip

You may use the [pnpm runtime][] command then to install Node.js.

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

### Instalación de una versión específica

Antes de ejecutar el script de instalación, puede configurar opcionalmente una variable env `PNPM_VERSION` para instalar una versión específica de pnpm:

```sh
curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=<version> sh -
```

## Usando Corepack

Due to an issue with [outdated signatures in Corepack](https://github.com/nodejs/corepack/issues/612), Corepack should be updated to its latest version first:

```
npm install --global corepack@latest
```

Desde la v16.13, Node.js está distribuyendo [Corepack](https://nodejs.org/api/corepack.html) para administrar administradores de paquetes. Esta es una función experimental, por lo que debe habilitarla ejecutando:

:::info

If you have installed Node.js with `pnpm runtime` Corepack won't be installed on your system, you will need to install it separately. Consultar [#4029](https://github.com/pnpm/pnpm/issues/4029).

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

## Using other package managers

### Usando pnpm

We provide two packages of pnpm CLI, `pnpm` and `@pnpm/exe`.

- [`pnpm`](https://www.npmjs.com/package/pnpm) is an ordinary version of pnpm, which needs Node.js to run. Since v11, pnpm is distributed as pure ESM.
- [`@pnpm/exe`](https://www.npmjs.com/package/@pnpm/exe) se empaqueta con Node.js en un ejecutable, por lo que se puede utilizar en un sistema sin Node.js instalado. On Linux, glibc and musl builds are both provided and the right one is selected automatically; the glibc build requires glibc 2.27 or newer and `libatomic.so.1` (see [Linux runtime requirements](#on-posix-systems) for details). **Not available for Intel macOS** (`darwin-x64`) — install `pnpm` instead, see [#11423](https://github.com/pnpm/pnpm/issues/11423).

```sh
npx pnpm@latest-11 dlx @pnpm/exe@latest-11 setup
```

or

```sh
npm install -g pnpm@latest-11
```

### Usando Homebrew

If you have the package manager installed, you can install pnpm using the following command:

```
brew install pnpm
```

### Usando winget

If you have winget installed, you can install pnpm using the following command:

```
winget install -e --id pnpm.pnpm
```

### Usando Scoop

If you have Scoop installed, you can install pnpm using the following command:

```
scoop install nodejs-lts pnpm
```

### Usando Choco

If you have Chocolatey installed, you can install pnpm using the following command:

```
choco install pnpm
```

:::tip

Do you wanna use pnpm on CI servers? See: [Continuous Integration](./continuous-integration.md).

:::

## Compatibilidad

Here is a list of past pnpm versions with respective Node.js version support.

| Node.js    | pnpm 8 | pnpm 9 | pnpm 10 | pnpm 11 |
| ---------- | ------ | ------ | ------- | ------- |
| Node.js 14 | ❌      | ❌      | ❌       | ❌       |
| Node.js 16 | ✔️     | ❌      | ❌       | ❌       |
| Node.js 18 | ✔️     | ✔️     | ✔️      | ❌       |
| Node.js 20 | ✔️     | ✔️     | ✔️      | ❌       |
| Node.js 22 | ✔️     | ✔️     | ✔️      | ✔️      |
| Node.js 24 | ✔️     | ✔️     | ✔️      | ✔️      |
| Node.js 26 | ✔️     | ✔️     | ✔️      | ✔️      |

## Resolución de problemas

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

First, try to find the location of pnpm by running: `which pnpm`. If you're on Windows, run `where.exe pnpm.*`. You'll get the location of the pnpm command, for instance:

```
$ which pnpm
/c/Program Files/nodejs/pnpm
```

Now that you know where the pnpm CLI is, open that directory and remove any pnpm-related files (`pnpm.cmd`, `pnpx.cmd`, `pnpm`, etc). Once done, install pnpm again and it should work as expected.

## Updating pnpm

To update pnpm, run the [`self-update`][] command:

```
pnpm self-update
```

## Desinstalando pnpm

If you need to remove the pnpm CLI from your system and any files it has written to your disk, see [Uninstalling pnpm][].

[`self-update`]: ./cli/self-update.md

[Uninstalling pnpm]: ./uninstall.md
[pnpm runtime]: ./cli/runtime.md
