---
id: workspaces
title: Espacio de trabajo
---

pnpm tiene soporte incorporado para monorepos (también conocidos como repositorios de paquetes múltiples, repositorios de proyectos múltiples o repositorios monolíticos). Puede crear un espacio de trabajo para unir varios proyectos dentro de un único repositorio.

A workspace must have a [`pnpm-workspace.yaml`][] file in its root.

:::tip

If you are looking into monorepo management, you might also want to look into [Bit][]. Bit usa pnpm en su interior, pero automatiza muchas de las cosas que actualmente se hacen manualmente en un espacio de trabajo tradicional administrado por pnpm/npm/Yarn. There's an article about `bit install` that talks about it: [Painless Monorepo Dependency Management with Bit][].

:::

## Protocolo de espacio de trabajo (workspace:)

If [linkWorkspacePackages][] is set to `true`, pnpm will link packages from the workspace if the available packages match the declared ranges. Por ejemplo, `foo@1.0.0` está vinculado a `bar` si `bar` tiene `"foo": "^1.0.0"` en sus dependencias y `foo@1.0.0` está en el espacio de trabajo. Sin embargo, si `bar` tiene `"foo": "2.0.0"` en las dependencias y `foo@2.0.0` no está en el espacio de trabajo, entonces `foo@2.0.0` se instalará desde el registro. Este comportamiento presenta algo de incertidumbre.

Afortunadamente, pnpm admite el protocolo `workspace:`. Cuando se usa este protocolo, pnpm se negará a resolver cualquier cosa que no sea un paquete de espacio de trabajo local. Por lo tanto, si establece `"foo": "workspace: 2.0.0"`, esta vez la instalación fallará porque `" foo@2.0.0 "` no está presente en el espacio de trabajo.

This protocol is especially useful when the [linkWorkspacePackages][] option is set to `false`. En ese caso, pnpm solo vinculará paquetes desde el espacio de trabajo si se usa el protocolo `workspace:`.

### Referenciando paquetes de espacio de trabajo a través de alias

Supongamos que tiene un paquete en el espacio de trabajo llamado `foo`. Por lo general, lo referenciaría como `"foo": "workspace:*"`.

Si desea utilizar un alias diferente, la siguiente sintaxis también funcionará: `"bar": "workspace:foo@*"`.

Antes de publicar, los alias se convierten en dependencias con alias regulares. El ejemplo anterior se convertirá en: `"bar": "npm:foo@1.0.0"`.


### Referenciando paquetes de espacio de trabajo a través de su ruta relativa

En un espacio de trabajo con 2 paquetes:

```
+ packages
    + foo
    + bar
```

`bar` puede tener `foo` en sus dependencias declaradas como `"foo": "workspace:../foo"`. Antes de publicar, estas especificaciones se convierten a las especificaciones de versión regular soportadas por todos los gestores de paquetes.

### Publicando paquetes del espacio de trabajo

Cuando un paquete de espacio de trabajo se empaqueta en un archivo (ya sea a través de `pnpm pack` o uno de los comandos de publicación como `pnpm publique`), reemplazamos dinámicamente cualquier dependencia de `workspace:` por:

* The corresponding version in the target workspace (if you use `workspace:`, `workspace:*`, `workspace:~`, or `workspace:^`)
* El rango de versión semántica asociado (para cualquier otro tipo de rango)

A bare `workspace:` without a version range is treated as `workspace:*`.

Así, por ejemplo, si tenemos `foo`, `bar`, `qar`, `zoo` en el espacio de trabajo y todos están en la versión `1.5.0`, lo siguiente:

```json
{
    "dependencies": {
        "foo": "workspace:*",
        "bar": "workspace:~",
        "qar": "workspace:^",
        "zoo": "workspace:^1.5.0"
    }
}
```

Será transformado en:

```json
{
    "dependencies": {
        "foo": "1.5.0",
        "bar": "~1.5.0",
        "qar": "^1.5.0",
        "zoo": "^1.5.0"
    }
}
```

Esta característica le permite depender de sus paquetes espacios de trabajo locales mientras aún puede publicar los paquetes resultantes en el registro remoto sin necesidad de pasos intermedios de publicación. Sus consumidores podrán utilizar sus espacios de trabajo publicados como cualquier otro paquete, beneficiándose de las garantías que ofrece el versionado semántico.

## Flujo de trabajo de lanzamiento

Versionar paquetes dentro de un espacio de trabajo es una tarea compleja y pnpm actualmente no proporciona una solución integrada para ello. Sin embargo, existen 2 herramientas bien probadas que manejan el control de versiones y admiten pnpm:
- [changesets](https://github.com/changesets/changesets)
- [Rush](https://rushjs.io)

For how to set up a repository using Rush, read [this page][rush-setup].

For using Changesets with pnpm, read [this guide][changesets-guide].

## Resolución de problemas

pnpm no puede garantizar que los scripts se ejecuten en orden topológico si existen ciclos entre las dependencias del espacio de trabajo. Si pnpm detecta dependencias cíclicas durante la instalación, generará una advertencia. Si pnpm puede averiguar qué dependencias están causando los ciclos, también las mostrará.

Si ve el mensaje `There are cyclic workspace dependencies`, inspeccione las dependencias de espacio de trabajo declaradas en `dependencies`, `optionalDependencies` y `devDependencies`.

## Ejemplos de uso

Estos son algunos de los proyectos de código abierto más populares que utilizan la función de espacio de trabajo de pnpm:

| Proyecto                                                                          | Estrellas                                                                        | Fecha de migración | Commit de migración                                                                                                                                      |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Next.js](https://github.com/vercel/next.js)                                      | ![](https://img.shields.io/github/stars/vercel/next.js)                          | 2022-05-29         | [`f7b81316aea4fc9962e5e54981a6d559004231aa`](https://github.com/vercel/next.js/commit/f7b81316aea4fc9962e5e54981a6d559004231aa)                          |
| [n8n](https://github.com/n8n-io/n8n)                                              | ![](https://img.shields.io/github/stars/n8n-io/n8n)                              | 2022-11-09         | [`736777385c54d5b20174c9c1fda38bb31fbf14b4`](https://github.com/n8n-io/n8n/commit/736777385c54d5b20174c9c1fda38bb31fbf14b4)                              |
| [Material UI](https://github.com/mui/material-ui)                                 | ![](https://img.shields.io/github/stars/mui/material-ui)                         | 2024-01-03         | [`a1263e3e5ef8d840252b4857f85b33caa99f471d`](https://github.com/mui/material-ui/commit/a1263e3e5ef8d840252b4857f85b33caa99f471d)                         |
| [Vite](https://github.com/vitejs/vite)                                            | ![](https://img.shields.io/github/stars/vitejs/vite)                             | 2021-09-26         | [`3e1cce01d01493d33e50966d0d0fd39a86d229f9`](https://github.com/vitejs/vite/commit/3e1cce01d01493d33e50966d0d0fd39a86d229f9)                             |
| [Nuxt](https://github.com/nuxt/nuxt)                                              | ![](https://img.shields.io/github/stars/nuxt/nuxt)                               | 2022-10-17         | [`74a90c566c936164018c086030c7de65b26a5cb6`](https://github.com/nuxt/nuxt/commit/74a90c566c936164018c086030c7de65b26a5cb6)                               |
| [Vue](https://github.com/vuejs/core)                                              | ![](https://img.shields.io/github/stars/vuejs/core)                              | 2021-10-09         | [`61c5fbd3e35152f5f32e95bf04d3ee083414cecb`](https://github.com/vuejs/core/commit/61c5fbd3e35152f5f32e95bf04d3ee083414cecb)                              |
| [Astro](https://github.com/withastro/astro)                                       | ![](https://img.shields.io/github/stars/withastro/astro)                         | 2022-03-08         | [`240d88aefe66c7d73b9c713c5da42ae789c011ce`](https://github.com/withastro/astro/commit/240d88aefe66c7d73b9c713c5da42ae789c011ce)                         |
| [Prisma](https://github.com/prisma/prisma)                                        | ![](https://img.shields.io/github/stars/prisma/prisma)                           | 2021-09-21         | [`c4c83e788aa16d61bae7a6d00adc8a58b3789a06`](https://github.com/prisma/prisma/commit/c4c83e788aa16d61bae7a6d00adc8a58b3789a06)                           |
| [Novu](https://github.com/novuhq/novu)                                            | ![](https://img.shields.io/github/stars/novuhq/novu)                             | 2021-12-23         | [`f2ea61f7d7ac7e12db4c9e70767082841ed98b2b`](https://github.com/novuhq/novu/commit/f2ea61f7d7ac7e12db4c9e70767082841ed98b2b)                             |
| [Slidev](https://github.com/slidevjs/slidev)                                      | ![](https://img.shields.io/github/stars/slidevjs/slidev)                         | 2021-04-12         | [`d6783323eb1ab1fc612577eb63579c8f7bc99c3a`](https://github.com/slidevjs/slidev/commit/d6783323eb1ab1fc612577eb63579c8f7bc99c3a)                         |
| [Turborepo](https://github.com/vercel/turborepo)                                  | ![](https://img.shields.io/github/stars/vercel/turborepo)                        | 2022-03-02         | [`fd171519ec02a69c9afafc1bc5d9d1b481fba721`](https://github.com/vercel/turborepo/commit/fd171519ec02a69c9afafc1bc5d9d1b481fba721)                        |
| [Quasar Framework](https://github.com/quasarframework/quasar)                     | ![](https://img.shields.io/github/stars/quasarframework/quasar)                  | 2024-03-13         | [`7f8e550bb7b6ab639ce423d02008e7f5e61cbf55`](https://github.com/quasarframework/quasar/commit/7f8e550bb7b6ab639ce423d02008e7f5e61cbf55)                  |
| [Element Plus](https://github.com/element-plus/element-plus)                      | ![](https://img.shields.io/github/stars/element-plus/element-plus)               | 2021-09-23         | [`f9e192535ff74d1443f1d9e0c5394fad10428629`](https://github.com/element-plus/element-plus/commit/f9e192535ff74d1443f1d9e0c5394fad10428629)               |
| [NextAuth.js](https://github.com/nextauthjs/next-auth)                            | ![](https://img.shields.io/github/stars/nextauthjs/next-auth)                    | 2022-05-03         | [`4f29d39521451e859dbdb83179756b372e3dd7aa`](https://github.com/nextauthjs/next-auth/commit/4f29d39521451e859dbdb83179756b372e3dd7aa)                    |
| [Ember.js](https://github.com/emberjs/ember.js)                                   | ![](https://img.shields.io/github/stars/emberjs/ember.js)                        | 2023-10-18         | [`b6b05da662497183434136fb0148e1dec544db04`](https://github.com/emberjs/ember.js/commit/b6b05da662497183434136fb0148e1dec544db04)                        |
| [Qwik](https://github.com/BuilderIO/qwik)                                         | ![](https://img.shields.io/github/stars/BuilderIO/qwik)                          | 2022-11-14         | [`021b12f58cca657e0a008119bc711405513e1ee9`](https://github.com/BuilderIO/qwik/commit/021b12f58cca657e0a008119bc711405513e1ee9)                          |
| [VueUse](https://github.com/vueuse/vueuse)                                        | ![](https://img.shields.io/github/stars/vueuse/vueuse)                           | 2021-09-25         | [`826351ba1d9c514e34426c85f3d69fb9875c7dd9`](https://github.com/vueuse/vueuse/commit/826351ba1d9c514e34426c85f3d69fb9875c7dd9)                           |
| [SvelteKit](https://github.com/sveltejs/kit)                                      | ![](https://img.shields.io/github/stars/sveltejs/kit)                            | 2021-09-26         | [`b164420ab26fa04fd0fbe0ac05431f36a89ef193`](https://github.com/sveltejs/kit/commit/b164420ab26fa04fd0fbe0ac05431f36a89ef193)                            |
| [Verdaccio](https://github.com/verdaccio/verdaccio)                               | ![](https://img.shields.io/github/stars/verdaccio/verdaccio)                     | 2021-09-21         | [`9dbf73e955fcb70b0a623c5ab89649b95146c744`](https://github.com/verdaccio/verdaccio/commit/9dbf73e955fcb70b0a623c5ab89649b95146c744)                     |
| [Vercel](https://github.com/vercel/vercel)                                        | ![](https://img.shields.io/github/stars/vercel/vercel)                           | 2023-01-12         | [`9c768b98b71cfc72e8638bf5172be88c39e8fa69`](https://github.com/vercel/vercel/commit/9c768b98b71cfc72e8638bf5172be88c39e8fa69)                           |
| [Vitest](https://github.com/vitest-dev/vitest)                                    | ![](https://img.shields.io/github/stars/vitest-dev/vitest)                       | 2021-12-13         | [`d6ff0ccb819716713f5eab5c046861f4d8e4f988`](https://github.com/vitest-dev/vitest/commit/d6ff0ccb819716713f5eab5c046861f4d8e4f988)                       |
| [Cycle.js](https://github.com/cyclejs/cyclejs)                                    | ![](https://img.shields.io/github/stars/cyclejs/cyclejs)                         | 2021-09-21         | [`f2187ab6688368edb904b649bd371a658f6a8637`](https://github.com/cyclejs/cyclejs/commit/f2187ab6688368edb904b649bd371a658f6a8637)                         |
| [Milkdown](https://github.com/Saul-Mirone/milkdown)                               | ![](https://img.shields.io/github/stars/Saul-Mirone/milkdown)                    | 2021-09-26         | [`4b2e1dd6125bc2198fd1b851c4f00eda70e9b913`](https://github.com/Saul-Mirone/milkdown/commit/4b2e1dd6125bc2198fd1b851c4f00eda70e9b913)                    |
| [Nhost](https://github.com/nhost/nhost)                                           | ![](https://img.shields.io/github/stars/nhost/nhost)                             | 2022-02-07         | [`10a1799a1fef2f558f737de3bb6cadda2b50e58f`](https://github.com/nhost/nhost/commit/10a1799a1fef2f558f737de3bb6cadda2b50e58f)                             |
| [Logto](https://github.com/logto-io/logto)                                        | ![](https://img.shields.io/github/stars/logto-io/logto)                          | 2021-07-29         | [`0b002e07850c8e6d09b35d22fab56d3e99d77043`](https://github.com/logto-io/logto/commit/0b002e07850c8e6d09b35d22fab56d3e99d77043)                          |
| [Rollup plugins](https://github.com/rollup/plugins)                               | ![](https://img.shields.io/github/stars/rollup/plugins)                          | 2021-09-21         | [`53fb18c0c2852598200c547a0b1d745d15b5b487`](https://github.com/rollup/plugins/commit/53fb18c0c2852598200c547a0b1d745d15b5b487)                          |
| [icestark](https://github.com/ice-lab/icestark)                                   | ![](https://img.shields.io/github/stars/ice-lab/icestark)                        | 2021-12-16         | [`4862326a8de53d02f617e7b1986774fd7540fccd`](https://github.com/ice-lab/icestark/commit/4862326a8de53d02f617e7b1986774fd7540fccd)                        |
| [ByteMD](https://github.com/bytedance/bytemd)                                     | ![](https://img.shields.io/github/stars/bytedance/bytemd)                        | 2021-02-18         | [`36ef25f1ea1cd0b08752df5f8c832302017bb7fb`](https://github.com/bytedance/bytemd/commit/36ef25f1ea1cd0b08752df5f8c832302017bb7fb)                        |
| [Stimulus Components](https://github.com/stimulus-components/stimulus-components) | ![](https://img.shields.io/github/stars/stimulus-components/stimulus-components) | 2024-10-26         | [`8e100d5b2c02ad5bf0b965822880a60f543f5ec3`](https://github.com/stimulus-components/stimulus-components/commit/8e100d5b2c02ad5bf0b965822880a60f543f5ec3) |
| [Serenity/JS](https://github.com/serenity-js/serenity-js)                         | ![](https://img.shields.io/github/stars/serenity-js/serenity-js)                 | 2025-01-01         | [`43dbe6f440d8dd81811da303e542381a17d06b4d`](https://github.com/serenity-js/serenity-js/commit/43dbe6f440d8dd81811da303e542381a17d06b4d)                 |
| [kysely](https://github.com/kysely-org/kysely)                                    | ![](https://img.shields.io/github/stars/kysely-org/kysely)                       | 2025-07-29         | [`5ac19105ddb17af310c67e004c11fa3345454b66`](https://github.com/kysely-org/kysely/commit/5ac19105ddb17af310c67e004c11fa3345454b66)                       |

## Configuración

### linkWorkspacePackages

* Por defecto: **false**
* Tipo: **true**, **false**, **deep**

If this is enabled, locally available packages are linked to `node_modules` instead of being downloaded from the registry. This is very convenient in a monorepo. Si necesita que los paquetes locales también se vinculen a las subdependencias, usar la configuración `deep`.

Else, packages are downloaded and installed from the registry. However, workspace packages can still be linked by using the `workspace:` range protocol.

Packages are only linked if their versions satisfy the dependency ranges.

### injectWorkspacePackages

* Por defecto: **false**
* Tipo: **Boolean**

Enables hard-linking of all local workspace dependencies instead of symlinking them. Alternatively, this can be achieved using [`dependenciesMeta[].injected`](package_json.md#dependenciesmetainjected), which allows to selectively enable hard-linking for specific dependencies.

:::note

Even if this setting is enabled, pnpm will prefer to deduplicate injected dependencies using symlinks—unless multiple dependency graphs are required due to mismatched peer dependencies. This behaviour is controlled by the `dedupeInjectedDeps` setting.

:::

### dedupeInjectedDeps

* Por defecto: **true**
* Tipo: **Boolean**

When this setting is enabled, [dependencies that are injected](package_json.md#dependenciesmetainjected) will be symlinked from the workspace whenever possible. If the dependent project and the injected dependency reference the same peer dependencies, then it is not necessary to physically copy the injected dependency into the dependent's `node_modules`; a symlink is sufficient.

### syncInjectedDepsAfterScripts

Added in: v10.5.0

* Predeterminado: **indefinido**
* Type: **String[]**

Injected workspace dependencies are collections of hardlinks, which don't add or remove the files when their sources change. This causes problems in packages that need to be built (such as in TypeScript projects).

This setting is a list of script names. When any of these scripts are executed in a workspace package, the injected dependencies inside `node_modules` will also be synchronized.

### preferWorkspacePackages

* Por defecto: **false**
* Tipo: **Boolean**

If this is enabled, local packages from the workspace are preferred over packages from the registry, even if there is a newer version of the package in the registry.

This setting is only useful if the workspace doesn't use `saveWorkspaceProtocol`.

### sharedWorkspaceLockfile

* Por defecto: **true**
* Tipo: **Boolean**

If this is enabled, pnpm creates a single `pnpm-lock.yaml` file in the root of the workspace. This also means that all dependencies of workspace packages will be in a single `node_modules` (and get symlinked to their package `node_modules` folder for Node's module resolution).

Advantages of this option:
* cada dependencia es un singleton
* instalaciones más rápidas en un monorepo
* menos cambios en las revisiones de código, ya que están todos en un solo archivo

:::note

Even though all the dependencies will be hard linked into the root `node_modules`, packages will have access only to those dependencies that are declared in their `package.json`, so pnpm's strictness is preserved. This is a result of the aforementioned symbolic linking.

:::

### saveWorkspaceProtocol

* Default: **rolling**
* Tipo: **true**, **false**, **rolling**

Esta configuración controla cómo se agregan las dependencias que están vinculadas desde el espacio de trabajo a `package.json`.

Si `foo@1.0.0` está en el espacio de trabajo y ejecuta `pnpm add foo` en otro proyecto del espacio de trabajo, a continuación se muestra cómo se agregará `foo` al campo de dependencias. The `savePrefix` setting also influences how the spec is created.

| saveWorkspaceProtocol | savePrefix | especificaciones   |
| --------------------- | ---------- | ------------------ |
| false                 | `''`       | `1.0.0`            |
| false                 | `'~'`      | `~1.0.0`           |
| false                 | `'^'`      | `^1.0.0`           |
| true                  | `''`       | `workspace:1.0.0`  |
| true                  | `'~'`      | `workspace:~1.0.0` |
| true                  | `'^'`      | `workspace:^1.0.0` |
| rolling               | `''`       | `workspace:*`      |
| rolling               | `'~'`      | `workspace:~`      |
| rolling               | `'^'`      | `workspace:^`      |

### includeWorkspaceRoot

* Por defecto: **false**
* Tipo: **Boolean**

Al ejecutar comandos recursivamente en un espacio de trabajo, ejecútelos también en el proyecto del espacio de trabajo raíz.

### ignoreWorkspaceCycles

* Por defecto: **false**
* Tipo: **Boolean**

When set to `true`, no workspace cycle warnings will be printed.

### disallowWorkspaceCycles

* Por defecto: **false**
* Tipo: **Boolean**

When set to `true`, installation will fail if the workspace has cycles.

### failIfNoMatch

* Por defecto: **false**
* Tipo: **Boolean**

When set to `true`, the CLI will exit with a non-zero code if no packages match the provided filters.

For example, the following command will exit with a non-zero code because `bad-pkg-name` is not present in the workspace:

```sh
pnpm --filter=bad-pkg-name test
```

[`pnpm-workspace.yaml`]: pnpm-workspace_yaml.md

[Bit]: https://bit.dev/?utm_source=pnpm&utm_medium=workspace_page
[Painless Monorepo Dependency Management with Bit]: https://bit.dev/blog/painless-monorepo-dependency-management-with-bit-l4f9fzyw?utm_source=pnpm&utm_medium=workspace_page

[linkWorkspacePackages]: #linkworkspacepackages

[rush-setup]: https://rushjs.io/pages/maintainer/setup_new_repo
[changesets-guide]: using-changesets.md
