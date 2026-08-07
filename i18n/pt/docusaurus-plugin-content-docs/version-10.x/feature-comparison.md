---
id: feature-comparison
title: Comparação de Recursos
---

| Recurso                               |                                             pnpm                                             |                                             Yarn                                             |                                              npm                                             | Notes                                                                                                |
| ------------------------------------- | :------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------: | ---------------------------------------------------------------------------------------------------- |
| [Workspace support]                   | :white_check_mark: | :white_check_mark: | :white_check_mark: |                                                                                                      |
| Isolated `node_modules`               | :white_check_mark: | :white_check_mark: | :white_check_mark: | Default in pnpm.                                                                     |
| [Hoisted `node_modules`]              | :white_check_mark: | :white_check_mark: | :white_check_mark: | Default in npm.                                                                      |
| Plug'n'Play                           | :white_check_mark: | :white_check_mark: |                              :x:                             | Default in Yarn.                                                                     |
| [Autoinstalling peers]                | :white_check_mark: |                              :x:                             | :white_check_mark: |                                                                                                      |
| Instalações zero                      |                              :x:                             | :white_check_mark: |                              :x:                             |                                                                                                      |
| [Patching dependencies]               | :white_check_mark: | :white_check_mark: |                              :x:                             |                                                                                                      |
| [Managing Node.js versions]           | :white_check_mark: |                              :x:                             |                              :x:                             |                                                                                                      |
| [Managing versions of itself]         | :white_check_mark: | :white_check_mark: |                              :x:                             |                                                                                                      |
| Possui um arquivo lock                | :white_check_mark: | :white_check_mark: | :white_check_mark: | `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`.                                  |
| [Overrides support]                   | :white_check_mark: | :white_check_mark: | :white_check_mark: | Known as "resolutions" in Yarn.                                                      |
| Armazenamento de conteúdo endereçável | :white_check_mark: | :white_check_mark: |                              :x:                             | Yarn uses a CAS when `nodeLinker` is set to `pnpm`.                                  |
| [Dynamic package execution]           | :white_check_mark: | :white_check_mark: | :white_check_mark: | `pnpm dlx`, `yarn dlx`, `npx`.                                                       |
| [Side-effects cache]                  | :white_check_mark: |                              :x:                             |                              :x:                             |                                                                                                      |
| [Catalogs]                            | :white_check_mark: |                              :x:                             |                              :x:                             |                                                                                                      |
| [Config dependencies]                 | :white_check_mark: |                              :x:                             |                              :x:                             |                                                                                                      |
| [JSR registry support]                | :white_check_mark: | :white_check_mark: |                              :x:                             |                                                                                                      |
| [Auto-install before script run]      | :white_check_mark: |                              :x:                             |                              :x:                             | In Yarn, Plug'n'Play ensures dependencies are always up to date.                     |
| [Hooks]                               | :white_check_mark: | :white_check_mark: |                              :x:                             |                                                                                                      |
| [Listing licenses]                    | :white_check_mark: | :white_check_mark: |                              :x:                             | pnpm supports it via `pnpm licenses list`. Yarn has a plugin for it. |

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

**Note:** To keep the comparison concise, we include only features likely to be used frequently.
