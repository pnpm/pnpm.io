---
id: feature-comparison
title: 功能比较
---

| 功能                     |         pnpm         |         Yarn         |         npm          | 备注                                                   |
| ---------------------- |:--------------------:|:--------------------:|:--------------------:| ---------------------------------------------------- |
| [工作空间支持][]             | :white_check_mark: | :white_check_mark: | :white_check_mark: |                                                      |
| 隔离的 `node_modules`     | :white_check_mark: | :white_check_mark: | :white_check_mark: | pnpm 中的默认值。                                          |
| [提升的 `node_modules`][] | :white_check_mark: | :white_check_mark: | :white_check_mark: | npm 中的默认值。                                           |
| Plug'n'Play            | :white_check_mark: | :white_check_mark: |         :x:          | Yarn 中的默认值。                                          |
| [自动安装对等依赖][]           | :white_check_mark: |         :x:          | :white_check_mark: |                                                      |
| 零安装                    |         :x:          | :white_check_mark: |         :x:          |                                                      |
| [修补依赖项][]              | :white_check_mark: | :white_check_mark: |         :x:          |                                                      |
| [管理运行时][]              | :white_check_mark: |         :x:          |         :x:          |                                                      |
| [管理自身的版本][]            | :white_check_mark: | :white_check_mark: |         :x:          |                                                      |
| 拥有锁文件                  | :white_check_mark: | :white_check_mark: | :white_check_mark: | `pnpm-lock.yaml`， `yarn.lock`， `package-lock.json`。  |
| [支持覆盖][]               | :white_check_mark: | :white_check_mark: | :white_check_mark: | 在 Yarn 中称为“resolutions”。                             |
| 内容可寻址存储                | :white_check_mark: | :white_check_mark: |         :x:          | 当 `nodeLinker` 设置为 `pnpm`时，Yarn 使用 内容可寻址存储。          |
| [动态包执行][]              | :white_check_mark: | :white_check_mark: | :white_check_mark: | `pnpm dlx`, `yarn dlx`, `npx`。                       |
| [副作用缓存][]              | :white_check_mark: |         :x:          |         :x:          |                                                      |
| [Catalogs][]           | :white_check_mark: |         :x:          |         :x:          |                                                      |
| [配置依赖项][]              | :white_check_mark: |         :x:          |         :x:          |                                                      |
| [JSR 软件源支持][]          | :white_check_mark: | :white_check_mark: |         :x:          |                                                      |
| [脚本运行前自动安装][]          | :white_check_mark: |         :x:          |         :x:          | 在 Yarn 中，即插即用（Plug'n'Play）可确保依赖项始终保持最新。              |
| [钩子][]                 | :white_check_mark: | :white_check_mark: |         :x:          |                                                      |
| [构建脚本安全性][]            | :white_check_mark: |         :x:          |         :x:          |                                                      |
| [SBOM 生成][]            | :white_check_mark: |         :x:          | :white_check_mark: | `pnpm sbom`, `npm sbom`.                             |
| [列出许可证][]              | :white_check_mark: | :white_check_mark: |         :x:          | pnpm 通过 `pnpm licenses list` 支持它。 Yarn 有一个插件来支持这个功能。 |

**注意：** 为了保持相对简洁，我们只包含可能会经常使用的功能。

[脚本运行前自动安装]: ./settings.md#verifydepsbeforerun
[自动安装对等依赖]: ./settings.md#autoinstallpeers
[Catalogs]: ./catalogs.md
[配置依赖项]: ./config-dependencies.md
[动态包执行]: ./cli/pnx.md
[提升的 `node_modules`]: ./settings.md#nodelinker
[JSR 软件源支持]: ./cli/add.md#install-from-the-jsr-registry
[列出许可证]: ./cli/licenses.md
[构建脚本安全性]: ./settings.md#allowbuilds
[管理运行时]: ./cli/runtime.md
[管理自身的版本]: ./settings.md#managepackagemanagerversions
[支持覆盖]: ./settings.md#overrides
[修补依赖项]: ./cli/patch.md
[SBOM 生成]: ./cli/sbom.md
[副作用缓存]: ./settings.md#sideeffectscache
[工作空间支持]: ./workspaces.md
[钩子]: ./pnpmfile.md
