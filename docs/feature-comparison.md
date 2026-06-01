---
id: feature-comparison
title: Feature Comparison
---

| Feature                          |pnpm              |Yarn              |npm               |Bun               | Notes |
| ---                              |:--:              |:--:              |:--:              |:--:              | ---   |
| [Workspace support]              |:white_check_mark:|:white_check_mark:|:white_check_mark:|:white_check_mark:| |
| Isolated `node_modules`          |:white_check_mark:|:white_check_mark:|:white_check_mark:|:white_check_mark:| Default in pnpm and new Bun workspaces. |
| [Hoisted `node_modules`]         |:white_check_mark:|:white_check_mark:|:white_check_mark:|:white_check_mark:| Default in npm and new Bun single-package projects. |
| Plug'n'Play                      |:white_check_mark:|:white_check_mark:|:x:               |:x:               | Default in Yarn. |
| [Autoinstalling peers]           |:white_check_mark:|:x:               |:white_check_mark:|:white_check_mark:| |
| Zero-Installs                    |:x:               |:white_check_mark:|:x:               |:x:               | |
| [Patching dependencies]          |:white_check_mark:|:white_check_mark:|:x:               |:white_check_mark:| |
| [Managing runtimes]              |:white_check_mark:|:x:               |:x:               |:x:               | |
| [Managing versions of itself]    |:white_check_mark:|:white_check_mark:|:x:               |:x:               | |
| Has a lockfile                   |:white_check_mark:|:white_check_mark:|:white_check_mark:|:white_check_mark:| `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`, `bun.lock`. |
| [Overrides support]              |:white_check_mark:|:white_check_mark:|:white_check_mark:|:white_check_mark:| Known as "resolutions" in Yarn. Bun supports both `overrides` and `resolutions`. |
| Content-addressable storage      |:white_check_mark:|:white_check_mark:|:x:               |:x:               | Yarn uses a CAS when `nodeLinker` is set to `pnpm`. |
| [Dynamic package execution]      |:white_check_mark:|:white_check_mark:|:white_check_mark:|:white_check_mark:| `pnpm dlx`, `yarn dlx`, `npx`, `bunx`. |
| [Side-effects cache]             |:white_check_mark:|:x:               |:x:               |:x:               | |
| [Catalogs]                       |:white_check_mark:|:x:               |:x:               |:white_check_mark:| |
| [Config dependencies]            |:white_check_mark:|:x:               |:x:               |:x:               | |
| [JSR registry support]           |:white_check_mark:|:white_check_mark:|:x:               |:x:               | |
| [Auto-install before script run] |:white_check_mark:|:x:               |:x:               |:x:               | In Yarn, Plug'n'Play ensures dependencies are always up to date. |
| [Hooks]                          |:white_check_mark:|:white_check_mark:|:x:               |:x:               | |
| [Build script security]          |:white_check_mark:|:x:               |:x:               |:white_check_mark:| Bun uses `trustedDependencies` to allow dependency lifecycle scripts. |
| [SBOM generation]                |:white_check_mark:|:x:               |:white_check_mark:|:x:               | `pnpm sbom`, `npm sbom`. |
| [Listing licenses]               |:white_check_mark:|:white_check_mark:|:x:               |:x:               | pnpm supports it via `pnpm licenses list`. Yarn has a plugin for it. |

[Auto-install before script run]: ./settings.md#verifydepsbeforerun
[Autoinstalling peers]: ./settings.md#autoinstallpeers
[Catalogs]: ./catalogs.md
[Config dependencies]: ./config-dependencies.md
[Dynamic package execution]: ./cli/pnx.md
[Hoisted `node_modules`]: ./settings.md#nodelinker
[JSR registry support]: ./cli/add.md#install-from-the-jsr-registry
[Listing licenses]: ./cli/licenses.md
[Build script security]: ./settings.md#allowbuilds
[Managing runtimes]: ./cli/runtime.md
[Managing versions of itself]: ./settings.md#managepackagemanagerversions
[Overrides support]: ./settings.md#overrides
[Patching dependencies]: ./cli/patch.md
[SBOM generation]: ./cli/sbom.md
[Side-effects cache]: ./settings.md#sideeffectscache
[Workspace support]: ./workspaces.md
[hooks]: ./pnpmfile.md

**Note:** To keep the comparison concise, we include only features likely to be used frequently.
