---
id: installation
title: Instalação
---

## Pré-requisitos

If you don't use the standalone script or `@pnpm/exe` to install pnpm, then you need to have Node.js (at least v18.12) to be installed on your system.

## Usando um script autônomo

Você pode usar o pnpm mesmo que você não tenha o Node.js instalando, usando os seguintes scripts.

### No Windows

:::warning

Sometimes, Windows Defender may block our executable if you install pnpm this way.

Due to this issue, we currently recommend installing pnpm using [npm](#using-npm) or [Corepack](#using-corepack) on Windows.

:::

Usando o PowerShell:

```powershell
$env:PNPM_VERSION = "10.33.4"; Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
```

On Windows, Microsoft Defender can significantly slow down installation of packages. You can add pnpm to Microsoft Defender's list
of excluded folders in a PowerShell window with administrator rights by executing:

```powershell
Add-MpPreference -ExclusionPath $(pnpm store path)
```

### Nos sistemas POSIX

```sh
curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=10.33.4 sh -
```

Se vocẽ não tiver o curl instalado, você pode usar o wget:

```sh
wget -qO- https://get.pnpm.io/install.sh | env PNPM_VERSION=10.33.4 sh -
```

:::tip

You may use the [pnpm env] command then to install Node.js.

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

### Instalando uma versão específica

Prior to running the install script, you may optionally set an env variable `PNPM_VERSION` to install a specific version of pnpm:

```sh
curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=<version> sh -
```

## Usando Corepack

Due to an issue with [outdated signatures in Corepack](https://github.com/nodejs/corepack/issues/612), Corepack should be updated to its latest version first:

```
npm install --global corepack@latest
```

Since v16.13, Node.js is shipping [Corepack](https://nodejs.org/api/corepack.html) for managing package managers. Esta é uma ferramenta experimental, então você precisa habilitá-la com o seguinte comando:

:::info

If you have installed Node.js with `pnpm env` Corepack won't be installed on your system, you will need to install it separately. See [#4029](https://github.com/pnpm/pnpm/issues/4029).

:::

```
corepack enable pnpm
```

This will automatically install pnpm on your system.

You can pin the version of pnpm used on your project using the following command:

```
corepack use pnpm@latest-10
```

This will add a `"packageManager"` field in your local `package.json` which will instruct Corepack to always use a specific version on that project. This can be useful if you want reproducability, as all developers who are using Corepack will use the same version as you. When a new version of pnpm is released, you can re-run the above command.

## Using other package managers

### Usando npm

We provide two packages of pnpm CLI, `pnpm` and `@pnpm/exe`.

- [`pnpm`](https://www.npmjs.com/package/pnpm) is an ordinary version of pnpm, which needs Node.js to run.
- [`@pnpm/exe`](https://www.npmjs.com/package/@pnpm/exe) is packaged with Node.js into an executable, so it may be used on a system with no Node.js installed.

```sh
npx pnpm@latest-10 dlx @pnpm/exe@latest-10 setup
```

or

```sh
npm install -g pnpm@latest-10
```

### Usando Homebrew

If you have the package manager installed, you can install pnpm using the following command:

```
brew install pnpm
```

### Usando o winget

If you have winget installed, you can install pnpm using the following command:

```
winget install -e --id pnpm.pnpm
```

### Usando o Scoop

If you have Scoop installed, you can install pnpm using the following command:

```
scoop install nodejs-lts pnpm
```

### Usando o Choco

If you have Chocolatey installed, you can install pnpm using the following command:

```
choco install pnpm
```

### Using Volta

If you have Volta installed, you can install pnpm using the following command:

```
volta install pnpm
```

:::tip

Do you wanna use pnpm on CI servers? See: [Continuous Integration](./continuous-integration.md).

:::

## Compatibility

Here is a list of past pnpm versions with respective Node.js version support.

| Node.js    | pnpm 8 | pnpm 9 | pnpm 10 |
| -------------------------- | ------ | ------ | ------- |
| Node.js 14 | ❌      | ❌      | ❌       |
| Node.js 16 | ✔️     | ❌      | ❌       |
| Node.js 18 | ✔️     | ✔️     | ✔️      |
| Node.js 20 | ✔️     | ✔️     | ✔️      |
| Node.js 22 | ✔️     | ✔️     | ✔️      |
| Node.js 24 | ✔️     | ✔️     | ✔️      |

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

## Using a shorter alias

`pnpm` might be hard to type, so you may use a shorter alias like `pn` instead.

#### Como adicionar um alias permanente em sistemas POSIX

Just put the following line to your `.bashrc`, `.zshrc`, or `config.fish`:

```
alias pn=pnpm
```

#### Adicionando um alias permanente no Powershell (Windows):

Em uma janela do Powershell com direitos de administrador, execute:

```
notepad $profile.AllUsersAllHosts
```

In the `profile.ps1` file that opens, put:

```
set-alias -name pn -value pnpm
```

Salve o arquivo e feche a janela. Pode ser necessário fechar qualquer janela aberta do Powershell para que o alias comece a funcionar.

## Updating pnpm

To update pnpm, run the [`self-update`] command:

```
pnpm self-update
```

[`self-update`]: ./cli/self-update.md

## Desinstalando o pnpm

If you need to remove the pnpm CLI from your system and any files it has written to your disk, see [Uninstalling pnpm].

[Uninstalling pnpm]: ./uninstall.md
[pnpm env]: ./cli/env.md
