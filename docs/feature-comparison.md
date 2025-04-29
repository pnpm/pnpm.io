---
id: feature-comparison
title: Feature Comparison
---

| Feature                                                 |pnpm|Yarn|npm | Notes |
| ---                                                     |:--:|:--:|:--:| ---   |
| Workspace support                                       | ✔️ | ✔️ | ✔️ |
| Isolated `node_modules`                                 | ✔️ | ✔️ | ✔️ | For pnpm this is the default one |
| Hoisted `node_modules`                                  | ✔️ | ✔️ | ✔️ | For npm this is the default one |
| Autoinstalling peers                                    | ✔️ | ✔️ | ✔️ |
| Plug'n'Play                                             | ✔️ | ✔️ | ❌| For Yarn this is the default one |
| Zero-Installs                                           | ❌| ✔️ | ❌|
| Patching dependencies                                   | ✔️ | ✔️ | ❌|
| Managing Node.js versions                               | ✔️ | ❌| ❌|
| Managing versions of itself                             | ✔️ | ✔️ | ❌|
| Has a lockfile                                          | ✔️ | ✔️ | ✔️ | `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json` |
| Overrides support                                       | ✔️ | ✔️ | ✔️ | Yarn calls this feature "resolutions" |
| Content-addressable storage                             | ✔️ | ❌| ❌|
| Dynamic package execution                               | ✔️ | ✔️ | ✔️ | `pnpm dlx`, `yarn dlx`, `npx` |
| Side-effects cache                                      | ✔️ | ❌| ❌|
| [Catalogs]                                              | ✔️ | ❌| ❌|
| [Config dependencies]                                   | ✔️ | ❌| ❌|
| [JSR registry support]                                  | ✔️ | ✔️ | ❌|
| [Running install automatically before runnings scripts] | ✔️ | ❌| ❌| In case of Yarn, if Plug'n'Play is used, dependencies are always up-to-date |
| [Hooks]                                                 | ✔️ | ✔️ | ❌|
| Listing licenses                                        | ✔️ | ✔️ | ❌| pnpm supports it via `pnpm licenses list`. Yarn has a plugin for it. |

[Catalogs]: ./catalogs.md
[Config dependencies]: ./config-dependencies.md
[JSR registry support]: ./cli/add.md#install-from-the-jsr-registry
[Running install automatically before runnings scripts]: ./settings.md#verifydepsbeforerun
[hooks]: ./pnpmfile.md
