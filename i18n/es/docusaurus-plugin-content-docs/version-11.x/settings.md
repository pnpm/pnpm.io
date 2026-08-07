---
id: settings
title: "Settings (pnpm-workspace.yaml)"
---

pnpm gets its configuration from the command line, environment variables, and `pnpm-workspace.yaml`.

Only auth and registry settings are read from `.npmrc` files. All other settings (like `hoistPattern`, `nodeLinker`, `shamefullyHoist`, etc.) must be configured in `pnpm-workspace.yaml` or the global `~/.config/pnpm/config.yaml`.

The `pnpm config` command can be used to read and edit the contents of the project and global configuration files.

The relevant configuration files are:

- Per-project configuration file: `/path/to/my/project/pnpm-workspace.yaml`
- [Global configuration file](./cli/config.md)

:::note

Authorization-related settings are handled via [`.npmrc`](./npmrc.md).

:::

Values in the configuration files may contain env variables using the `${NAME}` syntax. Las variables env también se pueden especificar con valores predeterminados. Using `${NAME-fallback}` will return `fallback` if `NAME` isn't set. `${NAME:-fallback}` will return `fallback` if `NAME` isn't set, or is an empty string.

[INI-formatted]: https://en.wikipedia.org/wiki/INI_file

## Dependency Resolution

### overrides

This field allows you to instruct pnpm to override any dependency in the
dependency graph, including peer dependencies. This is useful for enforcing all your packages to use a single
version of a dependency, backporting a fix, replacing a dependency with a fork, or
removing an unused dependency.

Note that the overrides field can only be set at the root of the project.

An example of the `overrides` field:

```yaml
overrides:
  "foo": "^1.0.0"
  "quux": "npm:@myorg/quux@^1.0.0"
  "bar@^2.1.0": "3.0.0"
  "qar@1>zoo": "2"
```

You may specify the package the overridden dependency belongs to by
separating the package selector from the dependency selector with a ">", for
example `qar@1>zoo` will only override the `zoo` dependency of `qar@1`, not for
any other dependencies.

Una anulación se puede definir como una referencia a la especificación de una dependencia directa.
This is achieved by prefixing the name of the dependency with a `$`:

```json title="package.json"
{
  "dependencies": {
    "foo": "^1.0.0"
  }
}
```

```yaml title="pnpm-workspace.yaml"
overrides:
  foo: "$foo"
```

The referenced package does not need to match the overridden one:

```yaml title="pnpm-workspace.yaml"
overrides:
  bar: "$foo"
```

If you find that your use of a certain package doesn't require one of its dependencies, you may use `-` to remove it. For example, if package `foo@1.0.0` requires a large package named `bar` for a function that you don't use, removing it could reduce install time:

```yaml
overrides:
  "foo@1.0.0>bar": "-"
```

This feature is especially useful with `optionalDependencies`, where most optional packages can be safely skipped.

#### Overriding peer dependencies

Overrides also apply to `peerDependencies`. The behavior depends on the type of version specifier used in the override:

- **Semver ranges** (e.g., `^1.0.0`), **workspace**, and **catalog** protocols: the peer dependency is overridden and remains a peer dependency.
- **Non-range specifiers** such as `link:` or `file:` protocols: the peer dependency is overridden and moved to `dependencies`, since these are not valid peer dependency ranges.
- **Removal** (`-`): the peer dependency is removed entirely.

For example, to override the `react` peer dependency of `react-dom`:

```yaml title="pnpm-workspace.yaml"
overrides:
  "react-dom>react": "18.1.0"
```

### packageExtensions

The `packageExtensions` fields offer a way to extend the existing package definitions with additional information. For example, if `react-redux` should have `react-dom` in its `peerDependencies` but it has not, it is possible to patch `react-redux` using `packageExtensions`:

```yaml
packageExtensions:
  react-redux:
    peerDependencies:
      react-dom: "*"
```

The keys in `packageExtensions` are package names or package names and semver ranges, so it is possible to patch only some versions of a package:

```yaml
packageExtensions:
  react-redux@1:
    peerDependencies:
      react-dom: "*"
```

The following fields may be extended using `packageExtensions`: `dependencies`, `optionalDependencies`, `peerDependencies`, and `peerDependenciesMeta`.

A bigger example:

```yaml
packageExtensions:
  express@1:
    optionalDependencies:
      typescript: "2"
  fork-ts-checker-webpack-plugin:
    dependencies:
      "@babel/core": "1"
    peerDependencies:
      eslint: ">= 6"
    peerDependenciesMeta:
      eslint:
        optional: true
```

:::tip

Together with Yarn, we maintain a database of `packageExtensions` to patch broken packages in the ecosystem.
If you use `packageExtensions`, consider sending a PR upstream and contributing your extension to the [`@yarnpkg/extensions`] database.

:::

[`@yarnpkg/extensions`]: https://github.com/yarnpkg/berry/blob/master/packages/yarnpkg-extensions/sources/index.ts

### allowedDeprecatedVersions

This setting allows muting deprecation warnings of specific packages.

Ejemplo:

```yaml
allowedDeprecatedVersions:
  express: "1"
  request: "*"
```

With the above configuration pnpm will not print deprecation warnings about any version of `request` and about v1 of `express`.

### updateConfig

#### updateConfig.ignoreDependencies

Sometimes you can't update a dependency. For instance, the latest version of the dependency started to use ESM but your project is not yet in ESM. Annoyingly, such a package will be always printed out by the `pnpm outdated` command and updated, when running `pnpm update --latest`. However, you may list packages that you don't want to upgrade in the `ignoreDependencies` field:

```yaml
updateConfig:
  ignoreDependencies:
  - load-json-file
```

Patterns are also supported, so you may ignore any packages from a scope: `@babel/*`.

### supportedArchitectures

You can specify architectures for which you'd like to install optional dependencies, even if they don't match the architecture of the system running the install.

For example, the following configuration tells to install optional dependencies for Windows x64:

```yaml
supportedArchitectures:
  os:
  - win32
  cpu:
  - x64
```

Whereas this configuration will install optional dependencies for Windows, macOS, and the architecture of the system currently running the install. It includes artifacts for both x64 and arm64 CPUs:

```yaml
supportedArchitectures:
  os:
  - win32
  - darwin
  - current
  cpu:
  - x64
  - arm64
```

Additionally, `supportedArchitectures` also supports specifying the `libc` of the system.

### ignoredOptionalDependencies

If an optional dependency has its name included in this array, it will be skipped. Por ejemplo:

```yaml
ignoredOptionalDependencies:
- fsevents
- "@esbuild/*"
```

### minimumReleaseAge

Added in: v10.16.0

- Default: **1440** (since v11), **0** (before v11)
- Type: **number (minutes)**

To reduce the risk of installing compromised packages, you can delay the installation of newly published versions. In most cases, malicious releases are discovered and removed from the registry within an hour.

`minimumReleaseAge` defines the minimum number of minutes that must pass after a version is published before pnpm will install it. This applies to **all dependencies**, including transitive ones.

For example, the following setting ensures that only packages released at least one day ago can be installed:

```yaml
minimumReleaseAge: 1440
```

### minimumReleaseAgeExclude

Added in: v10.16.0

- Default: **undefined**
- Type: **string[]**

If you set `minimumReleaseAge` but need certain dependencies to always install the newest version immediately, you can list them under `minimumReleaseAgeExclude`. The exclusion works by **package name** and applies to all versions of that package.

Ejemplo:

```yaml
minimumReleaseAge: 1440
minimumReleaseAgeExclude:
- webpack
- react
```

In this case, all dependencies must be at least a day old, except `webpack` and `react`, which are installed immediately upon release.

Added in: v10.17.0

You may also use patterns. For instance, allow all packages from your org:

```yaml
minimumReleaseAge: 1440
minimumReleaseAgeExclude:
- '@myorg/*'
```

Added in: v10.19.0

You may also exempt specific versions (or a list of specific versions using a disjunction with `||`). This allows pinning exceptions to mature-time rules:

```yaml
minimumReleaseAge: 1440
minimumReleaseAgeExclude:
- nx@21.6.5
- webpack@4.47.0 || 5.102.1
```

### minimumReleaseAgeIgnoreMissingTime

Added in: v11.0.0

- Default: **true**
- Type: **Boolean**

When `true`, pnpm skips the [`minimumReleaseAge`](#minimumreleaseage) check for a package whose registry metadata does not include the `time` field (some private registries and mirrors omit it). Set to `false` to fail resolution in that case instead of installing the package.

```yaml
minimumReleaseAgeIgnoreMissingTime: false
```

### minimumReleaseAgeStrict

Added in: v11.0.0

- Default: **true** if [`minimumReleaseAge`](#minimumreleaseage) is explicitly configured, **false** otherwise
- Type: **Boolean**

Controls how pnpm behaves when no version of a dependency satisfies the [`minimumReleaseAge`](#minimumreleaseage) constraint within the requested range. When `false`, pnpm falls back to a version that doesn't meet the `minimumReleaseAge` constraint so installation can still succeed. When `true`, pnpm fails resolution instead.

The default depends on whether you configured `minimumReleaseAge` yourself: if you set it explicitly (via `pnpm-workspace.yaml`, the CLI, or environment variables), strict mode is on by default so the setting is enforced. The built-in default of `minimumReleaseAge` (1440 minutes) is non-strict for backward compatibility.

```yaml
minimumReleaseAgeStrict: true
```

### trustPolicy

Added in: v10.21.0

- Default: **off**
- Type: **no-downgrade** | **off**

When set to `no-downgrade`, pnpm will fail if a package's trust level has decreased compared to previous releases. For example, if a package was previously published by a trusted publisher but now only has provenance or no trust evidence, installation will fail. This helps prevent installing potentially compromised versions. Trust checks are based solely on publish date, not semver. A package cannot be installed if any earlier-published version had stronger trust evidence. Starting in v10.24.0, prerelease versions are ignored when evaluating trust evidence for a non-prerelease install, so a trusted prerelease cannot block a stable release that lacks trust evidence.

### trustPolicyExclude

Added in: v10.22.0

- Default: **[]**
- Type: **string[]**

A list of package selectors that should be excluded from the trust policy check. This allows you to install specific packages or versions even if they don't satisfy the `trustPolicy` requirement.

Por ejemplo:

```yaml
trustPolicy: no-downgrade
trustPolicyExclude:
  - 'chokidar@4.0.3'
  - 'webpack@4.47.0 || 5.102.1'
  - '@babel/core@7.28.5'
```

### trustPolicyIgnoreAfter

Added in: v10.27.0

- Default: **undefined**
- Type: **number (minutes)**

Allows ignoring the trust policy check for packages published more than the specified number of minutes ago. This is useful when enabling strict trust policies, as it allows older versions of packages (which may lack a process for publishing with signatures or provenance) to be installed without manual exclusion, assuming they are safe due to their age.

### blockExoticSubdeps

Added in: v10.26.0

- Default: **true**
- Type: **Boolean**

When set to `true`, only direct dependencies (those listed in your root `package.json`) may use exotic sources (like git repositories or direct tarball URLs). All transitive dependencies must be resolved from a trusted source, such as the configured registry, local file paths, workspace links, or trusted GitHub repositories (node, bun, deno).

This setting helps secure the dependency supply chain by preventing transitive dependencies from pulling in code from untrusted locations.

Exotic sources include:

- Git repositories (`git+ssh://...`)
- Direct URL links to tarballs (`https://.../package.tgz`)

### registries

Added in: v11.0.0

- Default: **undefined**
- Type: **Record&lt;string, string&gt;**

Configure registries for scoped packages in `pnpm-workspace.yaml`. The `default` key sets the main registry (equivalent to the `registry` `.npmrc` setting). Scoped keys configure registries for specific package scopes.

```yaml
registries:
  default: https://registry.npmjs.org/
  "@my-org": https://private.example.com/
  "@internal": https://nexus.corp.com/
```

## Configuración de elevación de dependencia

### hoist

- Default: **true**
- Type: **boolean**

When `true`, all dependencies are hoisted to `node_modules/.pnpm/node_modules`. This makes
unlisted dependencies accessible to all packages inside `node_modules`.

### hoistWorkspacePackages

- Default: **true**
- Type: **boolean**

When `true`, packages from the workspaces are symlinked to either `<workspace_root>/node_modules/.pnpm/node_modules` or to `<workspace_root>/node_modules` depending on other hoisting settings (`hoistPattern` and `publicHoistPattern`).

### hoistPattern

- Default: **['\*']**
- Type: **string[]**

Tells pnpm which packages should be hoisted to `node_modules/.pnpm/node_modules`. De predeterminada, todos los paquetes se elevan; sin embargo, si sabe que solo algunos paquetes tienen dependencias fantasmas, puede usar esta opción para elevar
las dependencias fantasmas (recomendado).

Por ejemplo:

```yaml
hoistPattern:
- "*eslint*"
- "*babel*"
```

You may also exclude patterns from hoisting using `!`.

Por ejemplo:

```yaml
hoistPattern:
- "*types*"
- "!@types/react"
```

### publicHoistPattern

- Default: **[]**
- Type: **string[]**

Unlike `hoistPattern`, which hoists dependencies to a hidden modules directory
inside the virtual store, `publicHoistPattern` hoists dependencies matching
the pattern to the root modules directory. Elevar al directorio de módulos raíz
significa que el código de la aplicación tendrá acceso a las dependencias fantasma,
incluso si modifican la estrategia de resolución de manera incorrecta.

Esta configuración es útil cuando se trata de algunas herramientas conectables defectuosas que
resuelven las dependencias correctamente.

Por ejemplo:

```yaml
publicHoistPattern:
- "*plugin*"
```

Note: Setting `shamefullyHoist` to `true` is the same as setting
`publicHoistPattern` to `*`.

You may also exclude patterns from hoisting using `!`.

Por ejemplo:

```yaml
publicHoistPattern:
- "*types*"
- "!@types/react"
```

### shamefullyHoist

- Default: **false**
- Type: **Boolean**

By default, pnpm creates a semistrict `node_modules`, meaning dependencies have
access to undeclared dependencies but modules outside of `node_modules` do not.
Con este diseño, la mayoría de los paquetes del ecosistema funcionan sin problemas.
However, if some tooling only works when the hoisted dependencies are in the
root of `node_modules`, you can set this to `true` to hoist them for you.

## Configuración de Node-Modules

### modulesDir

- Default: **node_modules**
- Type: **path**

The directory in which dependencies will be installed (instead of
`node_modules`).

### nodeLinker

- Default: **isolated**
- Type: **isolated**, **hoisted**, **pnp**

Define qué enlazador debe usarse para instalar paquetes de Node.

- **isolated** - dependencies are symlinked from a virtual store at `node_modules/.pnpm`.
- **hoisted** - a flat `node_modules` without symlinks is created. Same as the `node_modules` created by npm or Yarn Classic. Una de las bibliotecas de Yarn se usa para elevar, cuando se usa esta configuración. Razones legítimas para usar esta configuración:
  1. Su herramienta no funciona bien con enlaces simbólicos. A React Native project will most probably only work if you use a hoisted `node_modules`.
  2. Su proyecto se implementa en un proveedor de alojamiento sin servidor. Algunos proveedores sin servidor (por ejemplo, AWS Lambda) no admiten enlaces simbólicos. Una solución alternativa para este problema es empaquetar la aplicación antes del despliegue.
  3. If you want to publish your package with [`"bundledDependencies"`].
  4. If you are running Node.js with the [--preserve-symlinks] flag.
- **pnp** - no `node_modules`. Plug'n'Play is an innovative strategy for Node that is [used by Yarn Berry][pnp]. It is recommended to also set `symlink` setting to `false` when using `pnp` as
  your linker.

[pnp]: https://yarnpkg.com/features/pnp
[--preserve-symlinks]: https://nodejs.org/api/cli.html#cli_preserve_symlinks
[`"bundledDependencies"`]: https://docs.npmjs.com/cli/v8/configuring-npm/package-json#bundleddependencies

### symlink

- Default: **true**
- Type: **Boolean**

When `symlink` is set to `false`, pnpm creates a virtual store directory without
any symlinks. It is a useful setting together with `nodeLinker=pnp`.

### enableModulesDir

- Default: **true**
- Type: **Boolean**

When `false`, pnpm will not write any files to the modules directory
(`node_modules`). This is useful for when the modules directory is mounted with
filesystem in userspace (FUSE). There is an experimental CLI that allows you to
mount a modules directory with FUSE: [@pnpm/mount-modules].

[@pnpm/mount-modules]: https://www.npmjs.com/package/@pnpm/mount-modules

### virtualStoreDir

- Default: **node_modules/.pnpm**
- Types: **path**

El directorio con enlaces a la tienda. Todas las dependencias directas e indirectas del
proyecto están vinculadas a este directorio.

Esta es una configuración útil que puede resolver problemas con rutas largas en Windows. If
you have some dependencies with very long paths, you can select a virtual store
in the root of your drive (for instance `C:\my-project-store`).

Or you can set the virtual store to `.pnpm` and add it to `.gitignore`. Este
hará que los seguimientos de pila sean más limpios, ya que las rutas a las dependencias estarán un directorio
más arriba.

**NOTE:** the virtual store cannot be shared between several projects. Cada proyecto
debe tener su propio alamcenamiento virtual (excepto en los espacios de trabajo donde se comparte la raíz).

### virtualStoreDirMaxLength

- Por defecto
  - On Linux/macOS: **120**
  - On Windows: **60**
- Types: **number**

Sets the maximum allowed length of directory names inside the virtual store directory (`node_modules/.pnpm`). You may set this to a lower number if you encounter long path issues on Windows.

### virtualStoreOnly

Added in: v11.0.0

- Default: **false**
- Type: **Boolean**

When set to `true`, pnpm populates the virtual store without creating importer symlinks, hoisting, bin links, or running lifecycle scripts. This is useful for pre-populating a store (e.g., in Nix builds) without creating unnecessary project-level artifacts. `pnpm fetch` uses this mode internally.

### packageImportMethod

- Default: **auto**
- Type: **auto**, **hardlink**, **copy**, **clone**, **clone-or-copy**

Controls the way packages are imported from the store (if you want to disable symlinks inside `node_modules`, then you need to change the [nodeLinker] setting, not this one).

- **auto** - try to clone packages from the store. Si no se admite la clonación
  entonces vincula los paquetes del almacenamiento. Si ni la clonación ni la vinculación son
  posibles, vuelva a copiar
- **hardlink** - hard link packages from the store
- **clone-or-copy** - try to clone packages from the store. Si no se admite la clonación, vuelva a copiar
- **copy** - copy packages from the store
- **clone** - clone (AKA copy-on-write or reference link) packages from the store

La clonación es la mejor manera de escribir paquetes en node_modules. Es la forma más rápida y segura. Cuando se usa la clonación, puede editar archivos en sus node_modules y no se modificarán en el almacenamiento central de contenido direccionable.

Desafortunadamente, no todos los sistemas de archivos admiten la clonación. Recomendamos utilizar un sistema de archivos de copia en escritura (CoW) (por ejemplo, Btrfs en lugar de Ext4 en Linux) para obtener la mejor experiencia con pnpm.

[nodeLinker]: #nodeLinker

### modulesCacheMaxAge

- Default: **10080** (7 days in minutes)
- Type: **number**

El tiempo en minutos después del cual se deben eliminar los paquetes huérfanos del directorio de módulos.
pnpm mantiene un caché de paquetes en el directorio de módulos. Esto aumenta la velocidad de instalación al cambiar de
o degradar dependencias.

### dlxCacheMaxAge

- Default: **1440** (1 day in minutes)
- Type: **number**

The time in minutes after which dlx cache expires.
After executing a dlx command, pnpm keeps a cache that omits the installation step for subsequent calls to the same dlx command.

### enableGlobalVirtualStore

Added in: v10.12.1

- Default: **false**
- Type: **Boolean**

:::note

In pnpm v11, global installs (`pnpm add -g`) and `pnpm dlx` use the global virtual store by default.

:::

When enabled, `node_modules` contains only symlinks to a central virtual store, rather than to `node_modules/.pnpm`. By default, this central store is located at `<store-path>/links` (use `pnpm store path` to find `<store-path>`).

In the central virtual store, each package is hard linked into a directory whose name is the hash of its dependency graph. As a result, all projects on the system can symlink their dependencies from this shared location on disk. This approach is conceptually similar to how [NixOS manages packages], using dependency graph hashes to create isolated and shareable package directories in the Nix store.

> This should not be confused with the global content-addressable store. The actual package files are still hard linked from the content-addressable store—but instead of being linked directly into `node_modules/.pnpm`, they are linked into the global virtual store.

Using a global virtual store can significantly speed up installations when a warm cache is available. However, in CI environments (where caches are typically absent), it may slow down installation. If pnpm detects that it is running in CI, this setting is automatically disabled.

:::important

To support hoisted dependencies when using a global virtual store, pnpm relies on the `NODE_PATH` environment variable. This allows Node.js to resolve packages from the hoisted `node_modules` directory. However, **this workaround does not work with ESM modules**, because Node.js no longer respects `NODE_PATH` when using ESM.

If your dependencies are ESM and they import packages **not declared in their own `package.json`** (which is considered bad practice), you’ll likely run into resolution errors. There are two ways to fix this:

- Use [packageExtensions] to explicitly add the missing dependencies.
- Add the [@pnpm/plugin-esm-node-path] config dependency to your project. This plugin registers a custom ESM loader that restores `NODE_PATH` support for ESM, allowing hoisted dependencies to be resolved correctly.

:::

[packageExtensions]: #packageextensions
[@pnpm/plugin-esm-node-path]: https://github.com/pnpm/plugin-esm-node-path
[NixOS manages packages]: https://nixos.org/guides/how-nix-works/

## Store Settings

### storeDir

- Por defecto
  - If the **$PNPM_HOME** env variable is set, then **$PNPM_HOME/store**
  - If the **$XDG_DATA_HOME** env variable is set, then **$XDG_DATA_HOME/pnpm/store**
  - On Windows: **~/AppData/Local/pnpm/store**
  - On macOS: **~/Library/pnpm/store**
  - On Linux: **~/.local/share/pnpm/store**
- Type: **path**

La ubicación donde se guardan todos los paquetes en el disco.

El almacenamiento debe estar siempre en el mismo disco en el que se realiza la instalación,
Así que habrá un almacenamiento por disco. Si hay un directorio de inicio en el disco
actual, el almacenamiento se crea dentro de él. Si no hay un hogar en el disco,, entonces el almacenamiento se crea en la raíz del sistema de archivos. For
example, if installation is happening on a filesystem mounted at `/mnt`,
then the store will be created at `/mnt/.pnpm-store`. Lo mismo ocurre con los sistemas Windows.

Es posible configurar un almacenamiento desde un disco diferente, pero en ese caso, pnpm
copiará los paquetes del almacenamiento en lugar de vincularlos, ya que los enlaces físicos
son posibles en el mismo sistema de archivos.

### verifyStoreIntegrity

- Default: **true**
- Type: **Boolean**

By default, if a file in the store has been modified, the content of this file is checked before linking it to a project's `node_modules`. If `verifyStoreIntegrity` is set to `false`, files in the content-addressable store will not be checked during installation.

### useRunningStoreServer

:::danger

Deprecated feature

:::

- Default: **false**
- Type: **Boolean**

Solo permite la instalación con un servidor de almacenamiento. Si no se está ejecutando ningún servidor de almacenamiento,
instalación fallará.

### strictStorePkgContentCheck

- Default: **true**
- Type: **Boolean**

Some registries allow the exact same content to be published under different package names and/or versions. This breaks the validity checks of packages in the store. To avoid errors when verifying the names and versions of such packages in the store, you may set the `strictStorePkgContentCheck` setting to `false`.

## Network Settings

### httpsProxy

- Default: **null**
- Type: **url**

Un proxy para usar con solicitudes HTTPS salientes. If the `HTTPS_PROXY`, `https_proxy`,
`HTTP_PROXY` or `http_proxy` environment variables are set, their values will be
used instead.

If your proxy URL contains a username and password, make sure to URL-encode them.
Por ejemplo:

```yaml
httpsProxy: "https://use%21r:pas%2As@my.proxy:1234/foo"
```

Do not encode the colon (`:`) between the username and password.

### httpProxy

- Default: **null**
- Type: **url**

A proxy to use for outgoing HTTP requests. If the `HTTP_PROXY` or `http_proxy`
environment variables are set, proxy settings will be honored by the underlying
request library.

### noProxy

- Default: **null**
- Type: **String**

Una cadena de extensiones de dominio separadas por comas para las que no se debe usar un proxy.

### localAddress

- Default: **undefined**
- Type: **IP Address**

La dirección IP de la interfaz local que se usará al realizar conexiones con el registro npm.

### maxsockets

- Default: **networkConcurrency x 3**
- Type: **Number**

El número máximo de conexiones a usar por origen (combinación de protocolo/host/puerto).

### strictSsl

- Default: **true**
- Type: **Boolean**

Si realizar o no la validación de la clave SSL al realizar solicitudes al registro a través de
HTTPS.

## Configuración de Lockfile

### lockfile

- Default: **true**
- Type: **Boolean**

When set to `false`, pnpm won't read or generate a `pnpm-lock.yaml` file.

### preferFrozenLockfile

- Default: **true**
- Type: **Boolean**

When set to `true` and the available `pnpm-lock.yaml` satisfies the
`package.json` dependencies directive, a headless installation is performed. A
headless installation skips all dependency resolution as it does not need to
modify the lockfile.

### lockfileIncludeTarballUrl

- Default: **false**
- Type: **Boolean**

Add the full URL to the package's tarball to every entry in `pnpm-lock.yaml`.

### gitBranchLockfile

- Default: **false**
- Type: **Boolean**

When set to `true`, the generated lockfile name after installation will be named
based on the current branch name to completely avoid merge conflicts. For example,
if the current branch name is `feature-foo`, the corresponding lockfile name will
be `pnpm-lock.feature-foo.yaml` instead of `pnpm-lock.yaml`. It is typically used
in conjunction with the command line argument `--merge-git-branch-lockfiles` or by
setting `mergeGitBranchLockfilesBranchPattern` in the `pnpm-workspace.yaml` file.

### mergeGitBranchLockfilesBranchPattern

- Default: **null**
- Type: **Array or null**

This configuration matches the current branch name to determine whether to merge
all git branch lockfile files. By default, you need to manually pass the
`--merge-git-branch-lockfiles` command line parameter. This configuration allows
this process to be automatically completed.

Por ejemplo:

```yaml
mergeGitBranchLockfilesBranchPattern:
- main
- release*
```

You may also exclude patterns using `!`.

### peersSuffixMaxLength

- Default: **1000**
- Type: **number**

Max length of the peer IDs suffix added to dependency keys in the lockfile. If the suffix is longer, it is replaced with a hash.

## Ajustes de Solicitud

### gitShallowHosts

- Default: **['github.com', 'gist.github.com', 'gitlab.com', 'bitbucket.com', 'bitbucket.org']**
- Type: **string[]**

Al obtener dependencias que son repositorios de Git, si el host aparece en esta configuración, pnpm usará una clonación superficial para obtener solo la confirmación necesaria, no todo el historial.

### networkConcurrency

- Default: **auto (workers × 3 clamped to 16-64)**
- Type: **Number**

Controla el número máximo de solicitudes HTTP(S) para procesar simultáneamente.

As of v10.24.0, pnpm automatically selects a value between 16 and 64 based on the number of workers (networkConcurrency = clamp(workers × 3, 16, 64)). Set this value explicitly to override the automatic scaling.

### fetchRetries

- Default: **2**
- Type: **Number**

Cuántas veces se debe volver a intentar si pnpm no se obtiene del registro.

### fetchRetryFactor

- Default: **10**
- Type: **Number**

El factor exponencial para el retroceso de reintento.

### fetchRetryMintimeout

- Default: **10000 (10 seconds)**
- Type: **Number**

El tiempo de espera mínimo (base) para reintentar solicitudes.

### fetchRetryMaxtimeout

- Default: **60000 (1 minute)**
- Type: **Number**

El tiempo de espera de reserva máximo para garantizar que el factor de reintento no haga que las solicitudes
sean demasiado largas.

### fetchTimeout

- Default: **60000 (1 minute)**
- Type: **Number**

La cantidad máxima de tiempo de espera para que se completen las solicitudes HTTP.

### fetchWarnTimeoutMs

Added in: v10.18.0

- Default: **10000 ms (10 seconds)**
- Type: **Number**

A warning message is displayed if a metadata request to the registry takes longer than the specified threshold (in milliseconds).

### fetchMinSpeedKiBps

Added in: v10.18.0

- Default: **50 KiB/s**
- Type: **Number**

A warning message is displayed if the download speed of a tarball from the registry falls below the specified threshold (in KiB/s).

## Peer Dependency Settings

### autoInstallPeers

- Default: **true**
- Type: **Boolean**

When `true`, any missing non-optional peer dependencies are automatically installed.

#### Version Conflicts

If there are conflicting version requirements for a peer dependency from different packages, pnpm will not install any version of the conflicting peer dependency automatically. Instead, a warning is printed. For example, if one dependency requires `react@^16.0.0` and another requires `react@^17.0.0`, these requirements conflict, and no automatic installation will occur.

#### Conflict Resolution

In case of a version conflict, you'll need to evaluate which version of the peer dependency to install yourself, or update the dependencies to align their peer dependency requirements.

### dedupePeerDependents

- Default: **true**
- Type: **Boolean**

When this setting is set to `true`, packages with peer dependencies will be deduplicated after peers resolution.

For instance, let's say we have a workspace with two projects and both of them have `webpack` in their dependencies. `webpack` has `esbuild` in its optional peer dependencies, and one of the projects has `esbuild` in its dependencies. In this case, pnpm will link two instances of `webpack` to the `node_modules/.pnpm` directory: one with `esbuild` and another one without it:

```
node_modules
  .pnpm
    webpack@1.0.0_esbuild@1.0.0
    webpack@1.0.0
project1
  node_modules
    webpack -> ../../node_modules/.pnpm/webpack@1.0.0/node_modules/webpack
project2
  node_modules
    webpack -> ../../node_modules/.pnpm/webpack@1.0.0_esbuild@1.0.0/node_modules/webpack
    esbuild
```

This makes sense because `webpack` is used in two projects, and one of the projects doesn't have `esbuild`, so the two projects cannot share the same instance of `webpack`. However, this is not what most developers expect, especially since in a hoisted `node_modules`, there would only be one instance of `webpack`. Therefore, you may now use the `dedupePeerDependents` setting to deduplicate `webpack` when it has no conflicting peer dependencies (explanation at the end). In this case, if we set `dedupePeerDependents` to `true`, both projects will use the same `webpack` instance, which is the one that has `esbuild` resolved:

```
node_modules
  .pnpm
    webpack@1.0.0_esbuild@1.0.0
project1
  node_modules
    webpack -> ../../node_modules/.pnpm/webpack@1.0.0_esbuild@1.0.0/node_modules/webpack
project2
  node_modules
    webpack -> ../../node_modules/.pnpm/webpack@1.0.0_esbuild@1.0.0/node_modules/webpack
    esbuild
```

**What are conflicting peer dependencies?** By conflicting peer dependencies we mean a scenario like the following one:

```
node_modules
  .pnpm
    webpack@1.0.0_react@16.0.0_esbuild@1.0.0
    webpack@1.0.0_react@17.0.0
project1
  node_modules
    webpack -> ../../node_modules/.pnpm/webpack@1.0.0/node_modules/webpack
    react (v17)
project2
  node_modules
    webpack -> ../../node_modules/.pnpm/webpack@1.0.0_esbuild@1.0.0/node_modules/webpack
    esbuild
    react (v16)
```

In this case, we cannot dedupe `webpack` as `webpack` has `react` in its peer dependencies and `react` is resolved from two different versions in the context of the two projects.

### dedupePeers

Added in: v10.33.0

- Default: **false**
- Type: **Boolean**

When enabled, peer dependency suffixes use version-only identifiers (`name@version`) instead of full dep paths, eliminating nested suffixes like `(foo@1.0.0(bar@2.0.0))`. This dramatically reduces the number of package instances in projects with many recursive peer dependencies.

This is different from [`dedupePeerDependents`](#dedupepeerdependents), which deduplicates packages that have the same peer dependencies across different workspace projects. `dedupePeers` simplifies the peer dependency suffix format itself.

### strictPeerDependencies

- Default: **false**
- Type: **Boolean**

Si está habilitado, los comandos fallarán si falta una dependencia del par
o no es válida en el árbol.

### resolvePeersFromWorkspaceRoot

- Default: **true**
- Type: **Boolean**

Cuando está habilitado, las dependencias del proyecto del espacio de trabajo raíz se utilizan para resolver las dependencias de pares de cualquier proyecto en el espacio de trabajo.
Es una característica útil, ya que puede instalar las dependencias del mismo nivel solo en la raíz del área de trabajo y puede estar seguro de que todos los proyectos del área de trabajo utilizan las mismas versiones de las dependencias del mismo nivel.

### peerDependencyRules

#### peerDependencyRules.ignoreMissing

pnpm will not print warnings about missing peer dependencies from this list.

For instance, with the following configuration, pnpm will not print warnings if a dependency needs `react` but `react` is not installed:

```yaml
peerDependencyRules:
  ignoreMissing:
  - react
```

Package name patterns may also be used:

```yaml
peerDependencyRules:
  ignoreMissing:
  - "@babel/*"
  - "@eslint/*"
```

#### peerDependencyRules.allowedVersions

Unmet peer dependency warnings will not be printed for peer dependencies of the specified range.

For instance, if you have some dependencies that need `react@16` but you know that they work fine with `react@17`, then you may use the following configuration:

```yaml
peerDependencyRules:
  allowedVersions:
    react: "17"
```

This will tell pnpm that any dependency that has react in its peer dependencies should allow `react` v17 to be installed.

It is also possible to suppress the warnings only for peer dependencies of specific packages. For instance, with the following configuration `react` v17 will be only allowed when it is in the peer dependencies of the `button` v2 package or in the dependencies of any `card` package:

```yaml
peerDependencyRules:
  allowedVersions:
    "button@2>react": "17",
    "card>react": "17"
```

#### peerDependencyRules.allowAny

`allowAny` is an array of package name patterns, any peer dependency matching the pattern will be resolved from any version, regardless of the range specified in `peerDependencies`. Por ejemplo:

```yaml
peerDependencyRules:
  allowAny:
  - "@babel/*"
  - "eslint"
```

The above setting will mute any warnings about peer dependency version mismatches related to `@babel/` packages or `eslint`.

## Configuración de CLI

### [no-]color

- Default: **auto**
- Type: **auto**, **always**, **never**

Controla los colores en la salida.

- **auto** - output uses colors when the standard output is a terminal or TTY.
- **always** - ignore the difference between terminals and pipes. You’ll rarely
  want this; in most scenarios, if you want color codes in your redirected
  output, you can instead pass a `--color` flag to the pnpm command to force it
  to use color codes. The default setting is almost always what you’ll want.
- **never** - turns off colors. This is the setting used by `--no-color`.

### loglevel

- Default: **info**
- Type: **debug**, **info**, **warn**, **error**

Any logs at or higher than the given level will be shown.
You can instead pass `--silent` to turn off all output logs.

### useBetaCli

- Default: **false**
- Type: **Boolean**

Experimental option that enables beta features of the CLI. This means that you
may get some changes to the CLI functionality that are breaking changes, or
potentially bugs.

### recursiveInstall

- Default: **true**
- Type: **Boolean**

If this is enabled, the primary behaviour of `pnpm install` becomes that of
`pnpm install -r`, meaning the install is performed on all workspace or
subdirectory packages.

Else, `pnpm install` will exclusively build the package in the current
directory.

### engineStrict

- Default: **false**
- Type: **Boolean**

If this is enabled, pnpm will not install any package that claims to not be
compatible with the current Node version.

Regardless of this configuration, installation will always fail if a project
(not a dependency) specifies an incompatible version in its `engines` field.

### npmPath

- Type: **path**

The location of the npm binary that pnpm uses for some actions, like publishing.

### pmOnFail

Added in: v11.0.0

- Default: **download**
- Type: **download**, **error**, **warn**, **ignore**

Overrides the `onFail` behavior of both the `packageManager` field and `devEngines.packageManager` when the running pnpm version does not match the declared one.

- `download` — download and run the declared pnpm version (this is the default and matches the previous `managePackageManagerVersions: true` behavior).
- `error` — fail the command (equivalent to the previous `packageManagerStrictVersion: true`).
- `warn` — print a warning but continue (equivalent to the previous `packageManagerStrict: false` or `COREPACK_ENABLE_STRICT=0`).
- `ignore` — skip the check entirely (equivalent to the previous `managePackageManagerVersions: false`). Useful when version management is handled by an external tool such as asdf, mise, or Volta.

Can be set via CLI flag, environment variable, or `pnpm-workspace.yaml`:

```sh
pnpm install --pm-on-fail=ignore
pnpm_config_pm_on_fail=ignore pnpm install
```

```yaml title="pnpm-workspace.yaml"
pmOnFail: ignore
```

This setting replaces the removed `managePackageManagerVersions`, `packageManagerStrict`, and `packageManagerStrictVersion` settings, as well as the `COREPACK_ENABLE_STRICT` environment variable.

Migration:

| Removed setting                       | Replace with                                      |
| ------------------------------------- | ------------------------------------------------- |
| `managePackageManagerVersions: true`  | `pmOnFail: download` (default) |
| `managePackageManagerVersions: false` | `pmOnFail: ignore`                                |
| `packageManagerStrict: false`         | `pmOnFail: warn`                                  |
| `packageManagerStrictVersion: true`   | `pmOnFail: error`                                 |
| `COREPACK_ENABLE_STRICT=0`            | `pmOnFail: warn`                                  |

See also [`pnpm with`](./cli/with.md) for running pnpm at a specific version without changing this setting.

### ignoreWorkspaceRootCheck

- Default: **false**
- Type: **Boolean**

If this is enabled, running `pnpm install`/`pnpm add` from the project's root
folder will no longer error when `-w`/`--ignore-workspace-root-check` is not
provided.

## Configuración de compilación

### ignoreScripts

- Default: **false**
- Type: **Boolean**

Do not execute any scripts defined in the project `package.json` and its
dependencies.

:::note

This flag does not prevent the execution of [.pnpmfile.mjs](./pnpmfile.md)

:::

### childConcurrency

- Default: **5**
- Type: **Number**

The maximum number of child processes to allocate simultaneously to build
node_modules.

### sideEffectsCache

- Default: **true**
- Type: **Boolean**

Use and cache the results of (pre/post)install hooks.

When a pre/post install script modify the contents of a package (e.g. build output), pnpm saves the modified package in the global store. On future installs on the same machine, pnpm reuses this cached, prebuilt version—making installs significantly faster.

:::note

You may want to disable this setting if:

1. The install scripts modify files _outside_ the package directory (pnpm cannot track or cache these changes).
2. The scripts perform side effects that are unrelated to building the package.

:::

### sideEffectsCacheReadonly

- Default: **false**
- Type: **Boolean**

Only use the side effects cache if present, do not create it for new packages.

### unsafePerm

- Default: **false** IF running as root, ELSE **true**
- Type: **Boolean**

Set to true to enable UID/GID switching when running package scripts.
If set explicitly to false, then installing as a non-root user will fail.

### nodeOptions

- Default: **NULL**
- Type: **String**

Options to pass through to Node.js via the `NODE_OPTIONS` environment variable. This does not impact how pnpm itself is executed but it does impact how lifecycle scripts are called.

To preserve existing `NODE_OPTIONS` you can reference the existing environment variable using `${NODE_OPTIONS}` in your configuration:

```yaml
nodeOptions: "${NODE_OPTIONS:- } --experimental-vm-modules"
```

### verifyDepsBeforeRun

- Default: **install**
- Type: **install**, **warn**, **error**, **prompt**, **false**

This setting allows the checking of the state of dependencies before running scripts. The check runs on `pnpm run` and `pnpm exec` commands. The following values are supported:

- `install` - Automatically runs install if `node_modules` is not up to date.
- `warn` - Prints a warning if `node_modules` is not up to date.
- `prompt` - Prompts the user for permission to run install if `node_modules` is not up to date.
- `error` - Throws an error if `node_modules` is not up to date.
- `false` - Disables dependency checks.

### strictDepBuilds

Added in: v10.3.0

- Default: **true**
- Type: **Boolean**

When `strictDepBuilds` is enabled, the installation will exit with a non-zero exit code if any dependencies have unreviewed build scripts (aka postinstall scripts).

### allowBuilds

Added in: v10.26.0

A map of package matchers to explicitly allow (`true`) or disallow (`false`) script execution.

```yaml
allowBuilds:
  esbuild: true
  core-js: false
  nx@21.6.4 || 21.6.5: true
```

**Default behavior:** Packages not listed in `allowBuilds` are disallowed by default and an error is printed (since [`strictDepBuilds`](#strictdepbuilds) is `true` by default). If `strictDepBuilds` is set to `false`, a warning is printed instead.

During install, dependencies with ignored builds that are not yet listed in `allowBuilds` are automatically added to `pnpm-workspace.yaml` with a placeholder value, so you can manually set them to `true` or `false`. The [`--allow-build`](./cli/add.md) flag on `pnpm add` and `pnpm approve-builds` writes its entries here as well.

:::info Migrating from older settings

The following settings have been removed in v11 and replaced by `allowBuilds`: `onlyBuiltDependencies`, `onlyBuiltDependenciesFile`, `neverBuiltDependencies`, `ignoredBuiltDependencies`, and `ignoreDepScripts`.

Before:

```yaml
onlyBuiltDependencies:
  - electron
neverBuiltDependencies:
  - core-js
ignoredBuiltDependencies:
  - esbuild
```

After:

```yaml
allowBuilds:
  electron: true
  core-js: false
  esbuild: false
```

:::

### dangerouslyAllowAllBuilds

Added in: v10.9.0

- Default: **false**
- Type: **Boolean**

If set to `true`, all build scripts (e.g. `preinstall`, `install`, `postinstall`) from dependencies will run automatically, without requiring approval.

:::warning

This setting allows all dependencies—including transitive ones—to run install scripts, both now and in the future.
Even if your current dependency graph appears safe:

- Future updates may introduce new, untrusted dependencies.
- Existing packages may add scripts in later versions.
- Packages can be hijacked or compromised and begin executing malicious code.

For maximum safety, only enable this if you’re fully aware of the risks and trust the entire ecosystem you’re pulling from. It’s recommended to review and allow builds explicitly.

:::

## Node.js Settings

### nodeVersion

- Default: the value returned by **node -v**, without the v prefix
- Type: **exact semver version (not a range)**

The Node.js version to use when checking a package's `engines` setting.

If you want to prevent contributors of your project from adding new incompatible dependencies, use `nodeVersion` and `engineStrict` in a `pnpm-workspace.yaml` file at the root of the project:

```ini
nodeVersion: 12.22.0
engineStrict: true
```

De esta manera, incluso si alguien usa Node.js v16, no podrá instalar una nueva dependencia que no admita Node.js v12.22.0.

### runtimeOnFail

Added in: v11.0.0

- Default: **undefined**
- Type: **download**, **error**, **warn**, **ignore**

Overrides the `onFail` field of [`devEngines.runtime`](./package_json.md#devenginesruntime) (and `engines.runtime`) in the root project's `package.json`. This is useful when you want a different local behavior than what is written in the manifest — for instance, forcing pnpm to download the declared runtime even when the manifest sets `onFail: "warn"`:

```yaml title="pnpm-workspace.yaml"
runtimeOnFail: download
```

### nodeDownloadMirrors

Added in: v11.0.0

- Default: **undefined**
- Type: **Record&lt;string, string&gt;**

Configure custom Node.js download mirrors in `pnpm-workspace.yaml`. The keys are release channels (`release`, `rc`, `nightly`, `v8-canary`, etc.) and the values are base URLs.

Here is how pnpm may be configured to download Node.js from a mirror in China:

```yaml
nodeDownloadMirrors:
  release: https://npmmirror.com/mirrors/node/
  rc: https://npmmirror.com/mirrors/node-rc/
  nightly: https://npmmirror.com/mirrors/node-nightly/
```

## Otros ajustes

### savePrefix

- Default: **'^'**
- Type: **'^'**, **'~'**, **''**

Configure how versions of packages installed to a `package.json` file get
prefixed.

For example, if a package has version `1.2.3`, by default its version is set to
`^1.2.3` which allows minor upgrades for that package, but after
`pnpm config set save-prefix='~'` it would be set to `~1.2.3` which only allows
patch upgrades.

Esta configuración se ignora cuando el paquete agregado tiene un rango especificado. For
instance, `pnpm add foo@2` will set the version of `foo` in `package.json` to
`2`, regardless of the value of `savePrefix`.

### tag

- Default: **latest**
- Type: **String**

If you `pnpm add` a package and you don't provide a specific version, then it
will install the package at the version registered under the tag from this
setting.

This also sets the tag that is added to the `package@version` specified by the
`pnpm tag` command if no explicit tag is given.

### globalDir

- Por defecto
  - If the **$XDG_DATA_HOME** env variable is set, then **$XDG_DATA_HOME/pnpm/global**
  - On Windows: **~/AppData/Local/pnpm/global**
  - On macOS: **~/Library/pnpm/global**
  - On Linux: **~/.local/share/pnpm/global**
- Type: **path**

Especifique un directorio personalizado para almacenar paquetes globales.

### globalBinDir

- Por defecto
  - If the **$XDG_DATA_HOME** env variable is set, then **$XDG_DATA_HOME/pnpm/bin**
  - On Windows: **~/AppData/Local/pnpm/bin**
  - On macOS: **~/Library/pnpm/bin**
  - On Linux: **~/.local/share/pnpm/bin**
- Type: **path**

Permite establecer el directorio de destino para los archivos bin de los paquetes instalados globalmente.

:::tip

In pnpm v11, globally installed binaries are stored in a `bin` subdirectory of `PNPM_HOME` instead of directly in `PNPM_HOME`. This prevents internal directories like `global/` and `store/` from polluting shell autocompletion when `PNPM_HOME` is on PATH. After upgrading, run `pnpm setup` to update your shell configuration.

:::

### npmrcAuthFile

Added in: v11.0.0

- Default: **~/.npmrc**
- Type: **path**

The path to a file containing registry authentication tokens. By default, pnpm reads auth tokens from `~/.npmrc` as a fallback for registry authentication. Use this setting to point to a different file instead.

### stateDir

- Por defecto
  - If the **$XDG_STATE_HOME** env variable is set, then **$XDG_STATE_HOME/pnpm**
  - On Windows: **~/AppData/Local/pnpm-state**
  - On macOS: **~/.pnpm-state**
  - On Linux: **~/.local/state/pnpm**
- Type: **path**

The directory where pnpm creates the `pnpm-state.json` file that is currently used only by the update checker.

### cacheDir

- Por defecto
  - If the **$XDG_CACHE_HOME** env variable is set, then **$XDG_CACHE_HOME/pnpm**
  - On Windows: **~/AppData/Local/pnpm-cache**
  - On macOS: **~/Library/Caches/pnpm**
  - On Linux: **~/.cache/pnpm**
- Type: **path**

The location of the cache (package metadata and dlx).

### useStderr

- Default: **false**
- Type: **Boolean**

Cuando es verdadero, toda la salida se escribe en stderr.

### updateNotifier

- Default: **true**
- Type: **Boolean**

Set to `false` to suppress the update notification when using an older version of pnpm than the latest.

### preferSymlinkedExecutables

- Default: **true**, when **node-linker** is set to **hoisted** and the system is POSIX
- Type: **Boolean**

Create symlinks to executables in `node_modules/.bin` instead of command shims. Esta configuración se ignora en Windows, donde solo funcionan las correcciones de compatibilidad de comandos.

### ignoreCompatibilityDb

- Default: **false**
- Type: **Boolean**

Durante la instalación, las dependencias de algunos paquetes se parchean automáticamente. If you want to disable this, set this config to `true`.

The patches are applied from Yarn's [`@yarnpkg/extensions`] package.

### resolutionMode

- Default: **highest** (was **lowest-direct** from v8.0.0 to v8.6.12)
- Type: **highest**, **time-based**, **lowest-direct**

When `resolutionMode` is set to `time-based`, dependencies will be resolved the following way:

1. Las dependencias directas se resolverán a sus versiones más bajas. So if there is `foo@^1.1.0` in the dependencies, then `1.1.0` will be installed.
2. Las subdependencias se resolverán a partir de versiones que se publicaron antes de que se publicara la última dependencia directa.

Con este modo de resolución, las instalaciones con caché caliente son más rápidas. También reduce la posibilidad de secuestro de subdependencias, ya que las subdependencias se actualizarán solo si se actualizan las dependencias directas.

This resolution mode works only with npm's [full metadata]. Por lo tanto, es más lento en algunos escenarios. However, if you use [Verdaccio] v5.15.1 or newer, you may set the `registrySupportsTimeField` setting to `true`, and it will be really fast.

When `resolutionMode` is set to `lowest-direct`, direct dependencies will be resolved to their lowest versions.

### registrySupportsTimeField

- Default: **false**
- Type: **Boolean**

Set this to `true` if the registry that you are using returns the "time" field in the abbreviated metadata. As of now, only [Verdaccio] from v5.15.1 supports this.

### extendNodePath

- Default: **true**
- Type: **Boolean**

When `true`, pnpm sets the `NODE_PATH` environment variable in command shims
(the wrapper scripts created in `node_modules/.bin`). When `false`, `NODE_PATH`
is not set.

#### Why this is needed

pnpm's [isolated `node_modules` layout] means that a package can only access its
own declared dependencies. However, when a CLI tool runs via a command shim, some
libraries (notably [`import-local`], used by jest, eslint, and others) resolve
modules from the **current working directory** rather than from the binary's own
location. Since the working directory is the project root — not the package inside
the virtual store — the standard `node_modules` resolution from the CWD won't
find the binary's transitive dependencies.

To bridge this gap, pnpm includes two types of paths in `NODE_PATH`:

1. **The package's own dependencies directory** (e.g.,
   `.pnpm/pkg@version/node_modules`) — this allows CWD-based resolution to find
   the correct versions of the package's sibling dependencies.
2. **The hoisted `node_modules` directory** (e.g., `.pnpm/node_modules`) — this
   is the directory where hoisted packages are placed when [`hoistPattern`] is
   set. Node.js cannot discover this directory through its standard resolution
   algorithm, so it must be provided via `NODE_PATH`.

`NODE_PATH` is also essential when [`enableGlobalVirtualStore`] is enabled.
With a global virtual store, packages are symlinked from a central location
outside the project, so Node.js's standard upward `node_modules` traversal from
the binary's real path won't reach the project's own `node_modules` or its hoisted
dependencies. In this case, `NODE_PATH` must include both the project's root
`node_modules` and the hoisted directory at `node_modules/.pnpm/node_modules` to
ensure correct resolution.

#### When to disable

You may set this to `false` if you are certain that none of the CLI tools in your
project resolve modules from the working directory and you are not using a global
virtual store. Disabling it produces slightly simpler command shims.

[isolated `node_modules` layout]: ./symlinked-node-modules-structure.md
[`import-local`]: https://github.com/sindresorhus/import-local
[`hoistPattern`]: #hoistpattern
[`enableGlobalVirtualStore`]: #enableglobalvirtualstore
[`@yarnpkg/extensions`]: https://github.com/yarnpkg/berry/blob/master/packages/yarnpkg-extensions/sources/index.ts
[full metadata]: https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md#full-metadata-format
[Verdaccio]: https://verdaccio.org/

### deployAllFiles

- Default: **false**
- Type: **Boolean**

When deploying a package or installing a local package, all files of the package are copied. By default, if the package has a `"files"` field in the `package.json`, then only the listed files and directories are copied.

### dedupeDirectDeps

- Default: **false**
- Type: **Boolean**

When set to `true`, dependencies that are already symlinked to the root `node_modules` directory of the workspace will not be symlinked to subproject `node_modules` directories.

### optimisticRepeatInstall

Added in: v10.1.0

- Default: **true**
- Type: **Boolean**

When enabled, a fast check will be performed before proceeding to installation. This way a repeat install or an install on a project with everything up-to-date becomes a lot faster.

### requiredScripts

Scripts listed in this array will be required in each project of the workspace. Otherwise, `pnpm -r run <script name>` will fail.

```yaml
requiredScripts:
- build
```

import EnablePrePostScripts from './settings/_enablePrePostScripts.mdx'

<EnablePrePostScripts />

import ScriptShell from './settings/_scriptShell.mdx'

<ScriptShell />

import ShellEmulator from './settings/_shellEmulator.mdx'

<ShellEmulator />

import CatalogMode from './settings/_catalogMode.mdx'

<CatalogMode />

### ci

Added in: v10.12.1

- Default: **true** (when the environment is detected as CI)
- Type: **Boolean**

This setting explicitly tells pnpm whether the current environment is a CI (Continuous Integration) environment.

import CleanupUnusedCatalogs from './settings/_cleanupUnusedCatalogs.mdx'

<CleanupUnusedCatalogs />
