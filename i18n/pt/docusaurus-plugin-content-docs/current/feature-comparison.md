---
id: feature-comparison
title: Comparação de Recursos
---

| Recurso                               |         pnpm         |         Yarn         |         npm          | Notes                                                                |
| ------------------------------------- |:--------------------:|:--------------------:|:--------------------:| -------------------------------------------------------------------- |
| [Suporte a área de trabalho][]        | :white_check_mark: | :white_check_mark: | :white_check_mark: |                                                                      |
| `node_modules` isolado                | :white_check_mark: | :white_check_mark: | :white_check_mark: | Default in pnpm.                                                     |
| [`node_modules` fixado][]             | :white_check_mark: | :white_check_mark: | :white_check_mark: | Default in npm.                                                      |
| Plug'n'Play                           | :white_check_mark: | :white_check_mark: |         :x:          | Default in Yarn.                                                     |
| [Instalação automática de pares][]    | :white_check_mark: |         :x:          | :white_check_mark: |                                                                      |
| Instalações zero                      |         :x:          | :white_check_mark: |         :x:          |                                                                      |
| [Dependências de correção][]          | :white_check_mark: | :white_check_mark: |         :x:          |                                                                      |
| [Managing runtimes][]                 | :white_check_mark: |         :x:          |         :x:          |                                                                      |
| [Managing versions of itself][]       | :white_check_mark: | :white_check_mark: |         :x:          |                                                                      |
| Possui um arquivo lock                | :white_check_mark: | :white_check_mark: | :white_check_mark: | `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`.                  |
| [Suporte à substituições][]           | :white_check_mark: | :white_check_mark: | :white_check_mark: | Known as "resolutions" in Yarn.                                      |
| Armazenamento de conteúdo endereçável | :white_check_mark: | :white_check_mark: |         :x:          | Yarn uses a CAS when `nodeLinker` is set to `pnpm`.                  |
| [Execução dinâmica de pacotes][]      | :white_check_mark: | :white_check_mark: | :white_check_mark: | `pnpm dlx`, `yarn dlx`, `npx`.                                       |
| [Side-effects cache][]                | :white_check_mark: |         :x:          |         :x:          |                                                                      |
| [Catalogs][]                          | :white_check_mark: |         :x:          |         :x:          |                                                                      |
| [Config dependencies][]               | :white_check_mark: |         :x:          |         :x:          |                                                                      |
| [JSR registry support][]              | :white_check_mark: | :white_check_mark: |         :x:          |                                                                      |
| [Auto-install before script run][]    | :white_check_mark: |         :x:          |         :x:          | In Yarn, Plug'n'Play ensures dependencies are always up to date.     |
| [Hooks][]                             | :white_check_mark: | :white_check_mark: |         :x:          |                                                                      |
| [Build script security][]             | :white_check_mark: |         :x:          |         :x:          |                                                                      |
| [SBOM generation][]                   | :white_check_mark: |         :x:          | :white_check_mark: | `pnpm sbom`, `npm sbom`.                                             |
| [Listing licenses][]                  | :white_check_mark: | :white_check_mark: |         :x:          | pnpm supports it via `pnpm licenses list`. Yarn has a plugin for it. |

**Note:** To keep the comparison concise, we include only features likely to be used frequently.

[Auto-install before script run]: ./settings.md#verifydepsbeforerun
[Instalação automática de pares]: ./settings.md#autoinstallpeers
[Catalogs]: ./catalogs.md
[Config dependencies]: ./config-dependencies.md
[Execução dinâmica de pacotes]: ./cli/pnx.md
[`node_modules` fixado]: ./settings.md#nodelinker
[JSR registry support]: ./cli/add.md#install-from-the-jsr-registry
[Listing licenses]: ./cli/licenses.md
[Build script security]: ./settings.md#allowbuilds
[Managing runtimes]: ./cli/runtime.md
[Managing versions of itself]: ./settings.md#managepackagemanagerversions
[Suporte à substituições]: ./settings.md#overrides
[Dependências de correção]: ./cli/patch.md
[SBOM generation]: ./cli/sbom.md
[Side-effects cache]: ./settings.md#sideeffectscache
[Suporte a área de trabalho]: ./workspaces.md
[Hooks]: ./pnpmfile.md
