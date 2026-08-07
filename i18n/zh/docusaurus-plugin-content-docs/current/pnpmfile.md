---
id: pnpmfile
title: .pnpmfile.mjs
---

pnpm 允许你通过特殊功能（钩子）直接挂钩到安装过程。 钩子可以在名为 `.pnpmfile.mjs` (ESM) 或 `.pnpmfile.cjs` (CommonJS) 的文件中声明。

默认情况下， `.pnpmfile.mjs` 应该与锁文件位于同一目录中。 例如，在具有共享锁文件的 [工作区](workspaces.md) 中 `.pnpmfile.mjs` 应该位于 monorepo 的根目录中。

## 钩子

### 摘要

| 钩子函数                                                  | 过程                    | 用途                          |
| ----------------------------------------------------- | --------------------- | --------------------------- |
| `hooks.readPackage(pkg, context): pkg`                | 在 pnpm 解析依赖的软件清单文件后调用 | 允许你改变依赖的 `package.json`。    |
| `hooks.afterAllResolved(lockfile, context): lockfile` | 在解析完依赖关系后调用。          | 允许你更改锁文件。                   |
| `hooks.beforePacking(pkg): pkg`                       | 在打包/发布过程中创建 tar 包之前调用 | 允许你自定义已发布的内容 `package.json` |
| `resolvers`                                           | 在包解析过程中调用。            | 允许你注册自定义包解析器。               |
| `fetchers`                                            | 在包获取过程中调用。            | 允许你注册自定义包获取器。               |

### `hooks.readPackage(pkg, context): pkg | Promise<pkg>`

允许你在语法解析之后、依赖解析之前改变依赖项的 `package.json`。 这些突变不会保存到文件系统，但是，它们将影响被解析至锁文件的内容，从而影响哪些包将被安装。

请注意，如果你已经解析好了要修改的依赖项，则需要删除 `pnpm-lock.yaml`。

:::tip

如果你需要将 `package.json` 的变化保存到文件系统中，你需要使用 [`pnpm patch`][] 命令对 `package.json` 文件进行修补。 例如，如果你想删除依赖项的 `bin` 字段，这可能很有用。

:::

#### 参数

* `pkg` - 包的清单。 来自注册源的响应或 `package.json` 的内容。
* `context` - 步骤的上下文对象。 `#log(msg)` 方法允许你使用该步骤的调试日志。

#### 使用方法

示例 `.pnpmfile.mjs` （更改依赖项的依赖关系）：

```js
function readPackage(pkg, context) {
  // 在从源下载后覆盖 foo@1.x 的清单文件
  if (pkg.name === 'foo' && pkg.version.startsWith('1.')) {
    // 替换 bar@x.x.x 为 bar@2.0.0
    pkg.dependencies = {
      ...pkg.dependencies,
      bar: '^2.0.0'
    }
    context.log('bar@1 => bar@2 in dependencies of foo')
  }

  // 这将会将所有使用 baz@x.x.x 的包改为使用 baz@1.2.3
  if (pkg.dependencies.baz) {
    pkg.dependencies.baz = '1.2.3';
  }

  return pkg
}

module.exports = {
  hooks: {
    readPackage
  }
}
```

#### 已知限制

使用 `readPackage` 从依赖项的清单中删除 `scripts` 字段不会阻止 pnpm 构建依赖项。 构建依赖时，pnpm 从包的存档中读取包的 `package.json` ，这不受钩子的影响。 为了忽略包的构建，请使用 [neverBuiltDependencies](settings.md#neverbuiltdependencies) 字段。

### `hooks.updateConfig(config): config | Promise<config>`

添加于：v10.8.0

允许你修改 pnpm 使用的配置设置。 这个钩子与 [configDependencies](config-dependencies)配对时非常有用，允许您在不同的 Git 存储库之间共享和重用设置。

例如， [@pnpm/plugin-better-defaults](https://github.com/pnpm/plugin-better-defaults) 使用 `updateConfig` 钩子来应用一组精选的推荐设置。

#### 用法示例

```js title=".pnpmfile.mjs"
export const hooks = {
  updateConfig (config) {
    return Object.assign(config, {
      enablePrePostScripts: false,
      optimisticRepeatInstall: true,
      resolutionMode: 'lowest-direct',
      verifyDepsBeforeRun: 'install',
    })
  }
}
```

### `hooks.afterAllResolved(lockfile, context): lockfile | Promise<lockfile>`

允许你在序列化之前更改锁文件的输出。

#### 参数

* `lockfile` - 锁文件的解析对象，序列化为 `pnpm-lock.yaml`。
* `context` - 步骤的上下文对象。 `#log(msg)` 方法允许你使用该步骤的调试日志。

#### 用法示例

```js title=".pnpmfile.mjs"
function afterAllResolved(lockfile, context) {
  // ...
  return lockfile
}

export const hooks = {
  afterAllResolved
}
```

#### 已知限制

没有 - 任何可以通过修改锁文件达到的功能都可以通过这个函数完成，甚至可以扩展锁文件的功能。

### `hooks.beforePacking(pkg): pkg | Promise<pkg>`

新增于：v10.28.0

允许你在 `pnpm pack` 或 `pnpm publish` 过程中在被打包进 tarball 之前修改 `package.json` 。 这有助于自定义已发布的软件包，而不影响你的本地开发的 `package.json`。

与 `hooks.readPackage`不同，后者会修改安装期间依赖项的解析方式，而 `beforePacking` 只会影响发布的 tarball 的内容。

#### 参数

* `pkg` - 将包含在已发布的 tarball 中的软件包清单对象。

#### 用法示例

```js title=".pnpmfile.mjs"
function beforePacking(pkg) {
  // 从已发布的包中移除仅用于开发的字段
  delete pkg.devDependencies
  delete pkg.scripts.test

  // 添加发布元数据
  pkg.publishedAt = new Date().toISOString()

  // 修改生产环境的包导出
  if (pkg.name === 'my-package') {
    pkg.main = './dist/index.js'
  }

  return pkg
}

export const hooks = {
  beforePacking
}
```

:::note

此钩子所做的修改只会影响 tarball 中的 `package.json`。 你本地 `package.json` 文件保持不变。

:::

### `hooks.preResolution(options): Promise<void>`

此钩子在读取和解析项目的锁文件 （lockfiles）之后但在解析依赖项之前执行。 它允许修改锁文件对象。

#### 参数

* `options.existsCurrentLockfile` - Boolean，如果 `node_modules/.pnpm/lock.yaml` 处的锁文件存在，则为true。
* `options.currentLockfile` - 来自 `node_modules/.pnpm/lock.yaml`的 lockfile 对象。
* `options.existsNonEmptyWantedLockfile` - Boolean，如果 `pnpm-lock.yaml` 处的锁文件存在，则为true。
* `options.wantedLockfile` - 来自 `pnpm-lock.yaml`的 lockfile 对象。
* `options.lockfileDir` - 所需锁文件所在的目录。
* `options.storeDir` - 存储目录的位置。
* `options.registries` - 范围到注册源 URL 的映射。

### `hooks.importPackage(destinationDir, options): Promise<string | undefined>`

此钩子允许更改将包写入 `node_modules`的方式。 返回值是可选的，并说明用于导入依赖项的方法，例如：clone、hardlink。

#### 参数

* `destinationDir` - 应该写入包的目标目录。
* `options.disableRelinkLocalDirDeps`
* `options.filesMap`
* `options.force`
* `options.resolvedFrom`
* `options.keepModulesDir`

### `hooks.fetchers`

:::danger Removed in v11.0.0

`hooks.fetchers` has been removed. Use top-level `fetchers` instead. See the [Custom Fetchers](#custom-fetchers) section for the new API.

:::


## 查找器

添加于：v10.16.0

查找器函数通过 `--find-by` 标志与 `pnpm list` 和 `pnpm why` 一起使用。

示例：

```js title=".pnpmfile.mjs"
export const finders = {
  react17: (ctx) => {
    return ctx.readManifest().peerDependencies?.react === "^17.0.0"
  }
}
```

使用方法：

```
pnpm why --find-by=react17
```

有关更多详细信息，请参阅 [查找器][] 。

## Custom Resolvers and Fetchers

添加于：v11.0.0

Custom resolvers and fetchers allow you to implement custom package resolution and fetching logic for new package identifier schemes (like `my-protocol:package-name`). They are registered as top-level exports in `.pnpmfile.cjs`:

```js
module.exports = {
  resolvers: [customResolver1, customResolver2],
  fetchers: [customFetcher1, customFetcher2],
}
```

#### TypeScript Interfaces

```typescript
interface CustomResolver {
  canResolve?: (wantedDependency: WantedDependency) => boolean | Promise<boolean>
  resolve?: (wantedDependency: WantedDependency, opts: ResolveOptions) => ResolveResult | Promise<ResolveResult>
  shouldRefreshResolution?: (depPath: string, pkgSnapshot: PackageSnapshot) => boolean | Promise<boolean>
}

interface CustomFetcher {
  canFetch?: (pkgId: string, resolution: Resolution) => boolean | Promise<boolean>
  fetch?: (cafs: Cafs, resolution: Resolution, opts: FetchOptions, fetchers: Fetchers) => FetchResult | Promise<FetchResult>
}
```

### Custom Resolvers

Custom resolvers convert package descriptors (e.g., `foo@^1.0.0`) into resolutions that are stored in the lockfile.

#### Resolver Interface

A custom resolver is an object that can implement any combination of the following methods:

##### `canResolve(wantedDependency): boolean | Promise<boolean>`

确定该解析器是否能解决给定的依赖。

**参数：**
- `wantedDependency ` - 对象包含：
  - `alias` - package.json 中显示的包名称或别名
  - `bareSpecifier` - 版本范围、git URL、文件路径或其他说明符

**返回值：** 如果此解析器可以处理该包，则`true` ，否则 `false` 。 这决定 `resolve` 是否被调用。

##### `resolve(wantedDependency, opts): ResolveResult | Promise<ResolveResult>`

将所需的依赖关系解析为特定的软件包元数据和解析信息。

**参数：**
- `wantedDependency` - 所需的依赖项（与 `canResolve` 相同）
- `opts` - 对象包含：
  - `lockfileDir` - 包含锁定文件的目录
  - `projectDir` - 项目根目录
  - `preferredVersions` - 软件包名称到首选版本的映射

**返回值：** 对象，包含：
- `id` - 唯一包标识符（例如， `'custom-pkg@1.0.0'`）
- `resolution` - 解析元数据。 这可以是：
  - 标准解析，例如 `{ tarball: 'https://...', integrity: '...' }`
  - 自定义解析： `{ type: 'custom:cdn', url: '...' }`

自定义解析必须由相应的自定义获取器处理。

:::warning 自定义解析类型

Custom resolutions must use the `custom:` prefix in their type field (e.g., `custom:cdn`, `custom:artifactory`) to differentiate them from pnpm's built-in resolution types.

:::

##### `shouldRefreshResolution(depPath, pkgSnapshot): boolean | Promise<boolean>`

Return `true` to trigger full resolution of all packages, skipping the "Lockfile is up to date" optimization. This is useful for implementing time-based cache invalidation or other custom re-resolution logic.

**参数：**
- `depPath` - The package identifier string (e.g., `lodash@4.17.21`)
- `pkgSnapshot` - 此软件包的锁定文件条目，提供对解析、依赖项等的直接访问。

**返回值：** `true` 以强制重新解析， 否则`false`。

:::note

` shouldRefreshResolution ` 在冻结的锁文件安装过程中被跳过，因为在该模式下不允许分辨率。

:::

### 自定义获取器

自定义获取器完全处理自定义包类型的获取，从自定义源下载包内容并将其存储在 pnpm 的内容寻址文件系统中。

#### 获取器接口

A custom fetcher is an object that can implement the following methods:

##### `canFetch(pkgId, resolution): boolean | Promise<boolean>`

Determines whether this fetcher can fetch a package with the given resolution.

**参数：**
- `pkgId` - The unique package identifier from the resolution phase
- `resolution` - The resolution object from a resolver's `resolve` method

**Returns:** `true` if this fetcher can handle fetching this package, `false` otherwise.

##### `fetch(cafs, resolution, opts, fetchers): FetchResult | Promise<FetchResult>`

Fetches package files and returns metadata about the fetched package.

**参数：**
- `cafs` - Content-addressable file system interface for storing files
- `resolution` - The resolution object (same as passed to `canFetch`)
- `opts` - Fetch options including:
  - `lockfileDir` - 包含锁定文件的目录
  - `filesIndexFile` - Path for the files index
  - `onStart` - Optional callback when fetch starts
  - `onProgress` - Optional progress callback
- `fetchers` - Object containing pnpm's standard fetchers for delegation:
  - `remoteTarball` - Fetcher for remote tarballs
  - `localTarball` - Fetcher for local tarballs
  - `gitHostedTarball` - Fetcher for GitHub/GitLab/Bitbucket tarballs
  - `directory` - Fetcher for local directories
  - `git` - Fetcher for git repositories

**返回值：** 对象，包含：
- `filesIndex` - Map of relative file paths to their physical locations. For remote packages, these are paths in pnpm's content-addressable store (CAFS). For local packages (when `local: true`), these are absolute paths to files on disk.
- `manifest` - Optional. The package.json from the fetched package. If not provided, pnpm will read it from disk when needed. Providing it avoids an extra file I/O operation and is recommended when you have the manifest data readily available (e.g., already parsed during fetch).
- `requiresBuild` - Boolean indicating whether the package has build scripts that need to be executed. Set to `true` if the package has `preinstall`, `install`, or `postinstall` scripts, or contains `binding.gyp` or `.hooks/` files. Standard fetchers determine this automatically using the manifest and file list.
- `local` - Optional. Set to `true` to load the package directly from disk without copying to pnpm's store. When `true`, `filesIndex` should contain absolute paths to files on disk, and pnpm will hardlink them to `node_modules` instead of copying. This is how the directory fetcher handles local dependencies (e.g., `file:../my-package`).

:::tip Delegating to Standard Fetchers

Custom fetchers can delegate to pnpm's built-in fetchers using the `fetchers` parameter.

:::

#### Usage Examples

##### Basic Custom Resolver

This example shows a custom resolver that resolves packages from a custom registry:

```js title=".pnpmfile.cjs"
const customResolver = {
  // Only handle packages with @company scope
  canResolve: (wantedDependency) => {
    return wantedDependency.alias.startsWith('@company/')
  },

  resolve: async (wantedDependency, opts) => {
    // Fetch metadata from custom registry
    const response = await fetch(
      `https://custom-registry.company.com/${wantedDependency.alias}/${wantedDependency.bareSpecifier}`
    )
    const metadata = await response.json()

    return {
      id: `${metadata.name}@${metadata.version}`,
      resolution: {
        tarball: metadata.tarballUrl,
        integrity: metadata.integrity
      }
    }
  }
}

module.exports = {
  resolvers: [customResolver]
}
```

##### Custom Resolver and Fetcher with `shouldRefreshResolution`

This example shows a resolver and fetcher working together with a custom resolution type and time-based cache invalidation:

```js title=".pnpmfile.cjs"
const customResolver = {
  canResolve: (wantedDependency) => {
    return wantedDependency.alias.startsWith('company-cdn:')
  },

  resolve: async (wantedDependency, opts) => {
    const actualName = wantedDependency.alias.replace('company-cdn:', '')
    const version = await fetchVersionFromCompanyCDN(actualName, wantedDependency.bareSpecifier)

    return {
      id: `company-cdn:${actualName}@${version}`,
      resolution: {
        type: 'custom:cdn',
        cdnUrl: `https://cdn.company.com/packages/${actualName}/${version}.tgz`,
        cachedAt: Date.now(), // Custom metadata for shouldRefreshResolution
      },
    }
  },

  shouldRefreshResolution: (depPath, pkgSnapshot) => {
    // Check custom metadata stored in the resolution
    const cachedAt = pkgSnapshot.resolution?.cachedAt
    if (cachedAt && Date.now() - cachedAt > 24 * 60 * 60 * 1000) {
      return true // Re-resolve if cached more than 24 hours ago
    }
    return false
  },
}

const customFetcher = {
  canFetch: (pkgId, resolution) => {
    return resolution.type === 'custom:cdn'
  },

  fetch: async (cafs, resolution, opts, fetchers) => {
    // Delegate to pnpm's standard tarball fetcher
    const tarballResolution = {
      tarball: resolution.cdnUrl,
      integrity: resolution.integrity,
    }

    return fetchers.remoteTarball(cafs, tarballResolution, opts)
  },
}

module.exports = {
  resolvers: [customResolver],
  fetchers: [customFetcher],
}
```

##### Basic Custom Fetcher

This example shows a custom fetcher that fetches certain packages from a different source:

```js title=".pnpmfile.cjs"
const customFetcher = {
  canFetch: (pkgId, resolution) => {
    return pkgId.startsWith('@company/')
  },

  fetch: async (cafs, resolution, opts, fetchers) => {
    // Delegate to pnpm's tarball fetcher with modified URL
    const tarballResolution = {
      tarball: resolution.tarball.replace(
        'https://registry.npmjs.org/',
        'https://custom-registry.company.com/'
      ),
      integrity: resolution.integrity
    }

    return fetchers.remoteTarball(cafs, tarballResolution, opts)
  }
}

module.exports = {
  fetchers: [customFetcher]
}
```

##### Custom Resolution Type with Resolver and Fetcher

This example shows a custom resolver and fetcher working together with a custom resolution type:

```js title=".pnpmfile.cjs"
const customResolver = {
  canResolve: (wantedDependency) => {
    return wantedDependency.alias.startsWith('@internal/')
  },

  resolve: async (wantedDependency) => {
    return {
      id: `${wantedDependency.alias}@${wantedDependency.bareSpecifier}`,
      resolution: {
        type: 'custom:internal-directory',
        directory: `/packages/${wantedDependency.alias}/${wantedDependency.bareSpecifier}`
      }
    }
  }
}

const customFetcher = {
  canFetch: (pkgId, resolution) => {
    return resolution.type === 'custom:internal-directory'
  },

  fetch: async (cafs, resolution, opts, fetchers) => {
    // Delegate to pnpm's directory fetcher for local packages
    const directoryResolution = {
      type: 'directory',
      directory: resolution.directory
    }

    return fetchers.directory(cafs, directoryResolution, opts)
  }
}

module.exports = {
  resolvers: [customResolver],
  fetchers: [customFetcher]
}
```

#### Priority and Ordering

When multiple resolvers are registered, they are checked in order. The first resolver where `canResolve` returns `true` will be used for resolution. The same applies for fetchers: The first fetcher where `canFetch` returns `true` will be used during the fetch phase.

Custom resolvers are tried before pnpm's built-in resolvers (npm, git, tarball, etc.), giving you full control over package resolution.

#### Performance Considerations

`canResolve()`, `canFetch()`, and `shouldRefreshResolution()` should be cheap checks (ideally synchronous), as they're called for every dependency during resolution.

## 相关配置

### ignorePnpmfile

* 默认值：**false**
* 类型：**Boolean**

pnpmfile 将被忽略。 想要确保在安装期间没有执行任何脚本的话，和 `--ignore-scripts` 一起使用会比较方便。

### pnpmfile

* 默认值： **['.pnpmfile.mjs']**
* 类型： **路径[]**
* 例子：**['.pnpm/.pnpmfile.mjs']**

本地 pnpmfile(s) 的位置。

### globalPnpmfile

* 默认值：**null**
* 类型：**path**
* 例子：**~/.pnpm/global_pnpmfile.mjs**

全局 pnpmfile 的位置。 在安装期间，所有项目都会使用全局 pnpmfile 。

:::note

建议使用本地 pnpmfiles。 仅当在未使用 pnpm 作为主包管理器的项目上使用 pnpm 时，才使用全局 pnpmfile 。

:::

[查找器]: ./finders.md

[`pnpm patch`]: ./cli/patch.md

