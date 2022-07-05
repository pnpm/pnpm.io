---
id: npmrc
title: ".npmrc"
---

pnpm uses \*`.npmrc` files to make pnpm even more configurable!

`.npmrc` can be added adjecent to `package.json` or `pnpm-workspace.yaml` files anywhere more configuration is required.

In example, if installing peerDependencies is required in a project, you can create a `.npmrc` file adjacent to `package.json` file containing peerDependencies. By adding the necessary key value pair to the `.npmrc` exactly as labeled below.

```txt
auto-install-peers=true
```

Once, `pnpm install` is run, pnpm will automatically install the peerDependencies!

Listed below are all of the `pnpm` configuration options supported via `.npmrc` configuration files.

## Dependency Hoisting Settings

### hoist

* Default: **true**
* Type: **boolean**

When `true`, all dependencies are hoisted to `node_modules/.pnpm`. This makes
unlisted dependencies accessible to all packages inside `node_modules`.

### hoist-pattern

* Default: **['\*']**
* Type: **string[]**

Tells pnpm which packages should be hoisted to `node_modules/.pnpm`. By
default, all packages are hoisted - however, if you know that only some flawed
packages have phantom dependencies, you can use this option to exclusively hoist
the phantom dependencies (recommended).

For instance:

```sh
hoist-pattern[]=*eslint*
hoist-pattern[]=*babel*
```

### public-hoist-pattern

* Default: **['\*eslint\*', '\*prettier\*']**
* Type: **string[]**

Unlike `hoist-pattern`, which hoists dependencies to a hidden modules directory
inside the virtual store, `public-hoist-pattern` hoists dependencies matching
the pattern to the root modules directory. Hoisting to the root modules
directory means that application code will have access to phantom dependencies,
even if they modify the resolution strategy improperly.

This setting is useful when dealing with some flawed pluggable tools that don't
resolve dependencies properly.

For instance:

```sh
public-hoist-pattern[]=*plugin*
```

Note: Setting `shamefully-hoist` to `true` is the same as setting
`public-hoist-pattern` to `*`.

### shamefully-hoist

* Default: **false**
* Type: **Boolean**

By default, pnpm creates a semistrict `node_modules`, meaning dependencies have
access to undeclared dependencies but modules outside of `node_modules` do not.
With this layout, most of the packages in the ecosystem work with no issues.
However, if some tooling only works when the hoisted dependencies are in the
root of `node_modules`, you can set this to `true` to hoist them for you.

## Node-Modules Settings

### store-dir

* Default:
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

### modules-dir

* Default: **node_modules**
* Type: **path**

The directory in which dependencies will be installed (instead of
`node_modules`).

### node-linker

* Default: **isolated**
* Type: **isolated**, **hoisted**, **pnp**

Defines what linker should be used for installing Node packages.

* **isolated** - dependencies are symlinked from a virtual store at `node_modules/.pnpm`.
* **hoisted** - a flat `node_modules` without symlinks is created. Same as the `node_modules` created by npm or Yarn Classic. Legitimate reasons to use this setting:
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
any symlinks. It is a useful setting together with `node-linker=pnp`.

### enable-modules-dir

* Default: **true**
* Type: **Boolean**

When `false`, pnpm will not write any files to the modules directory
(`node_modules`). This is useful for when the modules directory is mounted with
filesystem in userspace (FUSE). There is an experimental CLI that allows you to
mount a modules directory with FUSE: [@pnpm/mount-modules].

[@pnpm/mount-modules]: https://www.npmjs.com/package/@pnpm/mount-modules

### virtual-store-dir

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

### package-import-method

* Default: **auto**
* Type: **auto**, **hardlink**, **copy**, **clone**, **clone-or-copy**

Controls the way packages are imported from the store.

* **auto** - try to clone packages from the store. If cloning is not supported
then hardlink packages from the store. If neither cloning nor linking is
possible, fall back to copying
* **hardlink** - hard link packages from the store
* **clone-or-copy** - try to clone packages from the store. If cloning is not supported then fall back to copying
* **copy** - copy packages from the store
* **clone** - clone (AKA copy-on-write or reference link) packages from the store

### modules-cache-max-age

* Default: **10080** (7 days in minutes)
* Type: **number**

The time in minutes after which orphan packages from the modules directory should be removed.
pnpm keeps a cache of packages in the modules directory. This boosts installation speed when
switching branches or downgrading dependencies.

## Lockfile Settings

### lockfile

* Default: **true**
* Type: **Boolean**

When set to `false`, pnpm won't read or generate a `pnpm-lock.yaml` file.

### prefer-frozen-lockfile

* Default: **true**
* Type: **Boolean**

When set to `true` and the available `pnpm-lock.yaml` satisfies the
`package.json` dependencies directive, a headless installation is performed. A
headless installation skips all dependency resolution as it does not need to
modify the lockfile.


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

### &lt;URL\>:_authToken

Define the authentication bearer token to use when accessing the specified
registry. For example:

```sh
//registry.npmjs.org/:_authToken=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

You may also use an environment variable. For example:

```
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

### &lt;URL\>:tokenHelper

A token helper is an executable which outputs an auth token. This can be used in situations where the authToken is not a constant value but is something that refreshes regularly, where a script or other tool can use an existing refresh token to obtain a new access token.

The configuration for the path to the helper must be an absolute path, with no arguments. In order to be secure, it is only permitted to set this value in the user `.npmrc`. Otherwise a project could place a value in a project's local `.npmrc` and run arbitrary executables.

Setting a token helper for the default registry:

```
tokenHelper=/home/ivan/token-generator
```

Setting a token helper for the specified registry:

```
//registry.corp.com:tokenHelper=/home/ivan/token-generator
```

### &lt;URL\>:always-auth

* Default: **false**
* Type: **Boolean**

Force pnpm to always require authentication (even for GET requests) when
accessing the specified registry. For example:

```sh
@babel:registry=https://gitlab.com/api/v4/packages/npm/
//gitlab.com/api/v4/packages/npm/:always-auth=true

registry=https://registry.npmjs.org/
//registry.npmjs.org/:always-auth=true
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

### cert

* Default: **null**
* Type: **String**

A client certificate to pass when accessing the registry. Values should be in
PEM format (AKA "Base-64 encoded X.509 (.CER)"). For example:

```test
cert="-----BEGIN CERTIFICATE-----\nXXXX\nXXXX\n-----END CERTIFICATE-----"
```

It is not the path to a certificate file (and there is no `certfile` option).

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

### git-shallow-hosts

* Default: **['github.com', 'gist.github.com', 'gitlab.com', 'bitbucket.com', 'bitbucket.org']**
* Type: **string[]**

When fetching dependencies that are Git repositories, if the host is listed in this setting, pnpm will use shallow cloning to fetch only the needed commit, not all the history.

### https-proxy

* Default: **null**
* Type: **url**

A proxy to use for outgoing HTTPS requests. If the `HTTPS_PROXY`, `https_proxy`,
`HTTP_PROXY` or `http_proxy` environment variables are set, their values will be
used instead.

### local-address

* Default: **undefined**
* Type: **IP Address**

The IP address of the local interface to use when making connections to the npm
registry.

### proxy

* Default: **null**
* Type: **url**

A proxy to use for outgoing http requests. If the HTTP_PROXY or http_proxy
environment variables are set, proxy settings will be honored by the underlying
request library.

### maxsockets

* Default: **network-concurrency x 3**
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

### network-concurrency

* Default: **16**
* Type: **Number**

Controls the maximum number of HTTP(S) requests to process simultaneously.

### fetch-retries

* Default: **2**
* Type: **Number**

How many times to retry if pnpm fails to fetch from the registry.

### fetch-retry-factor

* Default: **10**
* Type: **Number**

The exponential factor for retry backoff.

### fetch-retry-mintimeout

* Default: **10000 (10 seconds)**
* Type: **Number**

The minimum (base) timeout for retrying requests.

### fetch-retry-maxtimeout

* Default: **60000 (1 minute)**
* Type: **Number**

The maximum fallback timeout to ensure the retry factor does not make requests
too long.

### fetch-timeout

* Default: **60000 (1 minute)**
* Type: **Number**

The maximum amount of time to wait for HTTP requests to complete.

## Peer Dependency Settings

### auto-install-peers

* Default: **false**
* Type: **Boolean**

When `true`, any missing non-optional peer dependencies are automatically installed.

### strict-peer-dependencies

* Default: **true**
* Type: **Boolean**

If this is enabled, commands will fail if there is a missing or invalid peer
dependency in the tree.

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

### use-beta-cli

* Default: **false**
* Type: **Boolean**

Experimental option that enables beta features of the CLI. This means that you
may get some changes to the CLI functionality that are breaking changes, or
potentially bugs.

### recursive-install

* Default: **true**
* Type: **Boolean**

If this is enabled, the primary behaviour of `pnpm install` becomes that of
`pnpm install -r`, meaning the install is performed on all workspace or
subdirectory packages.

Else, `pnpm install` will exclusively build the package in the current
directory.

### engine-strict

* Default: **false**
* Type: **Boolean**

If this is enabled, pnpm will not install any package that claims to not be
compatible with the current Node version.

Regardless of this configuration, installation will always fail if a project
(not a dependency) specifies an incompatible version in its `engines` field.

### npm-path

* Type: **path**

The location of the npm binary that pnpm uses for some actions, like publishing.

## Build Settings

### child-concurrency

* Default: **5**
* Type: **Number**

The maximum number of child processes to allocate simultaneously to build
node_modules.

### side-effects-cache

* Default: **true**
* Type: **Boolean**

Use and cache the results of (pre/post)install hooks.

### side-effects-cache-readonly

* Default: **false**
* Type: **Boolean**

Only use the side effects cache if present, do not create it for new packages.

### unsafe-perm

* Default: **false** IF running as root, ELSE **true**
* Type: **Boolean**

Set to true to enable UID/GID switching when running package scripts.
If set explicitly to false, then installing as a non-root user will fail.

## Node.js Settings

### use-node-version

* Default: **undefined**
* Type: **semver**

Specifies which exact Node.js version should be used for the project's runtime.
pnpm will automatically install the specified version of Node.js and use it for
running `pnpm run` commands or the `pnpm node` command.

### node-version

* Default: the value returned by **node -v**, without the v prefix
* Type: **semver**

The Node.js version to use when checking a package's `engines` setting.

If you want to prevent contributors of your project from adding new incompatible dependencies, use `node-version` and `engine-strict` in a `.npmrc` file at the root of the project:

```ini
node-version=12.22.0
engine-strict=true
```

This way, even if someone is using Node.js v16, they will not be able to install a new dependency that doesn't support Node.js v12.22.0.

### node-mirror:&lt;releaseDir>

* Default: **`https://nodejs.org/download/<releaseDir>/`**
* Type: **URL**

Sets the base URL for downloading Node.js. The `<releaseDir>` portion of this setting can be any directory from <https://nodejs.org/download>: `release`, `rc`, `nightly`, `v8-canary`, etc.

Here is how pnpm may be configured to download Node.js from Node.js mirror in China:

```
node-mirror:release=https://npmmirror.com/mirrors/node/
node-mirror:rc=https://npmmirror.com/mirrors/node-rc/
node-mirror:nightly=https://npmmirror.com/mirrors/node-nightly/
```

## Workspace Settings

### link-workspace-packages

* Default: **true**
* Type: **true**, **false**, **deep**

If this is enabled, locally available packages are linked to `node_modules`
instead of being downloaded from the registry. This is very convenient in a
monorepo. If you need local packages to also be linked to subdependencies, you
can use the `deep` setting.

Else, packages are downloaded and installed from the registry. However,
workspace packages can still be linked by using the `workspace:` range protocol.

### prefer-workspace-packages

* Default: **false**
* Type: **Boolean**

If this is enabled, local packages from the workspace are preferred over
packages from the registry, even if there is a newer version of the package in
the registry.

This setting is only useful if the workspace doesn't use
`save-workspace-protocol`.

### shared-workspace-lockfile

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

### save-workspace-protocol

* Default: **true**
* Type: **true**, **false**, **rolling**

This setting controls how dependencies that are linked from the workspace are added to `package.json`.

If `foo@1.0.0` is in the workspace and you run `pnpm add foo` in another project of the workspace, below is how `foo` will be added to the dependencies field. The `save-prefix` setting also influences how the spec is created.

| save-workspace-protocol | save-prefix | spec |
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

### include-workspace-root

Added in: v7.4.0

* Default: **false**
* Type: **Boolean**

When executing commands recursively in a workspace, execute them on the root workspace project as well.

## Other Settings

### use-running-store-server

* Default: **false**
* Type: **Boolean**

Only allows installation with a store server. If no store server is running,
installation will fail.

### save-prefix

* Default: **'^'**
* Type: **String**

Configure how versions of packages installed to a `package.json` file get
prefixed.

For example, if a package has version `1.2.3`, by default its version is set to
`^1.2.3` which allows minor upgrades for that package, but after
`pnpm config set save-prefix='~'` it would be set to `~1.2.3` which only allows
patch upgrades.

This setting is ignored when the added package has a range specified. For
instance, `pnpm add foo@2` will set the version of `foo` in `package.json` to
`2`, regardless of the value of `save-prefix`.

### tag

* Default: **latest**
* Type: **String**

If you `pnpm add` a package and you don't provide a specific version, then it
will install the package at the version registered under the tag from this
setting.

This also sets the tag that is added to the `package@version` specified by the
`pnpm tag` command if no explicit tag is given.

### global-dir

* Default:
  * If the **$XDG_DATA_HOME** env variable is set, then **$XDG_DATA_HOME/pnpm/global**
  * On Windows: **~/AppData/Local/pnpm/global**
  * On macOS: **~/Library/pnpm/global**
  * On Linux: **~/.local/share/pnpm/global**
* Type: **path**

Specify a custom directory to store global packages.

### global-bin-dir

Allows to set the target directory for the bin files of globally installed packages.

### state-dir

* Default:
  * If the **$XDG_STATE_HOME** env variable is set, then **$XDG_STATE_HOME/pnpm**
  * On Windows: **~/AppData/Local/pnpm-state**
  * On macOS: **~/.pnpm-state**
  * On Linux: **~/.local/state/pnpm**
* Type: **path**

The directory where pnpm creates the `pnpm-state.json` file that is currently used only by the update checker.

### cache-dir

* Default:
  * If the **$XDG_CACHE_HOME** env variable is set, then **$XDG_CACHE_HOME/pnpm**
  * On Windows: **~/AppData/Local/pnpm-cache**
  * On macOS: **~/Library/Caches/pnpm**
  * On Linux: **~/.cache/pnpm**
* Type: **path**

The location of the package metadata cache.

### use-stderr

* Default: **false**
* Type: **Boolean**

When true, all the output is written to stderr.

### update-notifier

* Default: **true**
* Type: **Boolean**

Set to `false` to suppress the update notification when using an older version of pnpm than the latest.
