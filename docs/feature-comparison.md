---
id: feature-comparison
title: Feature Comparison
---

| Feature                          |pnpm              |Yarn              |npm               | Notes |
| ---                              |:--:              |:--:              |:--:              | ---   |
| Workspace support                |:white_check_mark:|:white_check_mark:|:white_check_mark:|
| Isolated `node_modules`          |:white_check_mark:|:white_check_mark:|:white_check_mark:| Default in pnpm. |
| Hoisted `node_modules`           |:white_check_mark:|:white_check_mark:|:white_check_mark:| Default in npm. |
| Plug'n'Play                      |:white_check_mark:|:white_check_mark:|:x:               | Default in Yarn. |
| Autoinstalling peers             |:white_check_mark:|:x:               |:white_check_mark:|
| Zero-Installs                    |:x:               |:white_check_mark:|:x:               |
| Patching dependencies            |:white_check_mark:|:white_check_mark:|:x:               |
| Managing Node.js versions        |:white_check_mark:|:x:               |:x:               |
| Managing versions of itself      |:white_check_mark:|:white_check_mark:|:x:               |
| Has a lockfile                   |:white_check_mark:|:white_check_mark:|:white_check_mark:| `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`. |
| Overrides support                |:white_check_mark:|:white_check_mark:|:white_check_mark:| Known as "resolutions" in Yarn. |
| Content-addressable storage      |:white_check_mark:|:white_check_mark:|:x:               | Yarn uses a CAS when `nodeLinker` is set to `pnpm`. |
| Dynamic package execution        |:white_check_mark:|:white_check_mark:|:white_check_mark:| `pnpm dlx`, `yarn dlx`, `npx`. |
| Side-effects cache               |:white_check_mark:|:x:               |:x:               |
| [Catalogs]                       |:white_check_mark:|:x:               |:x:               |
| [Config dependencies]            |:white_check_mark:|:x:               |:x:               |
| [JSR registry support]           |:white_check_mark:|:white_check_mark:|:x:               |
| [Auto-install before script run] |:white_check_mark:|:x:               |:x:               | In Yarn, Plug'n'Play ensures dependencies are always up to date. |
| [Hooks]                          |:white_check_mark:|:white_check_mark:|:x:               |
| Listing licenses                 |:white_check_mark:|:white_check_mark:|:x:               | pnpm supports it via `pnpm licenses list`. Yarn has a plugin for it. |

[Catalogs]: ./catalogs.md
[Config dependencies]: ./config-dependencies.md
[JSR registry support]: ./cli/add.md#install-from-the-jsr-registry
[Auto-install before script run]: ./settings.md#verifydepsbeforerun
[hooks]: ./pnpmfile.md

