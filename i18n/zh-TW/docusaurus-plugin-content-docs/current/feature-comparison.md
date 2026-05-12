---
id: feature-comparison
title: 功能比較
---

| 功能                                 |         pnpm         |         Yarn         |         npm          | Notes                                                                |
| ---------------------------------- |:--------------------:|:--------------------:|:--------------------:| -------------------------------------------------------------------- |
| [工作區支援][]                          | :white_check_mark: | :white_check_mark: | :white_check_mark: |                                                                      |
| 隔離式 `node_modules` 資料夾             | :white_check_mark: | :white_check_mark: | :white_check_mark: | Default in pnpm.                                                     |
| [提升式 `node_modules` 資料夾][]         | :white_check_mark: | :white_check_mark: | :white_check_mark: | Default in npm.                                                      |
| 隨插即用                               | :white_check_mark: | :white_check_mark: |         :x:          | Default in Yarn.                                                     |
| [自動安裝同儕節點][]                       | :white_check_mark: |         :x:          | :white_check_mark: |                                                                      |
| 零安裝                                |         :x:          | :white_check_mark: |         :x:          |                                                                      |
| [修補相依性][]                          | :white_check_mark: | :white_check_mark: |         :x:          |                                                                      |
| [Managing runtimes][]              | :white_check_mark: |         :x:          |         :x:          |                                                                      |
| [Managing versions of itself][]    | :white_check_mark: | :white_check_mark: |         :x:          |                                                                      |
| 有 lockfile                         | :white_check_mark: | :white_check_mark: | :white_check_mark: | `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`.                  |
| [覆寫支援][]                           | :white_check_mark: | :white_check_mark: | :white_check_mark: | Known as "resolutions" in Yarn.                                      |
| 內容可定址存放區                           | :white_check_mark: | :white_check_mark: |         :x:          | Yarn uses a CAS when `nodeLinker` is set to `pnpm`.                  |
| [動態套件執行][]                         | :white_check_mark: | :white_check_mark: | :white_check_mark: | `pnpm dlx`, `yarn dlx`, `npx`.                                       |
| [副作用快取][]                          | :white_check_mark: |         :x:          |         :x:          |                                                                      |
| [Catalogs][]                       | :white_check_mark: |         :x:          |         :x:          |                                                                      |
| [Config dependencies][]            | :white_check_mark: |         :x:          |         :x:          |                                                                      |
| [JSR registry support][]           | :white_check_mark: | :white_check_mark: |         :x:          |                                                                      |
| [Auto-install before script run][] | :white_check_mark: |         :x:          |         :x:          | In Yarn, Plug'n'Play ensures dependencies are always up to date.     |
| [Hooks][]                          | :white_check_mark: | :white_check_mark: |         :x:          |                                                                      |
| [Build script security][]          | :white_check_mark: |         :x:          |         :x:          |                                                                      |
| [SBOM generation][]                | :white_check_mark: |         :x:          | :white_check_mark: | `pnpm sbom`, `npm sbom`.                                             |
| [列出授權方式][]                         | :white_check_mark: | :white_check_mark: |         :x:          | pnpm supports it via `pnpm licenses list`. Yarn has a plugin for it. |

**Note:** To keep the comparison concise, we include only features likely to be used frequently.

[Auto-install before script run]: ./settings.md#verifydepsbeforerun
[自動安裝同儕節點]: ./settings.md#autoinstallpeers
[Catalogs]: ./catalogs.md
[Config dependencies]: ./config-dependencies.md
[動態套件執行]: ./cli/pnx.md
[提升式 `node_modules` 資料夾]: ./settings.md#nodelinker
[JSR registry support]: ./cli/add.md#install-from-the-jsr-registry
[列出授權方式]: ./cli/licenses.md
[Build script security]: ./settings.md#allowbuilds
[Managing runtimes]: ./cli/runtime.md
[Managing versions of itself]: ./settings.md#managepackagemanagerversions
[覆寫支援]: ./settings.md#overrides
[修補相依性]: ./cli/patch.md
[SBOM generation]: ./cli/sbom.md
[副作用快取]: ./settings.md#sideeffectscache
[工作區支援]: ./workspaces.md
[Hooks]: ./pnpmfile.md
