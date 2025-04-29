---
id: feature-comparison
title: Feature Comparison
---

| Feature                                                 |pnpm|Yarn|npm | Notes |
| ---                                                     |:--:|:--:|:--:| ---   |
| Workspace support                                       | ✔️ | ✔️ | ✔️ |
| Isolated `node_modules`                                 | ✔️ | ✔️ | ✔️ | Default in pnpm. |
| Hoisted `node_modules`                                  | ✔️ | ✔️ | ✔️ | Default in npm. |
| Plug'n'Play                                             | ✔️ | ✔️ | ❌| Default in Yarn. |
| Autoinstalling peers                                    | ✔️ | ❌| ✔️ |
| Zero-Installs                                           | ❌| ✔️ | ❌|
| Patching dependencies                                   | ✔️ | ✔️ | ❌|
| Managing Node.js versions                               | ✔️ | ❌| ❌|
| Managing versions of itself                             | ✔️ | ✔️ | ❌|
| Has a lockfile                                          | ✔️ | ✔️ | ✔️ | `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`. |
| Overrides support                                       | ✔️ | ✔️ | ✔️ | Known as "resolutions" in Yarn. |
| Content-addressable storage                             | ✔️ | ❌| ❌|
| Dynamic package execution                               | ✔️ | ✔️ | ✔️ | `pnpm dlx`, `yarn dlx`, `npx`. |
| Side-effects cache                                      | ✔️ | ❌| ❌|
| [Catalogs]                                              | ✔️ | ❌| ❌|
| [Config dependencies]                                   | ✔️ | ❌| ❌|
| [JSR registry support]                                  | ✔️ | ✔️ | ❌|
| [Running install automatically before running scripts] | ✔️ | ❌| ❌| In Yarn, Plug'n'Play ensures dependencies are always up to date. |
| [Hooks]                                                 | ✔️ | ✔️ | ❌|
| Listing licenses                                        | ✔️ | ✔️ | ❌| pnpm supports it via `pnpm licenses list`. Yarn has a plugin for it. |

[Catalogs]: ./catalogs.md
[Config dependencies]: ./config-dependencies.md
[JSR registry support]: ./cli/add.md#install-from-the-jsr-registry
[Running install automatically before running scripts]: ./settings.md#verifydepsbeforerun
[hooks]: ./pnpmfile.md
