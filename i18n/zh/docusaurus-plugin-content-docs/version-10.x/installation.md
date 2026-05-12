---
id: installation
title: 安装
---

## 前言

如果你不使用独立脚本或 `@pnpm/exe` 来安装 pnpm，那么你需要在你的系统上安装 Node.js (至少 v18.12)。

## 使用独立脚本安装

即使没有安装 Node.js，也可以使用以下脚本安装 pnpm。

### 在 Windows 上

:::warning

如果你以这种方式安装 pnpm，Windows Defender 有时可能会阻止我们的可执行文件。

由于此问题，我们目前建议在 Windows 上使用 [npm](#使用-npm) 或 [Corepack](#使用-corepack) 安装 pnpm。

:::

使用 PowerShell：

```powershell
$env:PNPM_VERSION = "10.33.4"; Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
```

在 Windows 上，Microsoft Defender 会显著减慢软件包的安装速度。 你可以通过在具有管理员权限的 PowerShell 窗口中执行以下命令，将 pnpm 添加到 Microsoft Defender 的排除文件夹列表中：

```powershell
Add-MpPreference -ExclusionPath $(pnpm store path)
```

### 在 POSIX 系统上

```sh
curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=10.33.4 sh -
```

如果你没有安装 curl，也可以使用 wget：

```sh
wget -qO- https://get.pnpm.io/install.sh | env PNPM_VERSION=10.33.4 sh -
```

:::tip

你可以使用 [pnpm env] 命令来安装 Node.js。

:::

### 在 Docker 容器中

```sh
# bash
wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -
# sh
wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh -
# dash
wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.dashrc" SHELL="$(which dash)" dash -
```

### 安装特定版本

在运行安装脚本之前，你可以选择设置环境变量 `PNPM_VERSION` 来安装特定版本的 pnpm：

```sh
curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=<version> sh -
```

## 使用 Corepack

由于 [Corepack 中的签名过时](https://github.com/nodejs/corepack/issues/612) 问题，请先将 Corepack 更新至最新版本：

```
npm install --global corepack@latest
```

从 v16.13 开始，Node.js 附带 [Corepack](https://nodejs.org/api/corepack.html) 用于管理包管理器。 这是一项实验性功能，因此你需要通过运行如下脚本来启用它：

:::info

如果你已使用 `pnpm env` 安装 Node.js，则 Corepack 不会被安装在你的系统上，你需要单独安装它。 请参阅 [#4029](https://github.com/pnpm/pnpm/issues/4029)。

:::

```
corepack enable pnpm
```

这会自动将 pnpm 安装在你的系统上。

你可以通过下列命令固定项目所用的 pnpm 版本：

```
corepack use pnpm@latest-10
```

这会添加一个 `packageManager` 字段到你本地的 `package.json`，指示 Corepack 始终在该项目上使用特定的版本。 如果你想要可复现性，这可能很有用，因为所有使用 Corepack 的开发人员都将使用与你相同的版本。 当一个新版本的 pnpm 发布时，你可以重新运行上述命令。

## 使用其他包管理器

### 使用 npm

我们提供了两个 pnpm CLI 包， `pnpm` 和 `@pnpm/exe`。

- [`pnpm`](https://www.npmjs.com/package/pnpm) 是 pnpm 的普通版本，需要 Node.js 才能运行。
- `@pnpm/exe` 与 Node.js 一起打包成可执行文件，因此它可以在没有安装 Node.js 的系统上使用。

```sh
npx pnpm@latest-10 dlx @pnpm/exe@latest-10 setup
```

或者

```sh
npm install -g pnpm@latest-10
```

### 使用 HomeBrew

如果你已经安装了这个包管理器，你可以使用下面的命令安装 pnpm：

```
brew install pnpm
```

### 使用 winget

如果你安装了 winget ，你可以使用以下命令安装 pnpm：

```
winget install -e --id pnpm.pnpm
```

### 使用 Scoop

如果你已经安装了 Scoop，你可以使用下面的指令安装 pnpm：

```
scoop install nodejs-lts pnpm
```

### 使用 Choco

如果你已经安装了 Chocolatey，你可以使用下面的指令安装 pnpm：

```
choco install pnpm
```

### 使用 Volta

如果你安装了 Volta ，你可以使用以下命令安装 pnpm：

```
volta install pnpm
```

:::tip

你想在 CI 服务器上使用 pnpm 吗？ 参见：[持续集成](./continuous-integration.md)。

:::

## 兼容性

以下是各版本 pnpm 与各版本 Node.js 之间的兼容性表格。

| Node.js    | pnpm 8 | pnpm 9 | pnpm 10 |
| -------------------------- | ------ | ------ | ------- |
| Node.js 14 | ❌      | ❌      | ❌       |
| Node.js 16 | ✔️     | ❌      | ❌       |
| Node.js 18 | ✔️     | ✔️     | ✔️      |
| Node.js 20 | ✔️     | ✔️     | ✔️      |
| Node.js 22 | ✔️     | ✔️     | ✔️      |
| Node.js 24 | ✔️     | ✔️     | ✔️      |

## 问题排查

如果 pnpm 损坏并且你无法通过重新安装来修复，你可能需要将其从 PATH 中手动删除。

假设你在运行 `pnpm install` 时遇到以下错误：

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

首先，尝试通过运行 `which pnpm` 来找到 pnpm 的位置。 如果你使用的是 Windows，请运行 `where.exe pnpm.*`。
你将获得 pnpm 命令的位置，例如：

```
$ which pnpm
/c/Program Files/nodejs/pnpm
```

现在你已经知道了 pnpm CLI 的所在目录，打开它并删除所有与 pnpm 相关的文件（如 `pnpm.cmd`、 `pnpx.cmd`、 `pnpm` 等）。
完成后，再次安装 pnpm。现在它应该按照预期正常工作。

## 使用较短的别名

`pnpm` 可能较难输入，你也可以使用更短的别名，如 `pn`。

#### 在 POSIX 系统上添加永久别名

只需将下面这行代码加入你的 `.bashrc`，`.zshrc`，或 `config.fish`：

```
alias pn=pnpm
```

#### 在 Powershell (Windows) 中添加永久别名：

在具有管理员权限的 Powershell 窗口中执行：

```
notepad $profile.AllUsersAllHosts
```

在打开的 `profile.ps1` 文件中，输入：

```
set-alias -name pn -value pnpm
```

保存文件并关闭窗口。 你可能需要关闭所有打开的 Powershell 窗口才能使别名生效。

## 更新 pnpm

要更新 pnpm，请运行 [`self-update`] 命令：

```
pnpm self-update
```

[`self-update`]: ./cli/self-update.md

## 卸载 pnpm

如果你需要从系统中删除 pnpm CLI 以及它写入磁盘的任何文件，请参阅[卸载 pnpm][Uninstalling pnpm]。

[Uninstalling pnpm]: ./uninstall.md
[pnpm env]: ./cli/env.md
