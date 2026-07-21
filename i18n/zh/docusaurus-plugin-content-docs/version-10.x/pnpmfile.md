---
id: pnpmfile
title: .pnpmfile.cjs
---

pnpm 允许你通过特殊功能（钩子）直接挂钩到安装过程。 钩子可以在名为 `.pnpmfile.cjs` 的文件中声明。

默认情况下， `.pnpmfile.cjs` 应该与锁文件位于同一目录中。 例如，在具有共享锁文件的 [工作空间](workspaces.md) 中 `.pnpmfile.cjs` 应该位于 monorepo 的根目录中。

## 钩子

### 摘要：

| 钩子函数                                                  | 过程                    | 用途                           |
| ----------------------------------------------------- | --------------------- | ---------------------------- |
| `hooks.readPackage(pkg, context): pkg`                | 在 pnpm 解析依赖的软件清单文件后调用 | 允许你改变依赖的 `package.json`      |
| `hooks.afterAllResolved(lockfile, context): lockfile` | 在解析完依赖关系后调用。          | 允许你更改锁文件。                    |
| `hooks.beforePacking(pkg): pkg`                       | 在打包/发布过程中创建 tar 包之前调用 | 允许你自定义已发布的 `package.json` 文件 |

### `hooks.readPackage(pkg, context): pkg | Promise<pkg>`

允许你在语法解析之后、依赖解析之前改变依赖项的 `package.json`。 这些突变不会保存到文件系统，但是，它们将影响被解析至锁文件的内容，从而影响哪些包将被安装。

请注意，如果你已经解析好了要修改的依赖项，则需要删除 `pnpm-lock.yaml`。

:::tip

如果你需要将 `package.json` 的变化保存到文件系统中，你需要使用 `pnpm patch` 命令对 `package.json` 文件进行修补。
例如，如果你想删除依赖项的 `bin` 字段，这可能很有用。

:::

#### 参数

- `pkg` - 包的清单。 来自注册源的响应或 `package.json` 的内容。
- `context` - 步骤的上下文对象。 `#log(msg)` 方法允许你使用该步骤的调试日志。

#### 使用方法

示例 `.pnpmfile.cjs` （更改依赖项的依赖关系）：

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

使用 `readPackage` 从依赖项的清单中删除 `scripts` 字段不会阻止 pnpm 构建依赖项。 构建依赖时，pnpm 从包的存档中读取包的 `package.json`，这不受钩子的影响。 为了忽略包的构建，请使用
[neverBuiltDependencies](settings.md#neverbuiltdependencies) 字段。

### `hooks.updateConfig(config): config | Promise<config>`

添加于：v10.8.0

允许你修改 pnpm 使用的配置设置。 此钩子与 [configDependencies](config-dependencies) 配对使用时非常有用，允许你在不同的 Git 存储库之间共享和重用设置。

例如，[@pnpm/plugin-better-defaults](https://github.com/pnpm/plugin-better-defaults) 使用 `updateConfig` 钩子来应用一组精选的推荐设置。

#### 用法示例

```js title=".pnpmfile.cjs"
module.exports = {
  hooks: {
    updateConfig (config) {
      return Object.assign(config, {
        enablePrePostScripts: false,
        optimisticRepeatInstall: true,
        resolutionMode: 'lowest-direct',
        verifyDepsBeforeRun: 'install',
      })
    }
  }
}
```

### `hooks.afterAllResolved(lockfile, context): lockfile | Promise<lockfile>`

允许你在序列化之前更改锁文件的输出。

#### 参数

- `lockfile` - 锁文件的解析对象，序列化为 `pnpm-lock.yaml`。
- `context` - 步骤的上下文对象。 `#log(msg)` 方法允许你使用该步骤的调试日志。

#### 用法示例

```js title=".pnpmfile.cjs"
function afterAllResolved(lockfile, context) {
  // ...
  return lockfile
}

module.exports = {
  hooks: {
    afterAllResolved
  }
}
```

#### 已知限制

没有 - 任何可以通过修改锁文件达到的功能都可以通过这个函数完成，甚至可以扩展锁文件的功能。

### `hooks.beforePacking(pkg): pkg | Promise<pkg>`

新增于：v10.28.0

允许你在 `pnpm pack` 或 `pnpm publish` 过程中在被打包进 tarball 之前修改 package.json 。 这有助于自定义发布的软件包，而不影响你的本地开发的 package.json。

与 `hooks.readPackage` 不同，后者会修改安装期间依赖项的解析方式，而 `beforePacking` 只会影响发布的 tarball 的内容。

#### 参数

- `pkg` - 将包含在已发布的 tarball 中的软件包清单对象。

#### 用法示例

```js title=".pnpmfile.cjs"
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

module.exports = {
  hooks: {
    beforePacking
  }
}
```

:::note

此钩子所做的修改只会影响 tarball 中的 `package.json`。 你本地的 `package.json` 文件保持不变。

:::

### `hooks.preResolution(options): Promise<void>`

此钩子在读取和解析项目的锁文件 （lockfiles）之后但在解析依赖项之前执行。 它允许修改锁文件对象。

#### 参数

- `options.existsCurrentLockfile` - 如果`node_modules/.pnpm/lock.yaml`上的锁文件存在，则为真。
- `options.currentLockfile` - 来自 `node_modules/.pnpm/lock.yaml` 的锁文件对象。
- `options.existsNonEmptyWantedLockfile` - 如果 `pnpm-lock.yaml` 中的锁文件存在，则为真。
- `options.wantedLockfile` - 来自 `pnpm-lock.yaml` 的锁文件对象。
- `options.lockfileDir` - 所需锁文件所在的目录。
- `options.storeDir` - 存储目录的位置。
- `options.registries` - 范围到注册表 URL 的映射。

### `hooks.importPackage(destinationDir, options): Promise<string | undefined>`

此钩子允许更改软件包如何写入`node_modules`。 返回值是可选的，并说明用于导入依赖项的方法，例如：clone、hardlink。

#### 参数

- `destinationDir` - The destination directory where the package should be written.
- `options.disableRelinkLocalDirDeps`
- `options.filesMap`
- `options.force`
- `options.resolvedFrom`
- `options.keepModulesDir`

### `hooks.fetchers`

This hook allows to override the fetchers that are used for different types of dependencies. It is an object that may have the following fields:

- `localTarball`
- `remoteTarball`
- `gitHostedTarball`
- `directory`
- `git`

## 查找器

添加于：v10.16.0

查找器函数通过 `--find-by` 标志与 `pnpm list` 和 `pnpm why` 一起使用。

示例：

```js title=".pnpmfile.cjs"
module.exports = {
  finders: {
    react17: (ctx) => {
      return ctx.readManifest().peerDependencies?.react === "^17.0.0"
    }
  }
}
```

使用方法：

```
pnpm why --find-by=react17
```

有关更多详细信息，请参阅 \[Finders]\[查找器]。

[Finders]: ./finders.md

## 相关配置

### ignorePnpmfile

- 默认值： **false**
- 类型：**Boolean**

`.pnpmfile.cjs` 将被忽略。 想要确保在安装期间没有执行任何脚本的话，和 `--ignore-scripts` 一起使用会比较方便。

### pnpmfile

- 默认值：**['.pnpmfile.cjs']**
- 类型：**路径[]**
- 示例： **['.pnpm/.pnpmfile.cjs']**

本地 pnpmfile(s) 的位置。

### globalPnpmfile

- 默认值： **null**
- 类型：**路径**
- 示例：**~/.pnpm/global_pnpmfile.cjs**

全局 pnpmfile 的位置。 在安装期间，所有项目都会使用全局 pnpmfile 。

:::note

建议使用本地 pnpmfiles。 仅当在未使用 pnpm 作为主包管理器的项目上使用 pnpm 时，才使用全局 pnpmfile 。

:::

[`pnpm patch`]: ./cli/patch.md

