---
id: settings
title: "Settings (pnpm-workspace.yaml)"
---

pnpm gets its configuration from the command line, environment variables, `pnpm-workspace.yaml`, and
`.npmrc` files.

The `pnpm config` command can be used to read and edit the contents of the project and global configuration files.

The relevant configuration files are:

- Per-project configuration file: `/path/to/my/project/pnpm-workspace.yaml`
- [Global configuration file](./cli/config.md)

:::note

Authorization-related settings are handled via [`.npmrc`](./npmrc.md).

:::

Values in the configuration files may contain env variables using the `${NAME}` syntax. 您也可以使用預設值來指定環境變數。 Using `${NAME-fallback}` will return `fallback` if `NAME` isn't set. `${NAME:-fallback}` will return `fallback` if `NAME` isn't set, or is an empty string.

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

例如：

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

If an optional dependency has its name included in this array, it will be skipped. 範例：

```yaml
ignoredOptionalDependencies:
- fsevents
- "@esbuild/*"
```

### minimumReleaseAge

新增於 v10.16.0

- Default: **0**
- Type: **number (minutes)**

To reduce the risk of installing compromised packages, you can delay the installation of newly published versions. In most cases, malicious releases are discovered and removed from the registry within an hour.

`minimumReleaseAge` defines the minimum number of minutes that must pass after a version is published before pnpm will install it. This applies to **all dependencies**, including transitive ones.

For example, the following setting ensures that only packages released at least one day ago can be installed:

```yaml
minimumReleaseAge: 1440
```

### minimumReleaseAgeExclude

新增於 v10.16.0

- Default: **undefined**
- Type: **string[]**

If you set `minimumReleaseAge` but need certain dependencies to always install the newest version immediately, you can list them under `minimumReleaseAgeExclude`. The exclusion works by **package name** and applies to all versions of that package.

例如：

```yaml
minimumReleaseAge: 1440
minimumReleaseAgeExclude:
- webpack
- react
```

In this case, all dependencies must be at least a day old, except `webpack` and `react`, which are installed immediately upon release.

新增於 v10.17.0

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

### trustPolicy

新增於 v10.21.0

- Default: **off**
- Type: **no-downgrade** | **off**

When set to `no-downgrade`, pnpm will fail if a package's trust level has decreased compared to previous releases. For example, if a package was previously published by a trusted publisher but now only has provenance or no trust evidence, installation will fail. This helps prevent installing potentially compromised versions. Trust checks are based solely on publish date, not semver. A package cannot be installed if any earlier-published version had stronger trust evidence. Starting in v10.24.0, prerelease versions are ignored when evaluating trust evidence for a non-prerelease install, so a trusted prerelease cannot block a stable release that lacks trust evidence.

### trustPolicyExclude

Added in: v10.22.0

- Default: **[]**
- Type: **string[]**

A list of package selectors that should be excluded from the trust policy check. This allows you to install specific packages or versions even if they don't satisfy the `trustPolicy` requirement.

範例：

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

- 預設值：**false**
- 型別：**布林值**

When set to `true`, only direct dependencies (those listed in your root `package.json`) may use exotic sources (like git repositories or direct tarball URLs). All transitive dependencies must be resolved from a trusted source, such as the configured registry, local file paths, workspace links, or trusted GitHub repositories (node, bun, deno).

This setting helps secure the dependency supply chain by preventing transitive dependencies from pulling in code from untrusted locations.

Exotic sources include:

- Git repositories (`git+ssh://...`)
- Direct URL links to tarballs (`https://.../package.tgz`)

## 相依性提升設定

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

Tells pnpm which packages should be hoisted to `node_modules/.pnpm/node_modules`. 在預設情況下，所有的包都是被提升的，但是如果你知道只有一些有缺陷的包有幻影依賴關係， 您可以使用此選項來只提升有幻影依賴關係的包（推薦）。

例如：

```yaml
hoistPattern:
- "*eslint*"
- "*babel*"
```

You may also exclude patterns from hoisting using `!`.

例如：

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
the pattern to the root modules directory. 提升至根模組目錄表示應用程式程式碼將可以存取虛設的相依性，即使這個程式碼對解決方案策略進行了不當的修改也一樣。

在處理一些不當解析相依性的錯誤可插入式工具時，這個設定很有用。

例如：

```yaml
publicHoistPattern:
- "*plugin*"
```

Note: Setting `shamefullyHoist` to `true` is the same as setting
`publicHoistPattern` to `*`.

You may also exclude patterns from hoisting using `!`.

例如：

```yaml
publicHoistPattern:
- "*types*"
- "!@types/react"
```

### shamefullyHoist

- 預設值：**false**
- 型別：**布林值**

By default, pnpm creates a semistrict `node_modules`, meaning dependencies have
access to undeclared dependencies but modules outside of `node_modules` do not.
使用此頁面配置，生態系統中的大多數套件將沒有問題的運作。
However, if some tooling only works when the hoisted dependencies are in the
root of `node_modules`, you can set this to `true` to hoist them for you.

## 節點模組設定

### modulesDir

- Default: **node_modules**
- Type: **path**

The directory in which dependencies will be installed (instead of
`node_modules`).

### nodeLinker

- Default: **isolated**
- Type: **isolated**, **hoisted**, **pnp**

定義應該使用哪些連結器來安裝 Node 套件。

- **isolated** - dependencies are symlinked from a virtual store at `node_modules/.pnpm`.
- **hoisted** - a flat `node_modules` without symlinks is created. Same as the `node_modules` created by npm or Yarn Classic. 使用這個設定時，有一個 Yarn 程式庫用於提升。 使用此設定的合法原因：
  1. 您的工具無法與符號連結一起使用。 A React Native project will most probably only work if you use a hoisted `node_modules`.
  2. 您的專案部署在一個無伺服器的主機服務提供者。 一些無伺服器的提供者 (例如 AWS Lambia) 不支援符號連結。 或者，您也可以在部署之前組合應用程式來解決此問題。
  3. If you want to publish your package with [`"bundledDependencies"`].
  4. If you are running Node.js with the [--preserve-symlinks] flag.
- **pnp** - no `node_modules`. Plug'n'Play is an innovative strategy for Node that is [used by Yarn Berry][pnp]. It is recommended to also set `symlink` setting to `false` when using `pnp` as
  your linker.

[pnp]: https://yarnpkg.com/features/pnp
[--preserve-symlinks]: https://nodejs.org/api/cli.html#cli_preserve_symlinks
[`"bundledDependencies"`]: https://docs.npmjs.com/cli/v8/configuring-npm/package-json#bundleddependencies

### symlink

- Default: **true**
- 型別：**布林值**

When `symlink` is set to `false`, pnpm creates a virtual store directory without
any symlinks. It is a useful setting together with `nodeLinker=pnp`.

### enableModulesDir

- Default: **true**
- 型別：**布林值**

When `false`, pnpm will not write any files to the modules directory
(`node_modules`). 這對於模組目錄同使用者空間內檔案系統 (FUSE) 裝載時有幫助。 There is an experimental CLI that allows you to
mount a modules directory with FUSE: [@pnpm/mount-modules].

[@pnpm/mount-modules]: https://www.npmjs.com/package/@pnpm/mount-modules

### virtualStoreDir

- Default: **node_modules/.pnpm**
- Types: **path**

包含指向存放區連結的目錄。 專案所有直接和間接依賴的依賴套件都建立了指向此目錄的連結。

這個設定對解決 Windows 上長路徑的問題有幫助。 If
you have some dependencies with very long paths, you can select a virtual store
in the root of your drive (for instance `C:\my-project-store`).

Or you can set the virtual store to `.pnpm` and add it to `.gitignore`. 這將會讓 StrackTrace 更加簡潔，因為相依套件的路徑將會高出一個目錄。

**NOTE:** the virtual store cannot be shared between several projects. 每個專案都應該有自己的虛擬存放區 (共用根的工作區內除外)。

### virtualStoreDirMaxLength

- 預設值：
  - On Linux/macOS: **120**
  - On Windows: **60**
- Types: **number**

Sets the maximum allowed length of directory names inside the virtual store directory (`node_modules/.pnpm`). You may set this to a lower number if you encounter long path issues on Windows.

### packageImportMethod

- Default: **auto**
- Type: **auto**, **hardlink**, **copy**, **clone**, **clone-or-copy**

Controls the way packages are imported from the store (if you want to disable symlinks inside `node_modules`, then you need to change the [nodeLinker] setting, not this one).

- **auto** - try to clone packages from the store. 如果不支援複製，則從存放區建立指向套的 Hardlink。 如果再製和建立連結都不可行，則回到複製
- **hardlink** - hard link packages from the store
- **clone-or-copy** - try to clone packages from the store. 如果不支援再製，則回到複製
- **copy** - copy packages from the store
- **clone** - clone (AKA copy-on-write or reference link) packages from the store

再製是將套件寫入 node_modules 的最佳方式。 這是最快速、最安全的方式。 使用再製時，您可以在 node_modules 中編輯檔案，而在中央的內容可定址存放區中，它們將不會被修改。

不過，不是所有的檔案系統都支援再製。 我們推薦使用寫入時複製 (CoW) 檔案系統 (例如，在 Linux 上使用 Btrfs 而非 Ext4)，以取得使用 pnpm 的最佳體驗。

[nodeLinker]: #nodeLinker

### modulesCacheMaxAge

- Default: **10080** (7 days in minutes)
- Type: **number**

模組目錄中的孤立套件應該被移除的時間 (單位為分鐘)。
pnpm 會在模組目錄中保留套件的快取。 這會提高切換分支或降級相依性時的安裝速度。

### dlxCacheMaxAge

- Default: **1440** (1 day in minutes)
- Type: **number**

The time in minutes after which dlx cache expires.
After executing a dlx command, pnpm keeps a cache that omits the installation step for subsequent calls to the same dlx command.

### enableGlobalVirtualStore

Added in: v10.12.1

- Default: **false** (always **false** in CI)
- 型別：**布林值**
- Status: **Experimental**

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

- 預設值：
  - If the **$PNPM_HOME** env variable is set, then **$PNPM_HOME/store**
  - If the **$XDG_DATA_HOME** env variable is set, then **$XDG_DATA_HOME/pnpm/store**
  - On Windows: **~/AppData/Local/pnpm/store**
  - On macOS: **~/Library/pnpm/store**
  - On Linux: **~/.local/share/pnpm/store**
- Type: **path**

所有套件儲存在磁碟上的位置。

存放區應該一律安裝在相同的磁碟上，因此每個磁碟都將有一個存放區。 如果目前的磁碟上有主目錄，則將在其內部建立儲存區。 如果磁碟上沒有主目錄，則將在檔案系統的根目錄中建立儲存區。 For
example, if installation is happening on a filesystem mounted at `/mnt`,
then the store will be created at `/mnt/.pnpm-store`. Windows 系統也是這樣。

從不同的磁碟設定存放區是可行的，但在那種情況下，pnpm 將不會建立指向套件的永久連結，而是會從存放區複製，因為只有在相同的檔案系統上才可以建立永久連結。

### verifyStoreIntegrity

- Default: **true**
- 型別：**布林值**

By default, if a file in the store has been modified, the content of this file is checked before linking it to a project's `node_modules`. If `verifyStoreIntegrity` is set to `false`, files in the content-addressable store will not be checked during installation.

### useRunningStoreServer

:::danger

Deprecated feature

:::

- 預設值：**false**
- 型別：**布林值**

Only allows installation with a store server. If no store server is running,
installation will fail.

### strictStorePkgContentCheck

- Default: **true**
- 型別：**布林值**

Some registries allow the exact same content to be published under different package names and/or versions. This breaks the validity checks of packages in the store. To avoid errors when verifying the names and versions of such packages in the store, you may set the `strictStorePkgContentCheck` setting to `false`.

## 鎖定檔設定

### lockfile

- Default: **true**
- 型別：**布林值**

When set to `false`, pnpm won't read or generate a `pnpm-lock.yaml` file.

### preferFrozenLockfile

- Default: **true**
- 型別：**布林值**

When set to `true` and the available `pnpm-lock.yaml` satisfies the
`package.json` dependencies directive, a headless installation is performed. 無周邊安裝會略過所有的相依性解析，因為它不需要修改鎖定檔。

### lockfileIncludeTarballUrl

- 預設值：**false**
- 型別：**布林值**

Add the full URL to the package's tarball to every entry in `pnpm-lock.yaml`.

### gitBranchLockfile

- 預設值：**false**
- 型別：**布林值**

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

例如：

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

## 請求設定

### gitShallowHosts

- Default: **['github.com', 'gist.github.com', 'gitlab.com', 'bitbucket.com', 'bitbucket.org']**
- Type: **string[]**

When fetching dependencies that are Git repositories, if the host is listed in this setting, pnpm will use shallow cloning to fetch only the needed commit, not all the history.

### networkConcurrency

- Default: **auto (workers × 3 clamped to 16-64)**
- Type: **Number**

Controls the maximum number of HTTP(S) requests to process simultaneously.

As of v10.24.0, pnpm automatically selects a value between 16 and 64 based on the number of workers (networkConcurrency = clamp(workers × 3, 16, 64)). Set this value explicitly to override the automatic scaling.

### fetchRetries

- Default: **2**
- Type: **Number**

How many times to retry if pnpm fails to fetch from the registry.

### fetchRetryFactor

- Default: **10**
- Type: **Number**

The exponential factor for retry backoff.

### fetchRetryMintimeout

- Default: **10000 (10 seconds)**
- Type: **Number**

The minimum (base) timeout for retrying requests.

### fetchRetryMaxtimeout

- Default: **60000 (1 minute)**
- Type: **Number**

The maximum fallback timeout to ensure the retry factor does not make requests
too long.

### fetchTimeout

- Default: **60000 (1 minute)**
- Type: **Number**

The maximum amount of time to wait for HTTP requests to complete.

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

## Peer Dependency 設定

### autoInstallPeers

- Default: **true**
- 型別：**布林值**

When `true`, any missing non-optional peer dependencies are automatically installed.

#### Version Conflicts

If there are conflicting version requirements for a peer dependency from different packages, pnpm will not install any version of the conflicting peer dependency automatically. Instead, a warning is printed. For example, if one dependency requires `react@^16.0.0` and another requires `react@^17.0.0`, these requirements conflict, and no automatic installation will occur.

#### Conflict Resolution

In case of a version conflict, you'll need to evaluate which version of the peer dependency to install yourself, or update the dependencies to align their peer dependency requirements.

### dedupePeerDependents

- Default: **true**
- 型別：**布林值**

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

- 預設值：**false**
- 型別：**布林值**

If this is enabled, commands will fail if there is a missing or invalid peer
dependency in the tree.

### resolvePeersFromWorkspaceRoot

- Default: **true**
- 型別：**布林值**

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

`allowAny` is an array of package name patterns, any peer dependency matching the pattern will be resolved from any version, regardless of the range specified in `peerDependencies`. 例如：

```yaml
peerDependencyRules:
  allowAny:
  - "@babel/*"
  - "eslint"
```

The above setting will mute any warnings about peer dependency version mismatches related to `@babel/` packages or `eslint`.

## CLI 設定

### [no-]color

- Default: **auto**
- Type: **auto**, **always**, **never**

控制輸出的色彩。

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

- 預設值：**false**
- 型別：**布林值**

Experimental option that enables beta features of the CLI. This means that you
may get some changes to the CLI functionality that are breaking changes, or
potentially bugs.

### recursiveInstall

- Default: **true**
- 型別：**布林值**

If this is enabled, the primary behaviour of `pnpm install` becomes that of
`pnpm install -r`, meaning the install is performed on all workspace or
subdirectory packages.

Else, `pnpm install` will exclusively build the package in the current
directory.

### engineStrict

- 預設值：**false**
- 型別：**布林值**

如果啟用此功能，pnpm 將不會安裝任何與當前 Node.js 版本不相容的套件。

Regardless of this configuration, installation will always fail if a project
(not a dependency) specifies an incompatible version in its `engines` field.

### npmPath

- Type: **path**

The location of the npm binary that pnpm uses for some actions, like publishing.

### packageManagerStrict

- Default: **true**
- 型別：**布林值**

If this setting is disabled, pnpm will not fail if a different package manager is specified in the `packageManager` field of `package.json`. When enabled, only the package name is checked (since pnpm v9.2.0), so you can still run any version of pnpm regardless of the version specified in the `packageManager` field.

Alternatively, you can disable this setting by setting the `COREPACK_ENABLE_STRICT` environment variable to `0`.

### packageManagerStrictVersion

- 預設值：**false**
- 型別：**布林值**

When enabled, pnpm will fail if its version doesn't exactly match the version specified in the `packageManager` field of `package.json`.

### managePackageManagerVersions

- Default: **true**
- 型別：**布林值**

When enabled, pnpm will automatically download and run the version of pnpm specified in the `packageManager` field of `package.json`. This is the same field used by Corepack. 例如：

```json
{
  "packageManager": "pnpm@9.3.0"
}
```

## 構建設置

### ignoreScripts

- 預設值：**false**
- 型別：**布林值**

Do not execute any scripts defined in the project `package.json` and its
dependencies.

:::note

This flag does not prevent the execution of [.pnpmfile.cjs](./pnpmfile.md)

:::

### ignoreDepScripts

- 預設值：**false**
- 型別：**布林值**

Do not execute any scripts of the installed packages. Scripts of the projects are executed.

:::note

Since v10, pnpm doesn't run the lifecycle scripts of dependencies unless they are listed in [`onlyBuiltDependencies`].

:::

[`onlyBuiltDependencies`]: settings.md#onlybuiltdependencies

### childConcurrency

- Default: **5**
- Type: **Number**

The maximum number of child processes to allocate simultaneously to build
node_modules.

### sideEffectsCache

- Default: **true**
- 型別：**布林值**

Use and cache the results of (pre/post)install hooks.

When a pre/post install script modify the contents of a package (e.g. build output), pnpm saves the modified package in the global store. On future installs on the same machine, pnpm reuses this cached, prebuilt version—making installs significantly faster.

:::note

You may want to disable this setting if:

1. The install scripts modify files _outside_ the package directory (pnpm cannot track or cache these changes).
2. The scripts perform side effects that are unrelated to building the package.

:::

### sideEffectsCacheReadonly

- 預設值：**false**
- 型別：**布林值**

Only use the side effects cache if present, do not create it for new packages.

### unsafePerm

- Default: **false** IF running as root, ELSE **true**
- 型別：**布林值**

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

- 預設值：**false**
- Type: **install**, **warn**, **error**, **prompt**, **false**

This setting allows the checking of the state of dependencies before running scripts. The check runs on `pnpm run` and `pnpm exec` commands. The following values are supported:

- `install` - Automatically runs install if `node_modules` is not up to date.
- `warn` - Prints a warning if `node_modules` is not up to date.
- `prompt` - Prompts the user for permission to run install if `node_modules` is not up to date.
- `error` - Throws an error if `node_modules` is not up to date.
- `false` - Disables dependency checks.

### strictDepBuilds

Added in: v10.3.0

- 預設值：**false**
- 型別：**布林值**

When `strictDepBuilds` is enabled, the installation will exit with a non-zero exit code if any dependencies have unreviewed build scripts (aka postinstall scripts).

### allowBuilds

Added in: v10.26.0

A map of package matchers to explicitly allow (`true`) or disallow (`false`) script execution. This field replaces `onlyBuiltDependencies` and `ignoredBuiltDependencies` (which are also deprecated by this new setting), providing a single source of truth.

```yaml
allowBuilds:
  esbuild: true
  core-js: false
  nx@21.6.4 || 21.6.5: true
```

**Default behavior:** Packages not listed in `allowBuilds` are disallowed by default and a warning is printed. If [`strictDepBuilds`](#strictdepbuilds) is set to `true`, an error will be printed instead.

### neverBuiltDependencies

A list of package names that are NOT allowed to execute "preinstall", "install", and/or "postinstall" scripts during installation.

Be careful when using `neverBuiltDependencies` without `onlyBuiltDependencies` because it implies all other dependencies are allowed.

An example of the `neverBuiltDependencies` field:

```yaml
neverBuiltDependencies:
- fsevents
- level
```

### onlyBuiltDependencies

A list of package names that are allowed to execute "preinstall", "install", and/or "postinstall" scripts during installation.
Only the packages listed in this array will be able to run those lifecycle scripts. If `onlyBuiltDependenciesFile` and `neverBuiltDependencies` are omitted, this configuration option will default to blocking all install scripts.

例如：

```yaml
onlyBuiltDependencies:
- fsevents
```

Added in: v10.19.0

You may restrict allowances to specific versions (and lists of versions using a disjunction with `||`). When versions are specified, only those versions of the package may run lifecycle scripts:

```yaml
onlyBuiltDependencies:
- nx@21.6.4 || 21.6.5
- esbuild@0.25.1
```

### onlyBuiltDependenciesFile

This configuration option allows users to specify a JSON file that lists the only packages permitted to run installation scripts during the pnpm install process. By using this, you can enhance security or ensure that only specific dependencies execute scripts during installation.

例如：

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

A list of package names that are NOT allowed to execute "preinstall", "install", and/or "postinstall" scripts during installation and will not warn or ask to be executed.

This is useful when you want to hide the warning because you know the lifecycle scripts are not needed.

例如：

```yaml
ignoredBuiltDependencies:
- fsevents
- sharp
```

### dangerouslyAllowAllBuilds

新增於 v10.9.0

- 預設值：**false**
- 型別：**布林值**

If set to `true`, all build scripts (e.g. `preinstall`, `install`, `postinstall`) from dependencies will run automatically, without requiring approval.

:::warning

This setting allows all dependencies—including transitive ones—to run install scripts, both now and in the future.
Even if your current dependency graph appears safe:

- Future updates may introduce new, untrusted dependencies.
- Existing packages may add scripts in later versions.
- Packages can be hijacked or compromised and begin executing malicious code.

For maximum safety, only enable this if you’re fully aware of the risks and trust the entire ecosystem you’re pulling from. It’s recommended to review and allow builds explicitly.

:::

## Node.js 設定

### useNodeVersion

- Default: **undefined**
- Type: **semver**

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

[`executionEnv.nodeVersion`]: #executionenvnodeversion

### nodeVersion

- Default: the value returned by **node -v**, without the v prefix
- Type: **exact semver version (not a range)**

The Node.js version to use when checking a package's `engines` setting.

If you want to prevent contributors of your project from adding new incompatible dependencies, use `nodeVersion` and `engineStrict` in a `pnpm-workspace.yaml` file at the root of the project:

```ini
nodeVersion: 12.22.0
engineStrict: true
```

This way, even if someone is using Node.js v16, they will not be able to install a new dependency that doesn't support Node.js v12.22.0.

### node-mirror

- Default: **`https://nodejs.org/download/<releaseDir>/`**
- Type: **URL**

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

範例：

```json
executionEnv:
  nodeVersion: 16.16.0
```

## 其他設定

### savePrefix

- Default: **'^'**
- Type: **'^'**, **'~'**, **''**

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

- Default: **latest**
- Type: **String**

If you `pnpm add` a package and you don't provide a specific version, then it
will install the package at the version registered under the tag from this
setting.

This also sets the tag that is added to the `package@version` specified by the
`pnpm tag` command if no explicit tag is given.

### globalDir

- 預設值：
  - If the **$XDG_DATA_HOME** env variable is set, then **$XDG_DATA_HOME/pnpm/global**
  - On Windows: **~/AppData/Local/pnpm/global**
  - On macOS: **~/Library/pnpm/global**
  - On Linux: **~/.local/share/pnpm/global**
- Type: **path**

Specify a custom directory to store global packages.

### globalBinDir

- 預設值：
  - If the **$XDG_DATA_HOME** env variable is set, then **$XDG_DATA_HOME/pnpm**
  - On Windows: **~/AppData/Local/pnpm**
  - On macOS: **~/Library/pnpm**
  - On Linux: **~/.local/share/pnpm**
- Type: **path**

Allows to set the target directory for the bin files of globally installed packages.

### stateDir

- 預設值：
  - If the **$XDG_STATE_HOME** env variable is set, then **$XDG_STATE_HOME/pnpm**
  - On Windows: **~/AppData/Local/pnpm-state**
  - On macOS: **~/.pnpm-state**
  - On Linux: **~/.local/state/pnpm**
- Type: **path**

The directory where pnpm creates the `pnpm-state.json` file that is currently used only by the update checker.

### cacheDir

- 預設值：
  - If the **$XDG_CACHE_HOME** env variable is set, then **$XDG_CACHE_HOME/pnpm**
  - On Windows: **~/AppData/Local/pnpm-cache**
  - On macOS: **~/Library/Caches/pnpm**
  - On Linux: **~/.cache/pnpm**
- Type: **path**

The location of the cache (package metadata and dlx).

### useStderr

- 預設值：**false**
- 型別：**布林值**

When true, all the output is written to stderr.

### updateNotifier

- Default: **true**
- 型別：**布林值**

Set to `false` to suppress the update notification when using an older version of pnpm than the latest.

### preferSymlinkedExecutables

- Default: **true**, when **node-linker** is set to **hoisted** and the system is POSIX
- 型別：**布林值**

Create symlinks to executables in `node_modules/.bin` instead of command shims. This setting is ignored on Windows, where only command shims work.

### ignoreCompatibilityDb

- 預設值：**false**
- 型別：**布林值**

During installation the dependencies of some packages are automatically patched. If you want to disable this, set this config to `true`.

The patches are applied from Yarn's [`@yarnpkg/extensions`] package.

### resolutionMode

- Default: **highest** (was **lowest-direct** from v8.0.0 to v8.6.12)
- Type: **highest**, **time-based**, **lowest-direct**

When `resolutionMode` is set to `time-based`, dependencies will be resolved the following way:

1. Direct dependencies will be resolved to their lowest versions. So if there is `foo@^1.1.0` in the dependencies, then `1.1.0` will be installed.
2. Subdependencies will be resolved from versions that were published before the last direct dependency was published.

With this resolution mode installations with warm cache are faster. It also reduces the chance of subdependency hijacking as subdependencies will be updated only if direct dependencies are updated.

This resolution mode works only with npm's [full metadata]. So it is slower in some scenarios. However, if you use [Verdaccio] v5.15.1 or newer, you may set the `registrySupportsTimeField` setting to `true`, and it will be really fast.

When `resolutionMode` is set to `lowest-direct`, direct dependencies will be resolved to their lowest versions.

### registrySupportsTimeField

- 預設值：**false**
- 型別：**布林值**

Set this to `true` if the registry that you are using returns the "time" field in the abbreviated metadata. As of now, only [Verdaccio] from v5.15.1 supports this.

### extendNodePath

- Default: **true**
- 型別：**布林值**

When `false`, the `NODE_PATH` environment variable is not set in the command shims.

[`@yarnpkg/extensions`]: https://github.com/yarnpkg/berry/blob/master/packages/yarnpkg-extensions/sources/index.ts
[full metadata]: https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md#full-metadata-format
[Verdaccio]: https://verdaccio.org/

### deployAllFiles

- 預設值：**false**
- 型別：**布林值**

When deploying a package or installing a local package, all files of the package are copied. By default, if the package has a `"files"` field in the `package.json`, then only the listed files and directories are copied.

### dedupeDirectDeps

- 預設值：**false**
- 型別：**布林值**

When set to `true`, dependencies that are already symlinked to the root `node_modules` directory of the workspace will not be symlinked to subproject `node_modules` directories.

### optimisticRepeatInstall

Added in: v10.1.0

- 預設值：**false**
- 型別：**布林值**

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
- 型別：**布林值**

This setting explicitly tells pnpm whether the current environment is a CI (Continuous Integration) environment.

import CleanupUnusedCatalogs from './settings/_cleanupUnusedCatalogs.mdx'

<CleanupUnusedCatalogs />
