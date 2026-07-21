---
id: feature-comparison
title: 功能比较
---

| 功能                                           |                                             pnpm                                             |                                             Yarn                                             |                                              npm                                             | 备注                                                                  |
| -------------------------------------------- | :------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------: | ------------------------------------------------------------------- |
| [工作空间支持][Workspace support]                  | :white_check_mark: | :white_check_mark: | :white_check_mark: |                                                                     |
| 隔离的 `node_modules`                           | :white_check_mark: | :white_check_mark: | :white_check_mark: | pnpm 中的默认值。                                                         |
| [提升的 `node_modules`][Hoisted `node_modules`] | :white_check_mark: | :white_check_mark: | :white_check_mark: | npm 中的默认值。                                                          |
| Plug'n'Play                                  | :white_check_mark: | :white_check_mark: |                              :x:                             | Yarn 中的默认值。                                                         |
| [自动安装对等依赖][Autoinstalling peers]             | :white_check_mark: |                              :x:                             | :white_check_mark: |                                                                     |
| 零安装                                          |                              :x:                             | :white_check_mark: |                              :x:                             |                                                                     |
| [修补依赖项][Patching dependencies]               | :white_check_mark: | :white_check_mark: |                              :x:                             |                                                                     |
| [管理 Node.js 版本][Managing Node.js versions]   | :white_check_mark: |                              :x:                             |                              :x:                             |                                                                     |
| [Managing versions of itself]                | :white_check_mark: | :white_check_mark: |                              :x:                             |                                                                     |
| 拥有锁文件                                        | :white_check_mark: | :white_check_mark: | :white_check_mark: | `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`. |
| [覆盖支持][Overrides support]                    | :white_check_mark: | :white_check_mark: | :white_check_mark: | 在 Yarn 中称为 “resolutions”。                                           |
| 内容可寻址存储                                      | :white_check_mark: | :white_check_mark: |                              :x:                             | 当 `nodeLinker` 设置为 `pnpm` 时，Yarn 使用 CAS 。                           |
| [动态包执行][Dynamic package execution]           | :white_check_mark: | :white_check_mark: | :white_check_mark: | `pnpm dlx`, `yarn dlx`, `npx`.                      |
| [副作用缓存][Side-effects cache]                  | :white_check_mark: |                              :x:                             |                              :x:                             |                                                                     |
| [目录][Catalogs]                               | :white_check_mark: |                              :x:                             |                              :x:                             |                                                                     |
| [配置依赖项][Config dependencies]                 | :white_check_mark: |                              :x:                             |                              :x:                             |                                                                     |
| [JSR 软件源支持][JSR registry support]            | :white_check_mark: | :white_check_mark: |                              :x:                             |                                                                     |
| [脚本运行前自动安装][Auto-install before script run]  | :white_check_mark: |                              :x:                             |                              :x:                             | 依赖项在 Yarn 中，即插即用（Plug'n'Play）可确保依赖项始终保持最新。                          |
| [钩子][Hooks]                                  | :white_check_mark: | :white_check_mark: |                              :x:                             |                                                                     |
| [列出许可证][Listing licenses]                    | :white_check_mark: | :white_check_mark: |                              :x:                             | pnpm 通过 `pnpm licenses list` 支持它。 Yarn 有一个插件来支持这个功能。                |

[Auto-install before script run]: ./settings.md#verifydepsbeforerun
[Autoinstalling peers]: ./settings.md#autoinstallpeers
[Catalogs]: ./catalogs.md
[Config dependencies]: ./config-dependencies.md
[Dynamic package execution]: ./cli/dlx.md
[Hoisted `node_modules`]: ./settings.md#nodelinker
[JSR registry support]: ./cli/add.md#install-from-the-jsr-registry
[Listing licenses]: ./cli/licenses.md
[Managing Node.js versions]: ./cli/env.md
[Managing versions of itself]: ./settings.md#managepackagemanagerversions
[Overrides support]: ./settings.md#overrides
[Patching dependencies]: ./cli/patch.md
[Side-effects cache]: ./settings.md#sideeffectscache
[Workspace support]: ./workspaces.md
[hooks]: ./pnpmfile.md

\*\*注意：\*\*为了保持比较简洁，我们只包含可能经常使用的功能。
