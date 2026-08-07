---
id: installation
title: 安裝
---

## 必要條件

如果您不想利用指令稿或 `@pnpm/exe` 來安裝 pnpm，則需先在電腦安裝 Node.js，最低版本需求為 18.12 版。

## 使用指令稿來安裝

即使沒有安裝 Node.js，您還是可以透過下面提供的指令稿來安裝 pnpm。

### Windows

:::warning

當您使用此方式安裝 pnpm 時，有時 Windows Defender 可能會封鎖我們的可執行檔。

由於此問題，目前我們推薦在 Windows 上透過 [npm](#使用-npm-來安裝) 或 [Corepack](#使用-corepack-來安裝) 來安裝 pnpm。

:::

使用 Powershell：

```powershell
$env:PNPM_VERSION = "10.33.4"; Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
```

On Windows, Microsoft Defender can significantly slow down installation of packages. You can add pnpm to Microsoft Defender's list
of excluded folders in a PowerShell window with administrator rights by executing:

```powershell
Add-MpPreference -ExclusionPath $(pnpm store path)
```

### POSIX 系統

```sh
curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=10.33.4 sh -
```

如果沒有安裝 curl，您也可以改用 wget：

```sh
wget -qO- https://get.pnpm.io/install.sh | env PNPM_VERSION=10.33.4 sh -
```

:::tip

接下來您可以使用 [pnpm env] 命令來安裝 Node.js 了。

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

### 安裝特定版本

在執行安裝指令稿之前，您可以設定 shell 變數 `PNPM_VERSION` 以安裝指定版本的 pnpm：

```sh
curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=<version> sh -
```

## 使用 Corepack 來安裝

Due to an issue with [outdated signatures in Corepack](https://github.com/nodejs/corepack/issues/612), Corepack should be updated to its latest version first:

```
npm install --global corepack@latest
```

自 v16.13 起，Node.js 推出了 [Corepack](https://nodejs.org/api/corepack.html)——管理套件管理器的工具。 因為這是試驗性功能，需執行此命令以啟用 Corepack：

:::info

如果您是以 `pnpm env` 安裝 Node.js，則不會順帶安裝 Corepack。如須使用 Corepack，則需另外安裝。 請參閱 [#4029](https://github.com/pnpm/pnpm/issues/4029)。

:::

```
corepack enable pnpm
```

它會在您的電腦上自動安裝 pnpm，

您可以使用此命令來釘選專案中使用的 pnpm 版本

```
corepack use pnpm@latest-10
```

這會在專案的 package.json 中加入 `"packageManager"` 欄位，指示 Corepack 在進入專案時選用特定版本。 此功能對於需強調可重現性時很有用，因為所有使用 Corepack 的開發者都使用與您相同的版本。 當新版 pnpm 推出時，您可以再次執行上述命令。

## 使用其他套件管理程式

### 使用 npm 來安裝

我們提供了兩個 pnpm CLI 包裝， `pnpm` 和 `@pnpm/exe`。

- 一般版本的 [`pnpm`](https://www.npmjs.com/package/pnpm) 需要 Node.js 才能執行。
- [`@pnpm/exe`](https://www.npmjs.com/package/@pnpm/exe) 則與 Node.js 一起包成一個可執行檔，所以可以用於沒有安裝 Node.js 的系統上。

```sh
npx pnpm@latest-10 dlx @pnpm/exe@latest-10 setup
```

或

```sh
npm install -g pnpm@latest-10
```

### 使用 Homebrew

如果您已安裝 Homebrew 套件管理器，可以使用下列命令來安裝 pnpm

```
brew install pnpm
```

### 使用 winget 來安裝

如果您已安裝 winget，可以使用此命令來安裝 pnpm

```
winget install -e --id pnpm.pnpm
```

### 使用 Scoop

如果您已安裝 Scoop，可以透過以下命令安裝 pnpm

```
scoop install nodejs-lts pnpm
```

### 使用 Choco 來安裝

如果您已安裝 Choco，可以使用此命令來安裝 pnpm

```
choco install pnpm
```

### 使用 Volta 來安裝

如果您已安裝 Volta，可以使用此命令來安裝 pnpm

```
volta install pnpm
```

:::tip

您想在 CI 伺服器上使用 pnpm 嗎？ 請參閱[持續整合 (Continuous Integration)](#continuous-integration)。

:::

## 相容性

此表列出過去的 pnpm 與對應 Node.js 版本的相容性：

| Node.js    | pnpm 8 | pnpm 9 | pnpm 10 |
| -------------------------- | ------ | ------ | ------- |
| Node.js 14 | ❌      | ❌      | ❌       |
| Node.js 16 | ✔️     | ❌      | ❌       |
| Node.js 18 | ✔️     | ✔️     | ✔️      |
| Node.js 20 | ✔️     | ✔️     | ✔️      |
| Node.js 22 | ✔️     | ✔️     | ✔️      |
| Node.js 24 | ✔️     | ✔️     | ✔️      |

## 疑難排解

如果 pnpm 損毀且無法透過重新安裝來修復，您需手動將它移出 PATH。

假設您在執行 `pnpm install` 命令時遇到了此錯誤訊息：

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

首先，請嘗試執行 `which npm` 來尋找 pnpm 存放的位置。 If you're on Windows, run `where.exe pnpm.*`.
您將取得 pnpm 命令的位置，例如:

```
$ which pnpm
/c/Program Files/nodejs/pnpm
```

現在已經知道 pnpm CLI 存放的位置，請打開該資料夾並移除所有與 pnpm 有關的檔案（如 `pnpm.cmd`、`pnpx.cmd`、`pnpm` 等等）。
完成後再重新安裝 pnpm，應該就恢復正常了。

## 使用較短的別名

輸入 `pnpm` 太麻煩嗎？您可以改用 `pn` 作為別名。

#### 在 POSIX 系統中加入永久別名

將這行加入 shell 的設定檔 `.bashrc`、`.zshrc` 或 `config.fish` 就完成了：

```
alias pn=pnpm
```

#### 在 Powershell 中加入永久別名 (Windows)：

以系統管理員權限開啟 Powershell 視窗並執行此命令：

```
notepad $profile.AllUsersAllHosts
```

接著會打開 `profile.ps1` 檔案，在裡頭加上：

```
set-alias -name pn -value pnpm
```

存檔後關閉視窗。 您可能需要關閉其他還開啟的 Powershell 視窗，才能讓此別名設定生效。

## 更新 pnpm

如要更新 pnpm，請執行 [`self-update`] 命令：

```
pnpm self-update
```

[`self-update`]: ./cli/self-update.md

## 解除安裝 pnpm

如果需要從系統中移除 pnpm 及其寫入磁碟的所有檔案，請參閱 \[解除安裝 pnpm]。

[Uninstalling pnpm]: ./uninstall.md
[pnpm env]: ./cli/env.md
