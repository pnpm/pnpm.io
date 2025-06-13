---
id: settings
title: "Settings (pnpm-workspace.yaml)"
---

pnpm gets its configuration from the command line, environment variables, `pnpm-workspace.yaml`, and
`.npmrc` files.

The `pnpm config` command can be used to read and edit the contents of the project and global configuration files.

The relevant configuration files are:

* Per-project configuration file: `/path/to/my/project/pnpm-workspace.yaml`
* Global configuration file: `~/.config/pnpm/rc` (an [INI-formatted] list of `key = value` parameters)

:::note

Authorization-related settings are handled by npm's configuration system. So, `pnpm config set registry=<value>` will actually save the setting to npm's global configuration file.

:::

Values in the configuration files may contain env variables using the `${NAME}` syntax. The env variables may also be specified with default values. Using `${NAME-fallback}` will return `fallback` if `NAME` isn't set. `${NAME:-fallback}` will return `fallback` if `NAME` isn't set, or is an empty string.

[INI-formatted]: https://en.wikipedia.org/wiki/INI_file

## Dependency Resolution

### overrides

This field allows you to instruct pnpm to override any dependency in the
dependency graph. This is useful for enforcing all your packages to use a single
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

An override may be defined as a reference to a direct dependency's spec.
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
      eslint: {
        optional: true
```

:::tip

Together with Yarn, we maintain a database of `packageExtensions` to patch broken packages in the ecosystem.
If you use `packageExtensions`, consider sending a PR upstream and contributing your extension to the [`@yarnpkg/extensions`] database.

:::

[`@yarnpkg/extensions`]: https://github.com/yarnpkg/berry/blob/master/packages/yarnpkg-extensions/sources/index.ts

### allowedDeprecatedVersions

This setting allows muting deprecation warnings of specific packages.

Example:

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

If an optional dependency has its name included in this array, it will be skipped. For example:

```yaml
ignoredOptionalDependencies:
- fsevents
- "@esbuild/*"
```

## Dependency Hoisting Settings

### hoist

* Default: **true**
* Type: **boolean**

When `true`, all dependencies are hoisted to `node_modules/.pnpm/node_modules`. This makes
unlisted dependencies accessible to all packages inside `node_modules`.

### hoistWorkspacePackages

* Default: **true**
* Type: **boolean**

When `true`, packages from the workspaces are symlinked to either `<workspace_root>/node_modules/.pnpm/node_modules` or to `<workspace_root>/node_modules` depending on other hoisting settings (`hoistPattern` and `publicHoistPattern`).

### hoistPattern

* Default: **['\*']**
* Type: **string[]**

Tells pnpm which packages should be hoisted to `node_modules/.pnpm/node_modules`. By
default, all packages are hoisted - however, if you know that only some flawed
packages have phantom dependencies, you can use this option to exclusively hoist
the phantom dependencies (recommended).

For instance:

```yaml
hoistPattern:
- "*eslint*"
- "*babel*"
```

You may also exclude patterns from hoisting using `!`.

For instance:

```yaml
hoistPattern:
- "*types*"
- "!@types/react"
```

### publicHoistPattern

* Default: **[]**
* Type: **string[]**

Unlike `hoistPattern`, which hoists dependencies to a hidden modules directory
inside the virtual store, `publicHoistPattern` hoists dependencies matching
the pattern to the root modules directory. Hoisting to the root modules
directory means that application code will have access to phantom dependencies,
even if they modify the resolution strategy improperly.

This setting is useful when dealing with some flawed pluggable tools that don't
resolve dependencies properly.

For instance:

```yaml
publicHoistPattern:
- "*plugin*"
```

Note: Setting `shamefullyHoist` to `true` is the same as setting
`publicHoistPattern` to `*`.

You may also exclude patterns from hoisting using `!`.

For instance:

```yaml
publicHoistPattern:
- "*types*"
- "!@types/react"
```

### shamefullyHoist

* Default: **false**
* Type: **Boolean**

By default, pnpm creates a semistrict `node_modules`, meaning dependencies have
access to undeclared dependencies but modules outside of `node_modules` do not.
With this layout, most of the packages in the ecosystem work with no issues.
However, if some tooling only works when the hoisted dependencies are in the
root of `node_modules`, you can set this to `true` to hoist them for you.

## Node-Modules Settings

### modulesDir

* Default: **node_modules**
* Type: **path**

The directory in which dependencies will be installed (instead of
`node_modules`).

### nodeLinker

* Default: **isolated**
* Type: **isolated**, **hoisted**, **pnp**

Defines what linker should be used for installing Node packages.

* **isolated** - dependencies are symlinked from a virtual store at `node_modules/.pnpm`.
* **hoisted** - a flat `node_modules` without symlinks is created. Same as the `node_modules` created by npm or Yarn Classic. One of Yarn's libraries is used for hoisting, when this setting is used. Legitimate reasons to use this setting:
  1. Your tooling doesn't work well with symlinks. A React Native project will most probably only work if you use a hoisted `node_modules`.
  1. Your project is deployed to a serverless hosting provider. Some serverless providers (for instance, AWS Lambda) don't support symlinks. An alternative solution for this problem is to bundle your application before deployment.
  1. If you want to publish your package with [`"bundledDependencies"`].
  1. If you are running Node.js with the [--preserve-symlinks] flag.
* **pnp** - no `node_modules`. Plug'n'Play is an innovative strategy for Node that is [used by Yarn Berry][pnp]. It is recommended to also set `symlink` setting to `false` when using `pnp` as
your linker.

[pnp]: https://yarnpkg.com/features/pnp
[--preserve-symlinks]: https://nodejs.org/api/cli.html#cli_preserve_symlinks
[`"bundledDependencies"`]: https://docs.npmjs.com/cli/v8/configuring-npm/package-json#bundleddependencies

### symlink

* Default: **true**
* Type: **Boolean**

When `symlink` is set to `false`, pnpm creates a virtual store directory without
any symlinks. It is a useful setting together with `nodeLinker=pnp`.

### enableModulesDir

* Default: **true**
* Type: **Boolean**

When `false`, pnpm will not write any files to the modules directory
(`node_modules`). This is useful for when the modules directory is mounted with
filesystem in userspace (FUSE). There is an experimental CLI that allows you to
mount a modules directory with FUSE: [@pnpm/mount-modules].

[@pnpm/mount-modules]: https://www.npmjs.com/package/@pnpm/mount-modules

### virtualStoreDir

* Default: **node_modules/.pnpm**
* Types: **path**

The directory with links to the store. All direct and indirect dependencies of
the project are linked into this directory.

This is a useful setting that can solve issues with long paths on Windows. If
you have some dependencies with very long paths, you can select a virtual store
in the root of your drive (for instance `C:\my-project-store`).

Or you can set the virtual store to `.pnpm` and add it to `.gitignore`. This
will make stacktraces cleaner as paths to dependencies will be one directory
higher.

**NOTE:** the virtual store cannot be shared between several projects. Every
project should have its own virtual store (except for in workspaces where the
root is shared).

### virtualStoreDirMaxLength

* Default:
  * On Linux/macOS: **120**
  * On Windows: **60**
* Types: **number**

Sets the maximum allowed length of directory names inside the virtual store directory (`node_modules/.pnpm`). You may set this to a lower number if you encounter long path issues on Windows.

### packageImportMethod

* Default: **auto**
* Type: **auto**, **hardlink**, **copy**, **clone**, **clone-or-copy**

Controls the way packages are imported from the store (if you want to disable symlinks inside `node_modules`, then you need to change the [nodeLinker] setting, not this one).

* **auto** - try to clone packages from the store. If cloning is not supported
then hardlink packages from the store. If neither cloning nor linking is
possible, fall back to copying
* **hardlink** - hard link packages from the store
* **clone-or-copy** - try to clone packages from the store. If cloning is not supported then fall back to copying
* **copy** - copy packages from the store
* **clone** - clone (AKA copy-on-write or reference link) packages from the store

Cloning is the best way to write packages to node_modules. It is the fastest way and safest way. When cloning is used, you may edit files in your node_modules and they will not be modified in the central content-addressable store.

Unfortunately, not all file systems support cloning. We recommend using a copy-on-write (CoW) file system (for instance, Btrfs instead of Ext4 on Linux) for the best experience with pnpm.

[nodeLinker]: #nodeLinker

### modulesCacheMaxAge

* Default: **10080** (7 days in minutes)
* Type: **number**

The time in minutes after which orphan packages from the modules directory should be removed.
pnpm keeps a cache of packages in the modules directory. This boosts installation speed when
switching branches or downgrading dependencies.

### dlxCacheMaxAge

* Default: **1440** (1 day in minutes)
* Type: **number**

The time in minutes after which dlx cache expires.
After executing a dlx command, pnpm keeps a cache that omits the installation step for subsequent calls to the same dlx command.

### enableGlobalVirtualStore

Added in: v10.12.1

* Default: **false** (always **false** in CI)
* Type: **Boolean**
* Status: **Experimental**

When enabled, `node_modules` contains only symlinks to a central virtual store, rather than to `node_modules/.pnpm`. By default, this central store is located at `<store-path>/links` (use `pnpm store path` to find `<store-path>`).

In the central virtual store, each package is hard linked into a directory whose name is the hash of its dependency graph. As a result, all projects on the system can symlink their dependencies from this shared location on disk. This approach is conceptually similar to how [NixOS manages packages], using dependency graph hashes to create isolated and shareable package directories in the Nix store.

> This should not be confused with the global content-addressable store. The actual package files are still hard linked from the content-addressable store—but instead of being linked directly into `node_modules/.pnpm`, they are linked into the global virtual store.

Using a global virtual store can significantly speed up installations when a warm cache is available. However, in CI environments (where caches are typically absent), it may slow down installation. If pnpm detects that it is running in CI, this setting is automatically disabled.

[NixOS manages packages]: https://nixos.org/guides/how-nix-works/

## Store Settings

### storeDir

* Default:
  * If the **$PNPM_HOME** env variable is set, then **$PNPM_HOME/store**
  * If the **$XDG_DATA_HOME** env variable is set, then **$XDG_DATA_HOME/pnpm/store**
  * On Windows: **~/AppData/Local/pnpm/store**
  * On macOS: **~/Library/pnpm/store**
  * On Linux: **~/.local/share/pnpm/store**
* Type: **path**

The location where all the packages are saved on the disk.

The store should be always on the same disk on which installation is happening,
so there will be one store per disk. If there is a home directory on the current
disk, then the store is created inside it. If there is no home on the disk,
then the store is created at the root of the filesystem. For
example, if installation is happening on a filesystem mounted at `/mnt`,
then the store will be created at `/mnt/.pnpm-store`. The same goes for Windows
systems.

It is possible to set a store from a different disk but in that case pnpm will
copy packages from the store instead of hard-linking them, as hard links are
only possible on the same filesystem.

### verifyStoreIntegrity

* Default: **true**
* Type: **Boolean**

By default, if a file in the store has been modified, the content of this file is checked before linking it to a project's `node_modules`. If `verifyStoreIntegrity` is set to `false`, files in the content-addressable store will not be checked during installation.

### useRunningStoreServer

:::danger

Deprecated feature

:::

* Default: **false**
* Type: **Boolean**

Only allows installation with a store server. If no store server is running,
installation will fail.

### strictStorePkgContentCheck

* Default: **true**
* Type: **Boolean**

Some registries allow the exact same content to be published under different package names and/or versions. This breaks the validity checks of packages in the store. To avoid errors when verifying the names and versions of such packages in the store, you may set the `strictStorePkgContentCheck` setting to `false`.

## Lockfile Settings

### lockfile

* Default: **true**
* Type: **Boolean**

When set to `false`, pnpm won't read or generate a `pnpm-lock.yaml` file.

### preferFrozenLockfile

* Default: **true**
* Type: **Boolean**

When set to `true` and the available `pnpm-lock.yaml` satisfies the
`package.json` dependencies directive, a headless installation is performed. A
headless installation skips all dependency resolution as it does not need to
modify the lockfile.

### lockfileIncludeTarballUrl

* Default: **false**
* Type: **Boolean**

Add the full URL to the package's tarball to every entry in `pnpm-lock.yaml`.

### gitBranchLockfile

* Default: **false**
* Type: **Boolean**

When set to `true`, the generated lockfile name after installation will be named 
based on the current branch name to completely avoid merge conflicts. For example,
if the current branch name is `feature-foo`, the corresponding lockfile name will
be `pnpm-lock.feature-foo.yaml` instead of `pnpm-lock.yaml`. It is typically used 
in conjunction with the command line argument `--merge-git-branch-lockfiles` or by
setting `mergeGitBranchLockfilesBranchPattern` in the `pnpm-workspace.yaml` file.

### mergeGitBranchLockfilesBranchPattern

* Default: **null**
* Type: **Array or null**

This configuration matches the current branch name to determine whether to merge 
all git branch lockfile files. By default, you need to manually pass the 
`--merge-git-branch-lockfiles` command line parameter. This configuration allows 
this process to be automatically completed.

For instance:

```yaml
mergeGitBranchLockfilesBranchPattern:
- main
- release*
```

You may also exclude patterns using `!`.

### peersSuffixMaxLength

* Default: **1000**
* Type: **number**

Max length of the peer IDs suffix added to dependency keys in the lockfile. If the suffix is longer, it is replaced with a hash.

## Registry & Authentication Settings

### registry

* Default: **https://registry.npmjs.org/**
* Type: **url**

The base URL of the npm package registry (trailing slash included).

#### &lt;scope\>:registry

The npm registry that should be used for packages of the specified scope. For
example, setting `@babel:registry=https://example.com/packages/npm/`
will enforce that when you use `pnpm add @babel/core`, or any `@babel` scoped
package, the package will be fetched from `https://example.com/packages/npm`
instead of the default registry.

### &lt;URL&gt;&#58;_authToken

Define the authentication bearer token to use when accessing the specified
registry. For example:

```ini
//registry.npmjs.org/:_authToken=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx 
```

You may also use an environment variable. For example:

```ini
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

Or you may just use an environment variable directly, without changing `.npmrc` at all:

```
npm_config_//registry.npmjs.org/:_authToken=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx 
```

### &lt;URL&gt;&#58;tokenHelper

A token helper is an executable which outputs an auth token. This can be used in situations where the authToken is not a constant value but is something that refreshes regularly, where a script or other tool can use an existing refresh token to obtain a new access token.

The configuration for the path to the helper must be an absolute path, with no arguments. In order to be secure, it is only permitted to set this value in the user `.npmrc`. Otherwise a project could place a value in a project's local `.npmrc` and run arbitrary executables.

Setting a token helper for the default registry:

```ini
tokenHelper=/home/ivan/token-generator
```

Setting a token helper for the specified registry:

```
//registry.corp.com:tokenHelper=/home/ivan/token-generator
```

## Request Settings

### ca

* Default: **The npm CA certificate**
* Type: **String, Array or null**

The Certificate Authority signing certificate that is trusted for SSL
connections to the registry. Values should be in PEM format (AKA
"Base-64 encoded X.509 (.CER)"). For example:

```sh
ca="-----BEGIN CERTIFICATE-----\nXXXX\nXXXX\n-----END CERTIFICATE-----"
```

Set to null to only allow known registrars, or to a specific CA cert to trust
only that specific signing authority.

Multiple CAs can be trusted by specifying an array of certificates:

```sh
ca[]="..."
ca[]="..."
```

See also the `strict-ssl` config.

### cafile

* Default: **null**
* Type: **path**

A path to a file containing one or multiple Certificate Authority signing
certificates. Similar to the `ca` setting, but allows for multiple CAs, as well
as for the CA information to be stored in a file instead of being specified via
CLI.

### &lt;URL&gt;&#58;cafile

Define the path to a Certificate Authority file to use when accessing the specified
registry. For example:

```sh
//registry.npmjs.org/:cafile=ca-cert.pem
```

### cert

* Default: **null**
* Type: **String**

A client certificate to pass when accessing the registry. Values should be in
PEM format (AKA "Base-64 encoded X.509 (.CER)"). For example:

```test
cert="-----BEGIN CERTIFICATE-----\nXXXX\nXXXX\n-----END CERTIFICATE-----"
```

It is not the path to a certificate file.

### &lt;URL&gt;&#58;certfile

Define the path to a certificate file to use when accessing the specified
registry. For example:

```sh
//registry.npmjs.org/:certfile=server-cert.pem
```

### key

* Default: **null**
* Type: **String**

A client key to pass when accessing the registry. Values should be in PEM format
(AKA "Base-64 encoded X.509 (.CER)"). For example:

```sh
key="-----BEGIN PRIVATE KEY-----\nXXXX\nXXXX\n-----END PRIVATE KEY-----"
```

It is not the path to a key file (and there is no `keyfile` option).

This setting contains sensitive information. Don't write it to a local `.npmrc` file committed to the repository.

### &lt;URL&gt;&#58;keyfile

Define the path to a client key file to use when accessing the specified
registry. For example:

```sh
//registry.npmjs.org/:keyfile=server-key.pem
```

### gitShallowHosts

* Default: **['github.com', 'gist.github.com', 'gitlab.com', 'bitbucket.com', 'bitbucket.org']**
* Type: **string[]**

When fetching dependencies that are Git repositories, if the host is listed in this setting, pnpm will use shallow cloning to fetch only the needed commit, not all the history.

### https-proxy

* Default: **null**
* Type: **url**

A proxy to use for outgoing HTTPS requests. If the `HTTPS_PROXY`, `https_proxy`,
`HTTP_PROXY` or `http_proxy` environment variables are set, their values will be
used instead.

If your proxy URL contains a username and password, make sure to URL-encode them.
For instance:

```ini
https-proxy=https://use%21r:pas%2As@my.proxy:1234/foo
```

Do not encode the colon (`:`) between the username and password.

### http-proxy
### proxy

* Default: **null**
* Type: **url**

A proxy to use for outgoing http requests. If the HTTP_PROXY or http_proxy
environment variables are set, proxy settings will be honored by the underlying
request library.

### local-address

* Default: **undefined**
* Type: **IP Address**

The IP address of the local interface to use when making connections to the npm
registry.

### maxsockets

* Default: **networkConcurrency x 3**
* Type: **Number**

The maximum number of connections to use per origin (protocol/host/port combination).

### noproxy

* Default: **null**
* Type: **String**

A comma-separated string of domain extensions that a proxy should not be used for.

### strict-ssl

* Default: **true**
* Type: **Boolean**

Whether or not to do SSL key validation when making requests to the registry via
HTTPS.

See also the `ca` option.

### networkConcurrency

* Default: **16**
* Type: **Number**

Controls the maximum number of HTTP(S) requests to process simultaneously.

### fetchRetries

* Default: **2**
* Type: **Number**

How many times to retry if pnpm fails to fetch from the registry.

### fetchRetryFactor

* Default: **10**
* Type: **Number**

The exponential factor for retry backoff.

### fetchRetryMintimeout

* Default: **10000 (10 seconds)**
* Type: **Number**

The minimum (base) timeout for retrying requests.

### fetchRetryMaxtimeout

* Default: **60000 (1 minute)**
* Type: **Number**

The maximum fallback timeout to ensure the retry factor does not make requests
too long.

### fetchTimeout

* Default: **60000 (1 minute)**
* Type: **Number**

The maximum amount of time to wait for HTTP requests to complete.

## Peer Dependency Settings

### autoInstallPeers

* Default: **true**
* Type: **Boolean**

When `true`, any missing non-optional peer dependencies are automatically installed.

#### Version Conflicts

If there are conflicting version requirements for a peer dependency from different packages, pnpm will not install any version of the conflicting peer dependency automatically. Instead, a warning is printed. For example, if one dependency requires `react@^16.0.0` and another requires `react@^17.0.0`, these requirements conflict, and no automatic installation will occur.

#### Conflict Resolution

In case of a version conflict, you'll need to evaluate which version of the peer dependency to install yourself, or update the dependencies to align their peer dependency requirements.

### dedupePeerDependents

* Default: **true**
* Type: **Boolean**

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

### strictPeerDependencies

* Default: **false**
* Type: **Boolean**

If this is enabled, commands will fail if there is a missing or invalid peer
dependency in the tree.

### resolvePeersFromWorkspaceRoot

* Default: **true**
* Type: **Boolean**

When enabled, dependencies of the root workspace project are used to resolve peer dependencies of any projects in the workspace.
It is a useful feature as you can install your peer dependencies only in the root of the workspace, and you can be sure that all projects in the workspace use the same versions of the peer dependencies.

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

`allowAny` is an array of package name patterns, any peer dependency matching the pattern will be resolved from any version, regardless of the range specified in `peerDependencies`. For instance:

```yaml
peerDependencyRules:
  allowAny:
  - "@babel/*"
  - "eslint"
```

The above setting will mute any warnings about peer dependency version mismatches related to `@babel/` packages or `eslint`.

## CLI Settings

### [no-]color

* Default: **auto**
* Type: **auto**, **always**, **never**

Controls colors in the output.

* **auto** - output uses colors when the standard output is a terminal or TTY.
* **always** - ignore the difference between terminals and pipes. You’ll rarely
  want this; in most scenarios, if you want color codes in your redirected
  output, you can instead pass a `--color` flag to the pnpm command to force it
  to use color codes. The default setting is almost always what you’ll want.
* **never** - turns off colors. This is the setting used by `--no-color`.

### loglevel

* Default: **info**
* Type: **debug**, **info**, **warn**, **error**

Any logs at or higher than the given level will be shown.
You can instead pass `--silent` to turn off all output logs.

### useBetaCli

* Default: **false**
* Type: **Boolean**

Experimental option that enables beta features of the CLI. This means that you
may get some changes to the CLI functionality that are breaking changes, or
potentially bugs.

### recursiveInstall

* Default: **true**
* Type: **Boolean**

If this is enabled, the primary behaviour of `pnpm install` becomes that of
`pnpm install -r`, meaning the install is performed on all workspace or
subdirectory packages.

Else, `pnpm install` will exclusively build the package in the current
directory.

### engineStrict

* Default: **false**
* Type: **Boolean**

If this is enabled, pnpm will not install any package that claims to not be
compatible with the current Node version.

Regardless of this configuration, installation will always fail if a project
(not a dependency) specifies an incompatible version in its `engines` field.

### npmPath

* Type: **path**

The location of the npm binary that pnpm uses for some actions, like publishing.

### packageManagerStrict

* Default: **true**
* Type: **Boolean**

If this setting is disabled, pnpm will not fail if a different package manager is specified in the `packageManager` field of `package.json`. When enabled, only the package name is checked (since pnpm v9.2.0), so you can still run any version of pnpm regardless of the version specified in the `packageManager` field.

Alternatively, you can disable this setting by setting the `COREPACK_ENABLE_STRICT` environment variable to `0`.

### packageManagerStrictVersion

* Default: **false**
* Type: **Boolean**

When enabled, pnpm will fail if its version doesn't exactly match the version specified in the `packageManager` field of `package.json`.

### managePackageManagerVersions

* Default: **true**
* Type: **Boolean**

When enabled, pnpm will automatically download and run the version of pnpm specified in the `packageManager` field of `package.json`. This is the same field used by Corepack. Example:

```json
{
  "packageManager": "pnpm@9.3.0"
}
```

## Build Settings

### ignoreScripts

* Default: **false**
* Type: **Boolean**

Do not execute any scripts defined in the project `package.json` and its
dependencies.

:::note

This flag does not prevent the execution of [.pnpmfile.cjs](./pnpmfile.md)

:::

### ignoreDepScripts

* Default: **false**
* Type: **Boolean**

Do not execute any scripts of the installed packages. Scripts of the projects are executed.

:::note

Since v10, pnpm doesn't run the lifecycle scripts of dependencies unless they are listed in [`onlyBuiltDependencies`].

:::

[`onlyBuiltDependencies`]: settings.md#onlybuiltdependencies

### childConcurrency

* Default: **5**
* Type: **Number**

The maximum number of child processes to allocate simultaneously to build
node_modules.

### sideEffectsCache

* Default: **true**
* Type: **Boolean**

Use and cache the results of (pre/post)install hooks.

When a pre/post install script modify the contents of a package (e.g. build output), pnpm saves the modified package in the global store. On future installs on the same machine, pnpm reuses this cached, prebuilt version—making installs significantly faster.

:::note

You may want to disable this setting if:

1. The install scripts modify files *outside* the package directory (pnpm cannot track or cache these changes).
1. The scripts perform side effects that are unrelated to building the package.

:::

### sideEffectsCacheReadonly

* Default: **false**
* Type: **Boolean**

Only use the side effects cache if present, do not create it for new packages.

### unsafePerm

* Default: **false** IF running as root, ELSE **true**
* Type: **Boolean**

Set to true to enable UID/GID switching when running package scripts.
If set explicitly to false, then installing as a non-root user will fail.

### nodeOptions

* Default: **NULL**
* Type: **String**

Options to pass through to Node.js via the `NODE_OPTIONS` environment variable. This does not impact how pnpm itself is executed but it does impact how lifecycle scripts are called.

### verifyDepsBeforeRun

* Default: **false**
* Type: **install**, **warn**, **error**, **prompt**, **false**

This setting allows the checking of the state of dependencies before running scripts. The check runs on `pnpm run` and `pnpm exec` commands. The following values are supported:

- `install` - Automatically runs install if `node_modules` is not up to date.
- `warn` - Prints a warning if `node_modules` is not up to date.
- `prompt` - Prompts the user for permission to run install if `node_modules` is not up to date.
- `error` - Throws an error if `node_modules` is not up to date.
- `false` - Disables dependency checks.

### strictDepBuilds

Added in: v10.3.0

* Default: **false**
* Type: **Boolean**

When `strictDepBuilds` is enabled, the installation will exit with a non-zero exit code if any dependencies have unreviewed build scripts (aka postinstall scripts).

### neverBuiltDependencies

This field allows to ignore the builds of specific dependencies.
The "preinstall", "install", and "postinstall" scripts of the listed packages will not be executed during installation.

An example of the `neverBuiltDependencies` field:

```yaml
neverBuiltDependencies:
- fsevents
- level
```

### onlyBuiltDependencies

A list of package names that are allowed to be executed during installation. Only packages listed in this array will be able to run install scripts. If `onlyBuiltDependenciesFile` and `neverBuiltDependencies` are not set, this configuration option will default to blocking all install scripts.

Example:

```yaml
onlyBuiltDependencies:
- fsevents
```

### onlyBuiltDependenciesFile

This configuration option allows users to specify a JSON file that lists the only packages permitted to run installation scripts during the pnpm install process. By using this, you can enhance security or ensure that only specific dependencies execute scripts during installation.

Example:

```yaml
configDependencies:
  '@pnpm/trusted-deps': 0.1.0+sha512-IERT0uXPBnSZGsCmoSuPzYNWhXWWnKkuc9q78KzLdmDWJhnrmvc7N4qaHJmaNKIusdCH2riO3iE34Osohj6n8w==
onlyBuiltDependenciesFile: node_modules/.pnpm-config/@pnpm/trusted-deps/allow.json
```

The JSON file itself should contain an array of package names:

```json title="node_modules/.pnpm-config/@pnpm/trusted-deps/allow.json"
[
  "@airbnb/node-memwatch",
  "@apollo/protobufjs",
  ...
]
```

### ignoredBuiltDependencies

Added in: v10.1.0

A list of package names that should not be built during installation.

Example:

```yaml
ignoredBuiltDependencies:
- fsevents
```

### dangerouslyAllowAllBuilds

Added in: v10.9.0

* Default: **false**
* Type: **Boolean**

If set to `true`, all build scripts (e.g. `preinstall`, `install`, `postinstall`) from dependencies will run automatically, without requiring approval.

:::warning

This setting allows all dependencies—including transitive ones—to run install scripts, both now and in the future.
Even if your current dependency graph appears safe:

* Future updates may introduce new, untrusted dependencies.
* Existing packages may add scripts in later versions.
* Packages can be hijacked or compromised and begin executing malicious code.

For maximum safety, only enable this if you’re fully aware of the risks and trust the entire ecosystem you’re pulling from. It’s recommended to review and allow builds explicitly.

:::

## Node.js Settings

### useNodeVersion

* Default: **undefined**
* Type: **semver**

Specifies which exact Node.js version should be used for the project's runtime.
pnpm will automatically install the specified version of Node.js and use it for
running `pnpm run` commands or the `pnpm node` command.

This may be used instead of `.nvmrc` and `nvm`. Instead of the following `.nvmrc` file:

```
16.16.0
```

Use this `pnpm-workspace.yaml` file:

```yaml
useNodeVersion: 16.16.0
```

This setting works only in a `pnpm-workspace.yaml` file that is in the root of your workspace. If you need to specify a custom Node.js for a project in the workspace, use the [`executionEnv.nodeVersion`] field of `package.json` instead.

[`executionEnv.nodeVersion`]: ./settings.md.md#pnpmexecutionenvnodeversion

### nodeVersion

* Default: the value returned by **node -v**, without the v prefix
* Type: **semver**

The Node.js version to use when checking a package's `engines` setting.

If you want to prevent contributors of your project from adding new incompatible dependencies, use `nodeVersion` and `engineStrict` in a `pnpm-workspace.yaml` file at the root of the project:

```ini
nodeVersion: 12.22.0
engineStrict: true
```

This way, even if someone is using Node.js v16, they will not be able to install a new dependency that doesn't support Node.js v12.22.0.

### node-mirror

* Default: **`https://nodejs.org/download/<releaseDir>/`**
* Type: **URL**

Sets the base URL for downloading Node.js. The `<releaseDir>` portion of this setting can be any directory from [https://nodejs.org/download]: `release`, `rc`, `nightly`, `v8-canary`, etc.

Here is how pnpm may be configured to download Node.js from Node.js mirror in China:

```
node-mirror:release=https://npmmirror.com/mirrors/node/
node-mirror:rc=https://npmmirror.com/mirrors/node-rc/
node-mirror:nightly=https://npmmirror.com/mirrors/node-nightly/
```

[https://nodejs.org/download]: https://nodejs.org/download

### executionEnv.nodeVersion

Specifies which exact Node.js version should be used for the project's runtime.
pnpm will automatically install the specified version of Node.js and use it for
running `pnpm run` commands or the `pnpm node` command.

For example:

```json
executionEnv:
  nodeVersion: 16.16.0
```

## Workspace Settings

### linkWorkspacePackages

* Default: **false**
* Type: **true**, **false**, **deep**

If this is enabled, locally available packages are linked to `node_modules`
instead of being downloaded from the registry. This is very convenient in a
monorepo. If you need local packages to also be linked to subdependencies, you
can use the `deep` setting.

Else, packages are downloaded and installed from the registry. However,
workspace packages can still be linked by using the `workspace:` range protocol.

Packages are only linked if their versions satisfy the dependency ranges.

### injectWorkspacePackages

* Default: **false**
* Type: **Boolean**

Enables hard-linking of all local workspace dependencies instead of symlinking them. Alternatively, this can be achieved using [`dependenciesMeta[].injected`](package_json.md#dependenciesmetainjected), which allows to selectively enable hard-linking for specific dependencies.

### syncInjectedDepsAfterScripts

Added in: v10.5.0

* Default: **undefined**
* Type: **String[]**

Injected workspace dependencies are collections of hardlinks, which don't add or remove the files when their sources change. This causes problems in packages that need to be built (such as in TypeScript projects).

This setting is a list of script names. When any of these scripts are executed in a workspace package, the injected dependencies inside `node_modules` will also be synchronized.

### preferWorkspacePackages

* Default: **false**
* Type: **Boolean**

If this is enabled, local packages from the workspace are preferred over
packages from the registry, even if there is a newer version of the package in
the registry.

This setting is only useful if the workspace doesn't use
`saveWorkspaceProtocol`.

### sharedWorkspaceLockfile

* Default: **true**
* Type: **Boolean**

If this is enabled, pnpm creates a single `pnpm-lock.yaml` file in the root of
the workspace. This also means that all dependencies of workspace packages will
be in a single `node_modules` (and get symlinked to their package `node_modules`
folder for Node's module resolution).

Advantages of this option:
* every dependency is a singleton
* faster installations in a monorepo
* fewer changes in code reviews as they are all in one file

:::note

Even though all the dependencies will be hard linked into the root
`node_modules`, packages will have access only to those dependencies
that are declared in their `package.json`, so pnpm's strictness is preserved.
This is a result of the aforementioned symbolic linking.

:::

### saveWorkspaceProtocol

* Default: **rolling**
* Type: **true**, **false**, **rolling**

This setting controls how dependencies that are linked from the workspace are added to `package.json`.

If `foo@1.0.0` is in the workspace and you run `pnpm add foo` in another project of the workspace, below is how `foo` will be added to the dependencies field. The `savePrefix` setting also influences how the spec is created.

| saveWorkspaceProtocol | savePrefix | spec |
|--|--|--|
| false | `''` | `1.0.0` |
| false | `'~'` | `~1.0.0` |
| false | `'^'` | `^1.0.0` |
| true | `''` | `workspace:1.0.0` |
| true | `'~'` | `workspace:~1.0.0` |
| true | `'^'` | `workspace:^1.0.0` |
| rolling | `''` | `workspace:*` |
| rolling | `'~'` | `workspace:~` |
| rolling | `'^'` | `workspace:^` |

### includeWorkspaceRoot

* Default: **false**
* Type: **Boolean**

When executing commands recursively in a workspace, execute them on the root workspace project as well.

### ignoreWorkspaceCycles

* Default: **false**
* Type: **Boolean**

When set to `true`, no workspace cycle warnings will be printed.

### disallowWorkspaceCycles

* Default: **false**
* Type: **Boolean**

When set to `true`, installation will fail if the workspace has cycles.

## Deploy Settings

### forceLegacyDeploy

* Default: **false**
* Type: **Boolean**

By default, `pnpm deploy` will try creating a dedicated lockfile from a shared lockfile for deployment. If this setting is set to `true`, the legacy `deploy` behavior will be used.

## Patching Dependencies

### patchedDependencies

This field is added/updated automatically when you run [pnpm patch-commit]. It defines patches for dependencies using a dictionary where:

[pnpm patch-commit]: ./cli/patch-commit.md

* **Keys**: Package names with an exact version, a version range, or just the name.
* **Values**: Relative paths to patch files.

Example:

```yaml
patchedDependencies:
  express@4.18.1: patches/express@4.18.1.patch
```

Dependencies can be patched by version range. The priority order is:

1. Exact versions (highest priority)
2. Version ranges
3. Name-only patches (applies to all versions unless overridden)

A special case: the version range `*` behaves like a name-only patch but does not ignore patch failures.

Exampe:

```yaml
patchedDependencies:
  foo: patches/foo-1.patch
  foo@^2.0.0: patches/foo-2.patch
  foo@2.1.0: patches/foo-3.patch
```

* `patches/foo-3.patch` is applied to `foo@2.1.0`.
* `patches/foo-2.patch` applies to all foo versions matching `^2.0.0`, except `2.1.0`.
* `patches/foo-1.patch` applies to all other foo versions.

Avoid overlapping version ranges. If you need to specialize a sub-range, explicitly exclude it from the broader range.

Example:

```yaml
patchedDependencies:
  # Specialized sub-range
  "foo@2.2.0-2.8.0": patches/foo.2.2.0-2.8.0.patch
  # General patch, excluding the sub-range above
  "foo@>=2.0.0 <2.2.0 || >2.8.0": patches/foo.gte2.patch
```

In most cases, defining an exact version is enough to override a broader range.

### allowUnusedPatches

Added in: v10.7.0 (Previously named `allowNonAppliedPatches`)

* Default: **false**
* Type: **Boolean**

When `true`, installation won't fail if some of the patches from the `patchedDependencies` field were not applied.

```json
patchedDependencies:
  express@4.18.1: patches/express@4.18.1.patch
allowUnusedPatches: true
```

### ignorePatchFailures

Added in: v10.7.0

* Default: **undefined**
* Type: **Boolean**, **undefined**

Controls how patch failures are handled.

Behaviour:

* **undefined (default)**:
  * Errors out when a patch with an exact version or version range fails.
  * Ignores failures from name-only patches.
* **false**: Errors out for any patch failure.
* **true**: Prints a warning instead of failing when any patch cannot be applied.

## Audit Settings

### auditConfig

#### auditConfig.ignoreCves

A list of CVE IDs that will be ignored by the [`pnpm audit`] command.

```yaml
auditConfig:
  ignoreCves:
    - CVE-2022-36313
```

[`pnpm audit`]: ./cli/audit.md

#### auditConfig.ignoreGhsas

A list of GHSA Codes that will be ignored by the [`pnpm audit`] command.

```yaml
auditConfig:
  ignoreGhsas:
    - GHSA-42xw-2xvc-qx8m
    - GHSA-4w2v-q235-vp99
    - GHSA-cph5-m8f7-6c5x
    - GHSA-vh95-rmgr-6w4m
```

[`pnpm audit`]: ./cli/audit.md

## Other Settings

### savePrefix

* Default: **'^'**
* Type: **'^'**, **'~'**, **''**

Configure how versions of packages installed to a `package.json` file get
prefixed.

For example, if a package has version `1.2.3`, by default its version is set to
`^1.2.3` which allows minor upgrades for that package, but after
`pnpm config set save-prefix='~'` it would be set to `~1.2.3` which only allows
patch upgrades.

This setting is ignored when the added package has a range specified. For
instance, `pnpm add foo@2` will set the version of `foo` in `package.json` to
`2`, regardless of the value of `savePrefix`.

### tag

* Default: **latest**
* Type: **String**

If you `pnpm add` a package and you don't provide a specific version, then it
will install the package at the version registered under the tag from this
setting.

This also sets the tag that is added to the `package@version` specified by the
`pnpm tag` command if no explicit tag is given.

### globalDir

* Default:
  * If the **$XDG_DATA_HOME** env variable is set, then **$XDG_DATA_HOME/pnpm/global**
  * On Windows: **~/AppData/Local/pnpm/global**
  * On macOS: **~/Library/pnpm/global**
  * On Linux: **~/.local/share/pnpm/global**
* Type: **path**

Specify a custom directory to store global packages.

### globalBinDir

* Default:
  * If the **$XDG_DATA_HOME** env variable is set, then **$XDG_DATA_HOME/pnpm**
  * On Windows: **~/AppData/Local/pnpm**
  * On macOS: **~/Library/pnpm**
  * On Linux: **~/.local/share/pnpm**
* Type: **path**

Allows to set the target directory for the bin files of globally installed packages.

### stateDir

* Default:
  * If the **$XDG_STATE_HOME** env variable is set, then **$XDG_STATE_HOME/pnpm**
  * On Windows: **~/AppData/Local/pnpm-state**
  * On macOS: **~/.pnpm-state**
  * On Linux: **~/.local/state/pnpm**
* Type: **path**

The directory where pnpm creates the `pnpm-state.json` file that is currently used only by the update checker.

### cacheDir

* Default:
  * If the **$XDG_CACHE_HOME** env variable is set, then **$XDG_CACHE_HOME/pnpm**
  * On Windows: **~/AppData/Local/pnpm-cache**
  * On macOS: **~/Library/Caches/pnpm**
  * On Linux: **~/.cache/pnpm**
* Type: **path**

The location of the cache (package metadata and dlx).

### useStderr

* Default: **false**
* Type: **Boolean**

When true, all the output is written to stderr.

### updateNotifier

* Default: **true**
* Type: **Boolean**

Set to `false` to suppress the update notification when using an older version of pnpm than the latest.

### preferSymlinkedExecutables

* Default: **true**, when **node-linker** is set to **hoisted** and the system is POSIX
* Type: **Boolean**

Create symlinks to executables in `node_modules/.bin` instead of command shims. This setting is ignored on Windows, where only command shims work.

### ignoreCompatibilityDb

* Default: **false**
* Type: **Boolean**

During installation the dependencies of some packages are automatically patched. If you want to disable this, set this config to `false`.

The patches are applied from Yarn's [`@yarnpkg/extensions`] package.

### resolutionMode

* Default: **highest** (was **lowest-direct** from v8.0.0 to v8.6.12)
* Type: **highest**, **time-based**, **lowest-direct**

When `resolutionMode` is set to `time-based`, dependencies will be resolved the following way:

1. Direct dependencies will be resolved to their lowest versions. So if there is `foo@^1.1.0` in the dependencies, then `1.1.0` will be installed.
1. Subdependencies will be resolved from versions that were published before the last direct dependency was published.

With this resolution mode installations with warm cache are faster. It also reduces the chance of subdependency hijacking as subdependencies will be updated only if direct dependencies are updated.

This resolution mode works only with npm's [full metadata]. So it is slower in some scenarios. However, if you use [Verdaccio] v5.15.1 or newer, you may set the `registrySupportsTimeField` setting to `true`, and it will be really fast.

When `resolutionMode` is set to `lowest-direct`, direct dependencies will be resolved to their lowest versions.

### registrySupportsTimeField

* Default: **false**
* Type: **Boolean**

Set this to `true` if the registry that you are using returns the "time" field in the abbreviated metadata. As of now, only [Verdaccio] from v5.15.1 supports this.

### extendNodePath

* Default: **true**
* Type: **Boolean**

When `false`, the `NODE_PATH` environment variable is not set in the command shims.

[`@yarnpkg/extensions`]: https://github.com/yarnpkg/berry/blob/master/packages/yarnpkg-extensions/sources/index.ts
[full metadata]: https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md#full-metadata-format
[Verdaccio]: https://verdaccio.org/

### deployAllFiles

* Default: **false**
* Type: **Boolean**

When deploying a package or installing a local package, all files of the package are copied. By default, if the package has a `"files"` field in the `package.json`, then only the listed files and directories are copied.

### dedupeDirectDeps

* Default: **false**
* Type: **Boolean**

When set to `true`, dependencies that are already symlinked to the root `node_modules` directory of the workspace will not be symlinked to subproject `node_modules` directories.

### dedupeInjectedDeps

* Default: **true**
* Type: **Boolean**

When this setting is enabled, [dependencies that are injected](package_json.md#dependenciesmetainjected) will be symlinked from the workspace whenever possible. If the dependent project and the injected dependency reference the same peer dependencies, then it is not necessary to physically copy the injected dependency into the dependent's `node_modules`; a symlink is sufficient.

### optimisticRepeatInstall

Added in: v10.1.0

* Default: **true**
* Type: **Boolean**

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

* Default: **true** (when the environment is detected as CI)
* Type: **Boolean**

This setting explicitly tells pnpm whether the current environment is a CI (Continuous Integration) environment.
