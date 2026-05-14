---
id: settings
title: "设置（pnpm-workspace.yaml）"
---

pnpm 从命令行、环境变量、`pnpm-workspace.yaml` 和
`.npmrc` 文件获取其配置。

`pnpm config` 命令可用于读取和编辑项目和全局配置文件的内容。

相关配置文件是：

- 项目配置文件：`/path/to/my/project/pnpm-workspace.yaml`
- [全局配置文件](./cli/config.md)

:::note

授权相关的设置通过 [`.npmrc`](./npmrc.md) 处理。

:::

配置文件中的值可能包含使用 `${NAME}` 语法的环境变量。 也可以使用默认值指定环境变量。 使用 `${NAME-fallback}` 将在未设置 `NAME` 时返回 `fallback`。 `${NAME:-fallback}` ，会在 `NAME` 不存在或为空字符串时返回 `fallback` 。

[INI-formatted]: https://en.wikipedia.org/wiki/INI_file

## 依赖解析

### overrides

此字段允许您指示 pnpm 覆盖依赖关系图中的任何依赖项。 这对于强制所有软件包使用一个依赖项的单个版本、反向移植一个修复、用分叉替换依赖项或删除未使用的依赖项很有用。

请注意，overrides 字段只能在项目的根目录下设置。

`overrides` 字段的示例：

```yaml
overrides:
  "foo": "^1.0.0"
  "quux": "npm:@myorg/quux@^1.0.0"
  "bar@^2.1.0": "3.0.0"
  "qar@1>zoo": "2"
```

你可以用 ">" 来覆盖某个包下的子依赖的版本，比如 `qar@1>zoo` 只会覆盖 `qar@1` 依赖的 `zoo` 的版本，而不会影响其他依赖。

一个overide可以被定义为直接依赖的规则的引用。
这通过依赖名称前缀一个 `$` 实现:

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

被引用的包不必匹配需要覆盖的包：

```yaml title="pnpm-workspace.yaml"
overrides:
  bar: "$foo"
```

如果你发现你使用某个包不需要它的依赖之一，你可以使用 `-` 来删除它。 例如，如果软件包 `foo@1.0.0` 需要一个名为 `bar` 的大型软件包来实现你不使用的功能，删除它可以减少安装时间：

```yaml
overrides:
  "foo@1.0.0>bar": "-"
```

此功能对于 `optionalDependencies` 特别有用，其中大多数可选包可以被安全地跳过。

### packageExtensions

`packageExtension` 字段提供了一种用额外信息扩展现有软件包定义的方法。 例如，如果 `react-redux` 本应该在它的 `peerDependencies` 中包含 `react-dom` 但它没有，则可以用 `packageExtensions` 来填补上 `react-redux`。

```yaml
packageExtensions:
  react-redux:
    peerDependencies:
      react-dom: "*"
```

`packageExtensions` 中的键是包名或包名和 semver 范围，因此可以只修补包的某些版本：

```yaml
packageExtensions:
  react-redux@1:
    peerDependencies:
      react-dom: "*"
```

以下字段可以使用 `packageExtensions` 进行扩展： `dependencies`、`optionalDependencies`、`peerDependencies` 和 `peerDependenciesMeta`。

一个更大的例子：

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

我们与 Yarn 一起维护一个 `packageExtensions` 的数据库，以便修补在生态系统中损坏的包。
如果你使用 `packageExtensions`, 考虑发送一个 PR 上游并将你的扩展贡献给 \[`@yarnpkg/extension`] 数据库。

:::

[`@yarnpkg/extensions`]: https://github.com/yarnpkg/berry/blob/master/packages/yarnpkg-extensions/sources/index.ts

### allowedDeprecatedVersions

此项设置允许忽略特定依赖包的 deprecation 警告。

示例：

```yaml
allowedDeprecatedVersions:
  express: "1"
  request: "*"
```

使用上述配置，pnpm 将不会打印 `request` 任何版本和 `express` v1 版本的弃用警告。

### updateConfig

#### updateConfig.ignoreDependencies

有时您无法更新依赖项。 例如，最新版本的依赖项开始使用 ESM，但您的项目尚未采用 ESM。 恼人的是，这样的包将始终被 `pnpm outdated` 命令打印出来，并在运行 `pnpm update --latest` 时更新。 但是，你可以在 `ignoreDependencies` 字段中列出你不想更新的包：

```yaml
updateConfig:
  ignoreDependencies:
  - load-json-file
```

模式匹配也是支持的，因此你可以忽略在特定范围内的任何包： `@babel/*`。

### 支持的架构

你可以指定要安装的可选依赖项的架构，即使它们与运行安装的系统的架构不匹配。

例如，以下配置指示安装 Windows x64 的可选依赖项：

```yaml
supportedArchitectures:
  os:
  - win32
  cpu:
  - x64
```

而此配置将为 Windows、macOS 以及当前正在运行安装的系统架构安装可选依赖项。 它包括 x64 和 arm64 CPU 的工件：

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

另外， `supportedArchitectures` 还支持指定系统的 `libc`。

### ignoredOptionalDependencies

如果可选依赖项的名称包含在此数组中，则会跳过它。 示例：

```yaml
ignoredOptionalDependencies:
- fsevents
- "@esbuild/*"
```

### minimumReleaseAge

添加于：v10.16.0

- 默认值：**0**
- 类型：**number (分钟)**

为了降低安装受损软件包的风险，你可以延迟安装新发布的版本。 大多数情况下，恶意发布会在一小时内被发现并从注册源中删除。

`minimumReleaseAge` 设置定义了版本发布后 pnpm 安装之前必须经过的最少分钟数。 这适用于**所有依赖项**，包括传递依赖项。

例如，以下设置确保只能安装至少一天前发布的软件包：

```yaml
minimumReleaseAge: 1440
```

### minimumReleaseAgeExclude

添加于：v10.16.0

- 默认值：**undefined**
- 类型：**string[]**

如果你设置了 `minimumReleaseAge`，但需要某些依赖项始终立即安装最新版本，则可以在 `minimumReleaseAgeExclude` 列出它们。 排除由 **软件包名称** 起作用，适用于该软件包的所有版本。

示例：

```yaml
minimumReleaseAge: 1440
minimumReleaseAgeExclude:
- webpack
- react
```

在这种情况下，所有依赖项必须至少存在一天，除了 `webpack` 和 `react`，它们在发布时立即安装。

添加于: v10.17.0

你也可以使用模式。 例如，允许你组织中的所有包：

```yaml
minimumReleaseAge: 1440
minimumReleaseAgeExclude:
- '@myorg/*'
```

添加于：v10.19.0

你也可以排除特定版本（或使用 `||` 的特定版本列表）。 这允许固定对到期时间规则的例外：

```yaml
minimumReleaseAge: 1440
minimumReleaseAgeExclude:
- nx@21.6.5
- webpack@4.47.0 || 5.102.1
```

### trustPolicy

添加于：v10.21.0

- 默认: **off**
- 类型：**no-downgrade** | **off**

当设置为 `no-downgrade` 时，如果软件包的信任级别与以前的版本相比有所下降，pnpm 将失败。 例如，如果一个软件包之前是由受信任的发布者发布的，但现在只有来源信息而没有信任证明，则安装将会失败。 这有助于防止安装可能已被入侵的版本。 信任检查仅基于发布日期，而非语义版本控制。 如果先前发布的版本具有更强的可信度证据，则无法安装该软件包。 从 v10.24.0 开始，在评估非预发布版本安装的信任证据时，预发布版本将被忽略，因此受信任的预发布版本不能阻止缺少信任证据的稳定版本。

### trustPolicyExclude

添加于: v10.22.0

- 默认值：**[]**
- 类型：**string[]**

一份应排除在信任策略检查之外的包选择器列表。 这样，即使特定的软件包或版本不满足 `trustPolicy` 要求，你也可以安装它们。

示例：

```yaml
trustPolicy: no-downgrade
trustPolicyExclude:
  - 'chokidar@4.0.3'
  - 'webpack@4.47.0 || 5.102.1'
  - '@babel/core@7.28.5'
```

### trustPolicyIgnoreAfter

添加于：v10.27.0

- 默认值：**undefined**
- 类型：**number (分钟)**

允许忽略发布时间超过指定分钟数的软件包的信任策略检查。 这在启用严格的信任策略时非常有用，因为它允许安装旧版本的软件包（可能缺少带有签名或来源的发布流程），而无需手动排除，假设它们由于年代久远而安全。

### blockExoticSubdeps

添加于：v10.26.0

- 默认值： **false**
- 类型：**Boolean**

设置为“true”时，只有直接依赖项（在根目录 `package.json` 中列出的依赖项）才能使用特殊来源（例如 git 仓库或直接 tarball URL）。 所有传递依赖项都必须从受信任的来源解析，例如配置的注册表、本地文件路径、工作区链接或受信任的 GitHub 存储库（node、bun、deno）。

此设置有助于保护依赖项供应链，防止传递依赖项从不受信任的位置引入代码。

异域资源包括：

- Git 仓库（`git+ssh://...`）
- 直接链接到 tar 包（`https://.../package.tgz`）

## 依赖提升设置

### hoist

- 默认值：**true**
- 类型：**Boolean**

当为 `true` 时，所有依赖项都会被提升到 `node_modules/.pnpm/node_modules`。 这使得 `node_modules` 中的所有包都可以访问未列出的依赖项。

### hoistWorkspacePackages

- 默认值：**true**
- 类型：**Boolean**

当为 `true` 时，工作区中的包将符号链接到 `<workspace_root>/node_modules/.pnpm/node_modules` 或 `<workspace_root>/node_modules`，具体取决于其他提升设置（`hoistPattern` 和 `publicHoistPattern`）。

### hoistPattern

- 默认值：**['\*']**
- 类型：**string[]**

告诉 pnpm 哪些包应该被提升到 `node_modules/.pnpm/node_modules`。 默认情况下，所有包都被提升 — 但是，如果你知道只有某些有缺陷的包具有幻影依赖，你可以使用此选项专门提升幻影依赖（推荐做法）。

例如：

```yaml
hoistPattern:
- "*eslint*"
- "*babel*"
```

你还可以在模式前面添加 `!` 来避免提升。

例如：

```yaml
hoistPattern:
- "*types*"
- "!@types/react"
```

### publicHoistPattern

- 默认值：**[]**
- 类型：**string[]**

不同于 `hoist-pattern` 会把依赖提升到一个虚拟存储中的隐藏的模块目录中，`publicHoistPattern` 将匹配的依赖提升至根模块目录中。 提升至根模块目录中意味着应用代码可以访问到幻影依赖，即使它们对解析策略做了不当的修改。

当处理一些不能正确解析依赖关系的有缺陷可插拔工具时，此设置很有用。

例如：

```yaml
publicHoistPattern:
- "*plugin*"
```

注意：设置 `shamefully-hoist` 为 `true` 与设置 `public-hoist-pattern` 为 `*` 是一样的。

你还可以在模式前面添加 `!` 来避免提升。

例如：

```yaml
publicHoistPattern:
- "*types*"
- "!@types/react"
```

### shamefullyHoist

- 默认值： **false**
- 类型：**Boolean**

默认情况下，pnpm 创建一个半严格的 `node_modules`，这意味着依赖项可以访问未声明的依赖项，但 `node_modules` 之外的模块不行。
通过这种布局，生态系统中的大多数的包都可以正常工作。
但是，如果某些工具仅在提升的依赖项位于根目录的 `node_modules` 时才有效，你可以将其设置为 `true` 来提升它们。

## Node 模块设置

### modulesDir

- 默认值：**node_modules**
- 类型：**路径**

将安装依赖项的目录（而不是 `node_modules`）。

### nodeLinker

- 默认值：**isolated**
- 类型：**isolated**、**hoisted**、**pnp**

定义应该使用什么链接器来安装 Node 包。

- **isolated** - 依赖项从虚拟存储 `node_modules/.pnpm` 中建立符号链接
- **hoisted** - 创建一个没有符号链接的扁平的 `node_modules`。 与 npm 或 Yarn Classic 创建的 `node_modules` 一致。 当使用此设置时，Yarn 的一个库用于提升。 使用此设置的正当理由：
  1. 你的工具无法很好地与符号链接配合使用。 React Native 项目很可能只有在你使用提升的 `node_modules` 才能工作。
  2. 你的项目会被部署到 serverless 服务提供商。 一些 serverless 提供商（例如 AWS Lambda）不支持符号链接。 此问题的另一种解决方案是在部署之前打包你的应用程序。
  3. 如果你想使用 [`"bundledDependencies"`] 发你的包。
  4. 如果你使用 [--preserve-symlinks] 标志运行 Node.js。
- **pnp** — 没有 `node_modules`。 Plug'n'Play 是一种 [Yarn Berry][pnp] 使用的创新的 Node 依赖策略。 当使用 `pnp` 作为你的链接器时，建议同时将 `symlink` 设置为 `false`。

[pnp]: https://yarnpkg.com/features/pnp
[--preserve-symlinks]: https://nodejs.org/api/cli.html#cli_preserve_symlinks
[`"bundledDependencies"`]: https://docs.npmjs.com/cli/v8/configuring-npm/package-json#bundleddependencies

### 符号链接

- 默认值：**true**
- 类型：**Boolean**

当 `symlink` 设置为 `false` 时，pnpm 创建一个没有任何符号链接的虚拟存储目录。 这与 `node-linker=pnp` 一起是一个有用的设置。

### enableModulesDir

- 默认值：**true**
- 类型：**Boolean**

当为 `false` 时，pnpm 不会将任何文件写入模块目录
(`node_modules`)。 这对于在用户空间的文件系统 (FUSE) 中挂载模块目录时很有用。 有一个实验性 CLI 允许你在 FUSE 中挂载模块目录：[@pnpm/mount-modules]。

[@pnpm/mount-modules]: https://www.npmjs.com/package/@pnpm/mount-modules

### virtualStoreDir

- 默认值：**node_modules/.pnpm**
- 类型：**路径**

带有指向存储的链接的目录。 所有直接和间接依赖项都链接到此目录中。

这是一个有用的设置，可以解决 Windows 上长路径的问题。 如果你有一些路径很长的依赖项，你可以选择将虚拟存储放在驱动器的根目录中（例如 `C:\my-project-store`）。

或者你可以将虚拟存储设置为 `.pnpm` 并将其添加到 `.gitignore`。 这将使堆栈跟踪更清晰，因为依赖项的路径将会提高一个目录层级。

\*\*注意：\*\*虚拟存储不能在多个项目之间共享。 每个项目都应该有自己的虚拟存储（除了在工作空间中被共享的根目录）。

### virtualStoreDirMaxLength

- 默认值：
  - 在 Linux/macOS 上：**120**
  - 在 Windows 上：**60**
- 类型：**number**

设置虚拟存储目录 (`node_modules/.pnpm`) 中目录名称的最大允许长度。 如果你在 Windows 上遇到长路径问题，你可以将其设置为较低的数字。

### packageImportMethod

- 默认值： **auto**
- 类型：**auto**、**hardlink**、**copy**、**clone**、**clone-copy**

控制从存储中导入包的方式（如果要禁用 `node_modules` 中的符号链接，则需要更改 [nodeLinker] 设置，而不是此设置）。

- **auto** - 尝试从存储克隆包。 如果不支持克隆则从存储硬链接包。 如果克隆和链接都不支持，则回退到复制
- **hardlink** - 从存储硬链接包
- **clone-or-copy** - 尝试从存储中克隆包。 如果不支持克隆则回退到复制。
- **copy** - 从存储中复制包
- **clone** - 从存储中克隆（也称为 copy-on-write 或参考链接）包

克隆是将包写入 node_modules 的最佳方式。 这是最快的方式，也是最安全的方式。 当使用克隆时，你可以在 node_modules 中编辑文件，并且它们不会在中央内容可寻址存储中被修改。

不幸的是，并非所有文件系统都支持克隆。 我们建议使用写时复制 (CoW) 文件系统（例如，在 Linux 上使用 Btrfs 而不是 Ext4）以获得最佳的 pnpm 体验。

[nodeLinker]: #nodeLinker

### modulesCacheMaxAge

- 默认值：**10080** （以分钟为单位的 7 天）
- 类型：**number**

孤立包应该从模块目录中被删除的时间（以分钟为单位）。
pnpm 在模块目录中保存了一个包的缓存。 切换分支或降级依赖项时，这会提高安装速度。

### dlxCacheMaxAge

- 默认值：**1440** （以分钟为单位的 1 天）
- 类型：**number**

Dlx 缓存过期的时间（以分钟为单位）。
执行 dlx 命令后，pnpm 会保留一个缓存，该缓存会省略后续调用同一 dlx 命令的安装步骤。

### enableGlobalVirtualStore

添加于：v10.12.1

- 默认值：**false**（在 CI 中始终为 **false**）
- 类型：**Boolean**
- 状态：**实验性**

如果启用，`node_modules` 只包含到一个中心虚拟存储的符号链接，而不是 `node_modules/.pnpm`。 默认情况下，此中央存储位于 `STORE_PATH/links`（使用 `pnpm store path` 来查找 `STORE_PATH`）。

在中央虚拟存储中，每个包都被硬链接到一个目录中，该目录的名称是其依赖关系图的哈希值。 因此，系统上的所有项目都可以从磁盘上的这个共享位置符号链接它们的依赖项。 这种方法在概念上类似于 [NixOS 管理包的方式][NixOS manages packages]，使用依赖图哈希在 Nix 存储中创建隔离且可共享的包目录。

> 这不应与全局内容可寻址存储混淆。 实际的包文件仍然与内容可寻址存储硬链接 - 但不是直接链接到 `node_modules/.pnpm`，而是链接到全局虚拟存储。

当有热缓存可用时，使用全局虚拟存储可以显著加快安装速度。 然而，在 CI 环境中（通常不存在缓存），它可能会减慢安装速度。 如果 pnpm 检测到它正在 CI 中运行，则此设置将自动禁用。

:::important

为了在使用全局虚拟存储时支持提升的依赖项，pnpm 依赖于 `NODE_PATH` 环境变量。 这允许 Node.js 解析来自提升的 `node_modules` 目录的包。 但是，**此解决方法不适用于 ESM 模块**，因为 Node.js 在使用 ESM 时不再尊重 `NODE_PATH`。

如果你的依赖项是 ESM，并且它们导入的包未在其自己的 `package.json` 中声明（这被认为是不好的做法），你可能会遇到解析错误。 有两种方法可以解决此问题：

- 使用 [packageExtensions] 明确添加缺少的依赖项。
- 将 [@pnpm/plugin-esm-node-path] 配置依赖项添加到你的项目。 该插件注册了一个自定义 ESM 加载器，可恢复对 ESM 的 `NODE_PATH` 支持，从而允许正确解析提升的依赖项。

:::

[packageExtensions]: #packageextensions
[@pnpm/plugin-esm-node-path]: https://github.com/pnpm/plugin-esm-node-path
[NixOS manages packages]: https://nixos.org/guides/how-nix-works/

## 存储设置

### storeDir

- 默认值：
  - 如果设置了 **$PNPM_HOME** 环境变量，则为 **$PNPM_HOME/pnpm/rc**
  - 如果设置了 **$XDG_DATA_HOME** 环境变量，则为 **$XDG_DATA_HOME/pnpm/store**
  - 在 Windows 上： **~/AppData/Local/pnpm/store**
  - 在 macOS 上：**~/Library/pnpm/global**
  - 在 Linux 上：**~/.local/share/pnpm/store**
- 类型：**路径**

所有包被保存在磁盘上的位置。

该存储应始终位于进行安装的同一磁盘上，因此每个磁盘将有一个存储。 如果在使用磁盘中具有主目录，存储目录就会创建在这里。 如果磁盘上没有主目录，那么将在文件系统的根目录中创建该存储。 例如，如果安装发生在挂载在 `/mnt` 的文件系统上，那么存储将在 `/mnt/.pnpm-store` 处创建。 Windows 系统上也是如此。

可以从不同的磁盘设置同一个存储，但在这种情况下，pnpm 将复制包而不是硬链接它们，因为硬链接只能发生在同一文件系统上。

### verifyStoreIntegrity

- 默认值：**true**
- 类型：**Boolean**

默认情况下，如果存储中的文件已被修改，则在将其链接到项目的 `node_modules` 之前会检查该文件的内容。 如果 `verifyStoreIntegrity` 设置为 `false`，则在安装过程中不会检查内容可寻址存储中的文件。

### useRunningStoreServer

:::danger

已弃用的功能

:::

- 默认值： **false**
- 类型：**Boolean**

只允许使用存储服务器进行安装。 如果没有在运行的存储服务器，安装将失败。

### strictStorePkgContentCheck

- 默认值：**true**
- 类型：**Boolean**

一些注册源允许以不同的包名或版本，发布完全相同的内容。 这破坏了存储中包的有效性检查。 为了避免在存储中验证此类软件包的名称和版本时出现错误，你可以将 `strictStorePkgContentCheck` 设置设为 `false`。

## 锁文件设置

### 锁文件

- 默认值：**true**
- 类型：**Boolean**

当设置为 `false` 时，pnpm 不会读取或生成 `pnpm-lock.yaml` 文件。

### preferFrozenLockfile

- 默认值：**true**
- 类型：**Boolean**

当设置为 `true` 并且存在 `pnpm-lock.yaml` 满足
`package.json` 中的依赖关系时，执行无头安装。 无头安装会跳过所有依赖项解析，因为它不需要修改锁文件。

### lockfileIncludeTarballUrl

- 默认值： **false**
- 类型：**Boolean**

将包的 tarball 的完整 URL 添加到 `pnpm-lock.yaml` 中的每个条目。

### gitBranchLockfile

- 默认值： **false**
- 类型：**Boolean**

如果设置为 `true`，那么在安装后生成的锁文件名称将基于当前分支名称命名，以完全避免合并冲突。 例如，如果当前分支名称为 `feature-foo`，则
对应的锁文件名称将为
`pnpm-lock.feature-foo.yaml` 而不是 `pnpm-lock.yaml`。 它通常与命令行参数 `--merge-git-branch-lockfiles` 一起使用，或者通过在 `.npmrc` 文件中设置 `mergeGitBranchLockfilesBranchPattern` 来使用。

### mergeGitBranchLockfilesBranchPattern

- 默认值： **null**
- 类型：**Array 或 null**

此配置匹配当前分支名称以确定是否合并所有 git 分支锁文件文件。 默认情况下，你需要手动传递 `--merge-git-branch-lockfiles` 命令行参数。 这项配置允许自动完成这个过程。

例如：

```yaml
mergeGitBranchLockfilesBranchPattern:
- main
- release*
```

你还可以使用 `!` 来排除模式。

### peersSuffixMaxLength

- 默认值：**1000**
- 类型：**number**

添加到锁文件中的依赖项键的 peer ID 后缀的最大长度。 如果后缀较长，则用井号替换。

## 请求设置

### gitShallowHosts

- 默认值：**['github.com', 'gist.github.com', 'gitlab.com', 'bitbucket.com', 'bitbucket.org']**
- 类型：**string[]**

当获取 Git 仓库中的依赖项时，如果域名在此设置中列出，pnpm 将使用浅克隆仅获取所需的提交，而不是所有历史记录。

### networkConcurrency

- 默认值：**自动（工作进程 × 3，限制在 16-64 之间）**
- 类型：**Number**

控制同时处理的最大 HTTP(S) 的网络请求数。

从 v10.24.0 开始，pnpm 会根据工作进程数自动选择 16 到 64 之间的值（网络并发=（工作进程 × 3，限制在 16-64 之间））。 明确设置这个值以覆盖自动缩放。

### fetchRetries

- 默认值：**2**
- 类型：**Number**

如果 pnpm 无法从registry中获取，重试次数。

### fetchRetryFactor

- 默认值：**10**
- 类型：**Number**

重试回退的指数因子。

### fetchRetryMintimeout

- 默认值：**10000（10 秒）**
- 类型：**Number**

重试请求的最小（基本）超时。

### fetchRetryMaxtimeout

- 默认值：**60000（1 分钟）**
- 类型：**Number**

最大回退超时时间，以确保重试因子不会使请求时间过长。

### fetchTimeout

- 默认值：**60000（1 分钟）**
- 类型：**Number**

等待 HTTP 请求完成的最长时间。

### fetchWarnTimeoutMs

添加于：v10.18.0

- 默认： **1000毫秒 (10 秒)**
- 类型：**Number**

如果对注册表的元数据请求所花的时间超过指定的阈值（以毫秒为单位），则会显示警告消息。

### fetchMinSpeedKiBps

添加于：v10.18.0

- 默认值：50 KiB/s
- 类型：**Number**

如果从注册表下载 tarball 的速度低于指定的阈值（以 KiB/s 为单位），则会显示警告消息。

## 对等依赖设置

### autoInstallPeers

- 默认值：**true**
- 类型：**Boolean**

当值为 `true` 时，将自动安装任何缺少的非可选对等依赖。

#### 版本冲突

如果来自不同软件包的对等依赖项的需求版本存在冲突，那么 pnpm 将不会自动安装任何版本的冲突的对等依赖项。 相反，会输出一条警告信息。 比如，如果一个依赖项需要 `react@^16.0.0`，而另一个需要 `react@^17.0.0`，则会产生冲突，自动安装将不会进行。

#### 解决冲突

如果出现版本冲突，你需要评估自己安装哪个版本的对等依赖项，或更新依赖项以符合其对等依赖项要求。

### dedupePeerDependents

- 默认值：**true**
- 类型：**Boolean**

当此设置为 `true` 时，对等依赖在对等解析后会被做去重处理。

例如，假设我们有一个包含两个项目的工作区，并且它们的依赖项中都有 `webpack`。 `esbuild` 在 `webpack` 的可选对等依赖内，而其中一个项目的依赖包含 `esbuild`。 这种情况下，pnpm 会将两个 `webpack` 实例链接到 `node_modules/.pnpm` 目录：一个包含 `esbuild` ，另一个不包含。

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

这是有道理的，因为 `webpack` 在两个项目中使用，而其中一个项目没有 `esbuild`，因此这两个项目无法共享同一个 `webpack` 实例。 然而，这并不是大多数开发者所期望的，特别是在提升的 `node_modules` 中，将会只有一个 `webpack` 实例。 因此，当没有冲突的对等依赖项时，你现在可以使用 `dedupePeerDependents` 设置对 `webpack` 进行重复数据删除（最后有解释）。 在这种情况下，如果我们将 `dedupePeerDependents` 设置为`true`，则两个项目将使用相同的 `webpack`实例，即已解析 `esbuild` 的实例：

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

**什么是对等依赖冲突**？ 我们指的对等依赖冲突是如下场景：

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

在这种情况下，我们无法对 `webpack` 去重，因为 `react` 在 `webpack` 的对等依赖内，而在两个项目上下文环境中，`react` 版本不同。

### strictPeerDependencies

- 默认值： **false**
- 类型：**Boolean**

如果启用了此选项，那么在依赖树中存在缺失或无效的 peer 依赖关系时，命令将执行失败。

### resolvePeersFromWorkspaceRoot

- 默认值：**true**
- 类型：**Boolean**

启用后，将会使用根工作区项目的依赖解析工作区中任何项目的对等依赖。
这是一个有用的功能，因为你可以只在工作区的根目录中安装对等依赖，并且确保工作区中的所有项目都使用相同版本的对等依赖。

### peerDependencyRules

#### peerDependencyRules.ignoreMissing

pnpm 不会打印有关依赖列表中缺少对 peerDependency 的警告。

例如，使用以下配置，如果依赖项需要 `react` 但 `react` 未被安装，pnpm 不会打印相应警告。

```yaml
peerDependencyRules:
  ignoreMissing:
  - react
```

包名也可以使用模式匹配

```yaml
peerDependencyRules:
  ignoreMissing:
  - "@babel/*"
  - "@eslint/*"
```

#### peerDependencyRules.allowedVersions

对于指定版本范围的 peerDependency，将不会打印未满足版本范围的警告。

例如，如果你有一些依赖项需要 `react@16` 但你知道它们可以与 `react@17` 一起正常工作，那么你可以使用以下配置：

```yaml
peerDependencyRules:
  allowedVersions:
    react: "17"
```

这将告诉 pnpm 任何在其对等依赖中含有 `react` 的依赖都应该允许安装 `react` v17。

这还可以用来抑制指定包的对等依赖项引发的警告。 例如，以下配置下 `react` v17 仅在其位于 `button` v2 包的对等依赖项中或任何 `card` 包的依赖项中时才被允许：

```yaml
peerDependencyRules:
  allowedVersions:
    "button@2>react": "17",
    "card>react": "17"
```

#### peerDependencyRules.allowAny

`allowAny` 是一个匹配包名的数组，任何匹配该模式的对等依赖将可被解析为任意版本，无论 `peerDependencies` 指定的范围如何。 例如：

```yaml
peerDependencyRules:
  allowAny:
  - "@babel/*"
  - "eslint"
```

上述设置将禁用任何与 `@babel/` 或 `eslint` 有关的对等依赖版本不匹配的警告。

## 命令行设置

### [no-]color

- 默认值： **auto**
- 类型：**auto**、**tcp**、**ipc**

设置输出的颜色.

- **auto** - 当标准输出是终端或 TTY 时，输出会带有颜色。
- **always** - 忽略终端和 pipe 之间的区别。 你很少需要这个选项；在大多数情况下，如果您想在重定向的输出中使用颜色代码，你可以将 `--color` 标志传递给 pnpm 命令以强制它输出颜色。 默认设置几乎总是您想要的。
- **never** - 关闭颜色. 这是 `--no-color` 使用的设置。

### loglevel

- 默认值： **auto**
- 类型：**debug**、**info**、**warn**、**error**

将显示大于等于给定级别的日志。
你可以改为传递 `--silent` 来关闭所有输出日志。

### useBetaCli

- 默认值： **false**
- 类型：**Boolean**

启用 CLI 测试版功能的实验性选项。 这意味着你使用的 CLI 功能可能会有一些不兼容的更改或潜在错误的更改。

### recursiveInstall

- 默认值：**true**
- 类型：**Boolean**

如果启用此选项，则 `pnpm install` 的行为将变为 `pnpm install -r`，这意味着在所有工作区或子目录包上执行安装操作。

否则，`pnpm install` 将只在当前目录中构建包。

### engineStrict

- 默认值： **false**
- 类型：**Boolean**

如果启用该选项，pnpm 将不安装任何声明与当前 Node 版本不兼容的包。

但无论该属性设置成什么值，如果项目（不是依赖项）在其 `engines` 字段中指定了不兼容的版本，则安装将始终失败。

### npmPath

- 类型：**路径**

Pnpm 用于某些操作（例如发布）的 npm 的二进制文件的位置。

### packageManagerStrict

- 默认值：**true**
- 类型：**Boolean**

当此设置被禁用时，如果 pnpm 的版本与 `package.json` 的 `packageManager` 字段中指定的版本不匹配，则 pnpm 不会失败。 启用后，仅检查包名称（自 pnpm v9.2.0 起），因此无论 `packageManager` 字段中指定的版本如何，你仍然可以运行任何版本的 pnpm。

或者，你可以将环境变量`COREPACK_ENABLE_STRICT` 设置为 `0` 来禁用这个设置。

### packageManagerStrictVersion

- 默认值： **false**
- 类型：**Boolean**

启用后，如果 pnpm 的版本与 `package.json`的 `packageManager `字段中指定的版本不完全匹配，则 pnpm 将失败。

### managePackageManagerVersions

- 默认值：**true**
- 类型：**Boolean**

启用后，pnpm 将自动下载并运行 `package.json` 的 `packageManager` 字段中指定的 pnpm 版本。 这与 Corepack 使用的字段相同。 示例：

```json
{
  "packageManager": "pnpm@9.3.0"
}
```

## 构建设置

### ignoreScripts

- 默认值： **false**
- 类型：**Boolean**

不执行项目 `package.json` 及其依赖中定义的任何脚本。

:::note

该标记不会阻止 [.pnpmfile.cjs](./pnpmfile.md) 的执行

:::

### ignoreDepScripts

- 默认值： **false**
- 类型：**Boolean**

不执行已安装的包的任何脚本。 当前项目的脚本会执行

:::note

自 v10 起，pnpm 不会运行依赖项的生命周期脚本，除非它们在 [`onlyBuiltDependencies`] 中列出。

:::

[`onlyBuiltDependencies`]: settings.md#onlybuiltdependencies

### childConcurrency

- 默认值：**5**
- 类型：**Number**

同时分配的最大子进程数以构建 node_modules。

### sideEffectsCache

- 默认值：**true**
- 类型：**Boolean**

使用且缓存 (pre/post)install 钩子的结果。

当安装前/安装后脚本修改包的内容（例如构建输出）时，pnpm 会将修改后的包保存在全局存储中。 在同一台机器上的未来安装中，pnpm 会重复使用这个缓存的预构建版本，从而使安装速度显著加快。

:::note

你可能想要禁用此设置，如果：

1. 安装脚本修改包目录_外部_的文件（pnpm 无法跟踪或缓存这些更改）。
2. 这些脚本执行的副作用与构建包无关。

:::

### sideEffectsCacheReadonly

- 默认值： **false**
- 类型：**Boolean**

仅在存在 side effects cache 时使用，不要为新包创建它。

### unsafePerm

- 默认值：如果以 root 身份运行，则为 **false**，否则为 **true**
- 类型：**Boolean**

设置为 true 以便在运行包脚本package scripts时启用 UID/GID 切换。
如果显式设置为 false，则以非 root 用户身份安装将失败。

### nodeOptions

- 默认值： **NULL**
- 类型：**字符串**

通过 `NODE_OPTIONS` 环境变量传递给 Node.js 的选项。 这不会影响 pnpm 本身的执行方式，但会影响生命周期脚本的调用方式。

为了保留现有的 `NODE_OPTIONS`，你可以在配置中使用 `${NODE_OPTIONS}` 引用现有的环境变量：环境

```yaml
nodeOptions: "${NODE_OPTIONS:- } --experimental-vm-modules"
```

### verifyDepsBeforeRun

- 默认值： **false**
- 类型：**install**、**warn**、**error**、**prompt**、**false**

此设置允许在运行脚本之前检查依赖项的状态。 检查运行于 `pnpm run` 和 `pnpm exec` 命令。 支持以下属性值:

- `install` — 如果 `node_modules` 不是最新的，则自动运行安装。
- `warn` - 如果 `node_modules` 不是最新的，则打印警告。
- `prompt` - 如果 `node_modules` 不是最新的，则提示用户提供权限。
- `error` - 如果 `node_modules` 不是最新的，则会引发错误。
- `false`——禁用依赖性检查。

### strictDepBuilds

添加于：v10.3.0

- 默认值： **false**
- 类型：**Boolean**

当启用 `strictDepBuilds` 时，如果任何依赖项具有未审核的构建脚本（又名安装后脚本），则安装将以非零退出代码退出。

### allowBuilds

添加于：v10.26.0

包匹配器映射，用于显式允许（`true`）或禁止（`false`）脚本执行。 此字段取代了 `onlyBuiltDependencies` 和 `ignoredBuiltDependencies`（这两个字段也已被此新设置弃用），从而提供了一个单一的信任来源。

```yaml
allowBuilds:
  esbuild: true
  core-js: false
  nx@21.6.4 || 21.6.5: true
```

**默认行为：** 未在 `allowBuilds` 中列出的软件包默认情况下是不允许的，并且会打印警告。 如果将 [`strictDepBuilds`](#strictdepbuilds) 设置为 `true`，则会打印错误信息。

### neverBuiltDependencies

在安装过程中不允许执行 “preinstall”、“install” 和/或 “postinstall” 脚本的软件包名称列表。

使用 `neverBuiltDependencies` 而不使用 `onlyBuiltDependencies` 时要小心，因为它意味着所有其他依赖都是允许的。

`neverBuiltDependencies` 字段的示例：

```yaml
neverBuiltDependencies:
- fsevents
- level
```

### onlyBuiltDependencies

允许在安装期间执行 “preinstall”、“install” 和/或 “postinstall” 脚本的软件包名称列表。
只有此数组中列出的包才能够运行那些生命周期脚本。 如果未设置 `onlyBuiltDependenciesFile` 和 `neverBuiltDependencies` ，则此配置选项将默认阻止所有安装脚本。

示例：

```yaml
onlyBuiltDependencies:
- fsevents
```

添加于：v10.19.0

你可以将允许限制在特定版本(和使用`||`的断开的版本列表)。 当指定版本时，只有那些版本的软件包可以运行生命周期脚本：

```yaml
onlyBuiltDependencies:
- nx@21.6.4 || 21.6.5
- esbuild@0.25.1
```

### onlyBuiltDependenciesFile

此配置选项允许用户指定一个 JSON 文件，该文件列出了在 pnpm 安装过程中允许运行安装脚本的唯一包。 通过使用它，你可以增强安全性或确保在安装过程中只有特定的依赖项执行脚本。

示例：

```yaml
configDependencies:
  '@pnpm/trusted-deps': 0.1.0+sha512-IERT0uXPBnSZGsCmoSuPzYNWhXWWnKkuc9q78KzLdmDWJhnrmvc7N4qaHJmaNKIusdCH2riO3iE34Osohj6n8w==
onlyBuiltDependenciesFile: node_modules/.pnpm-config/@pnpm/trusted-deps/allow.json
```

JSON 文件本身应包含一组包名称：

```json title="node_modules/.pnpm-config/@pnpm/trusted-deps/allow.json"
[
  "@airbnb/node-memwatch",
  "@apollo/protobufjs",
  ...
]
```

### ignoredBuiltDependencies

添加于：v10.1.0

在安装过程中不允许执行 “preinstall”、“install” 和/或 “postinstall” 脚本且不会发出警告或要求执行的软件包名称列表。

当你想要隐藏警告是很有用，因为你知道不需要生命周期脚本。

示例：

```yaml
ignoredBuiltDependencies:
- fsevents
- sharp
```

### dangerouslyAllowAllBuilds

添加于：v10.9.0

- 默认值： **false**
- 类型：**Boolean**

如果设置为 `true`，所有从依赖关系生成的脚本（例如`preinstall`, `install`）将自动运行，无需批准。

:::warning

此设置允许所有依赖项（包括传递依赖项）现在和将来运行安装脚本。
即使你当前的依赖图看起来很安全：

- 未来的更新可能会引入新的、不受信任的依赖项。
- 现有的软件包可能会在后续版本中添加脚本。
- 软件包可能会被劫持或破坏并开始执行恶意代码。

为了获得最大程度的安全，只有当你充分了解风险并信任你所依赖的整个生态系统时才启用此功能。 建议明确审查并允许构建。

:::

## Node.js 设置

### useNodeVersion

- 默认值：**undefined**
- 类型：**semver**

指定应用于项目运行时的确切 Node.js 版本。
pnpm 将自动安装指定版本的 Node.js 并将其用于执行 `pnpm run` 命令或 `pnpm node` 命令。

这可以用来代替 `.nvmrc` 和 `nvm`。 而不是以下 `.nvmrc` 文件：

```
16.16.0
```

使用这个 `pnpm-workspace.yaml` 文件：

```yaml
useNodeVersion: 16.16.0
```

此设置仅在工作区根目录中的 `pnpm-workspace.yaml` 文件中有效。 如果你需要为工作区中的项目指定自定义 Node.js，请改用 `package.json` 的 [`executionEnv.nodeVersion`] 字段。

[`executionEnv.nodeVersion`]: #executionenvnodeversion

### nodeVersion

- 默认值：**node -v** 的返回值，不带 v 前缀
- 类型：**精确的 semver 版本（不是范围）**

检查程序包的 `engines` 设置时使用的 Node.js 版本

如果你想阻止项目的贡献者添加新的不兼容的依赖项，请在项目根目录的 `.npmrc` 文件中使用 `nodeVersion` 和 `engineStrict`：

```ini
nodeVersion: 12.22.0
engineStrict: true
```

这样，即使有人使用 Node.js v16，他们也无法安装不支持 Node.js v12.22.0 的新依赖项。

### node-mirror

- 默认值： **`https://nodejs.org/download/<releaseDir>/
  `**
- 类型：**URL**

设置用于下载 Node.js 的基本 URL。 此设置的 `<releaseDir>` 部分可以是来自 [https://nodejs.org/download] 的任何目录：`release`、`rc`、`nightly`、`v8-canary` 等。

以下是如何配置 pnpm 从中国的 Node.js 镜像下载 Node.js：

```
node-mirror:release=https://npmmirror.com/mirrors/node/
node-mirror:rc=https://npmmirror.com/mirrors/node-rc/
node-mirror:nightly=https://npmmirror.com/mirrors/node-nightly/
```

[https://nodejs.org/download]: https://nodejs.org/download

### executionEnv.nodeVersion

指定应用于项目运行时的确切 Node.js 版本。
pnpm 将自动安装指定版本的 Node.js 并将其用于执行 `pnpm run` 命令或 `pnpm node` 命令。

示例：

```json
executionEnv:
  nodeVersion: 16.16.0
```

## 其它设置

### savePrefix

- 默认值：**'^'**
- 类型：**'^'**、**'~'**、**''**

配置软件包在 `package.json` 文件中的版本前缀。

例如，如果一个包的版本为 `1.2.3`，默认情况下它的版本设置为 `^1.2.3` 允许对该包进行小版本升级，但在 `pnpm config set save-prefix='~'` 之后，它将设置为 `~1.2.3` 仅允许补丁版本升级。

当添加的包具有指定的范围时，将忽略此设置。 例如，`pnpm add foo@2` 将会把 `package.json` 中的 `foo` 设置为 `2`，而忽略 `save-prefix` 的值。

### tag

- 默认值：**latest**
- 类型：**字符串**

如果你执行 `pnpm add` 添加了一个包并且没有提供特定版本，那么它安装设置中这个标记下的版本。

如果没有给出明确的标签，这还会设置添加到由
`pnpm tag` 命令指定的 `package@version` 的标签。

### globalDir

- 默认值：
  - 如果设置了 **$XDG_DATA_HOME** 环境变量，则为 **$XDG_DATA_HOME/pnpm/global**
  - 在 Windows 上：**~/AppData/Local/pnpm/global**
  - 在 macOS 上：**~/Library/pnpm/global**
  - 在 Linux 上：**~/.local/share/pnpm/global**
- 类型：**路径**

指定储存全局依赖的目录。

### globalBinDir

- 默认值：
  - 如果设置了 **$XDG_DATA_HOME** 环境变量，则为 **$XDG_DATA_HOME/pnpm**
  - 在 Windows 上：**~/AppData/Local/pnpm**
  - 在 macOS 上：**~/Library/pnpm**
  - 在 Linux 上：**~/.local/share/pnpm**
- 类型：**路径**

允许设置全局安装包的 bin 文件的目标目录。

### stateDir

- 默认值：
  - 如果设置了 **$XDG_STATE_HOME** 环境变量，则为 **$XDG_STATE_HOME/pnpm**
  - 在 Windows 上：**~/AppData/Local/pnpm-state**
  - 在 macOS 上：**~/.pnpm-state**
  - 在 Linux 上：**~/.local/share/pnpm**
- 类型：**路径**

pnpm 创建的当前仅由更新检查器使用的 `pnpm-state.json` 文件的目录。

### cacheDir

- 默认值：
  - 如果设置了 **$XDG_CACHE_HOME** 环境变量，则为 **$XDG_CACHE_HOME/pnpm**
  - 在 Windows 上：**~/AppData/Local/pnpm-cache**
  - 在 macOS 上：**~/Library/Caches/pnpm**
  - 在 Linux 上：**~/.cache/pnpm**
- 类型：**路径**

缓存的位置（软件包元数据和 dlx）。

### useStderr

- 默认值： **false**
- 类型：**Boolean**

当为 true 时，所有输出都写入 stderr。

### updateNotifier

- 默认值：**true**
- 类型：**Boolean**

设置为 `false` 以便在使用较旧版本的 pnpm 时关闭更新通知。

### preferSymlinkedExecutables

- 默认值：当 **node-linker** 设置为 **hoisted** 且系统为 POSIX 时为 **true**
- 类型：**Boolean**

创建指向 `node_modules/.bin` 中可执行文件的符号链接，而不是命令 shims。 在 Windows 上，此设置将被忽略，因为只有命令 shims 起作用。

### ignoreCompatibilityDb

- 默认值： **false**
- 类型：**Boolean**

在安装过程中，某些包的依赖关系会被自动打补丁。 如果你想禁用此功能，请将此配置设置为 `true`。

这些补丁是从 Yarn 的 `@yarnpkg/extensions` 包应用的。

### resolutionMode

- 默认值: **highest** (从 v8.0.0 到 v8.6.12 是 **lowest-direct**)
- 类型：**highest**、**time-based**、**lowest-direct**

当 `resolutionMode` 设置为 `time-based`，依赖关系将按以下方式解析：

1. 直接依赖项将解析为最低版本。 因此，如果依赖项中有 `foo@^1.1.0` ，则将安装 `1.1.0`。
2. 子依赖项将被解析的版本，是解析到最后一个直接依赖项发布的版本。

使用此解析模式的安装，具有热高速缓存的速度更快。 它还减少了子依赖项劫持的机会，因为只有更新直接依赖项，子依赖项才会更新。

此解析模式仅适用于 npm 的 [完整元数据][full metadata]。 因此，在某些场景中，速度较慢。 但是，如果你使用 [Verdaccio] v5.15.1 或更高版本，则可以将 `registrySupportsTimeField` 设置为 `true`，速度会非常快。

当 `resolutionMode` 设置为 `lowest-direct` 时，直接依赖项将解析为其最低版本。

### registrySupportsTimeField

- 默认值： **false**
- 类型：**Boolean**

如果你使用的注册表在缩略元数据中返回了 "time" 字段，请将此设置为 `true`。 目前，只有 v5.15.1 版本以上的 [Verdaccio] 支持这一功能。

### extendNodePath

- 默认值：**true**
- 类型：**Boolean**

当 `false` 时，命令 shims 中不会设置 `NODE_PATH` 环境变量。

[`@yarnpkg/extensions`]: https://github.com/yarnpkg/berry/blob/master/packages/yarnpkg-extensions/sources/index.ts
[full metadata]: https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md#full-metadata-format
[Verdaccio]: https://verdaccio.org/

### deployAllFiles

- 默认值： **false**
- 类型：**Boolean**

在部署包或安装本地包时，包的所有文件都会被复制。 默认情况下，如果软件包在 `package.json` 中有一个 `"files"` 字段，那么只会复制列出的文件和目录。

### dedupeDirectDeps

- 默认值： **false**
- 类型：**Boolean**

当设置为 `true` 时，已符号链接到工作区根 `node_modules` 目录的依赖项将不会符号链接到子项目 `node_modules` 目录。

### optimisticRepeatInstall

添加于：v10.1.0

- 默认值： **false**
- 类型：**Boolean**

启用后，将在继续安装之前进行快速检查。 这样，重复安装或在项目上安装所有内容都是最新的就会变得更快。

### requiredScripts

工作区的每个项目，都必须含有此数组中的所有脚本。 否则， `pnpm -r run <script name>` 将失败。

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

添加于：v10.12.1

- 默认值：**true**（当环境被检测为 CI 时）
- 类型：**Boolean**

此设置明确告诉 pnpm 当前环境是否为 CI（持续集成）环境。

import CleanupUnusedCatalogs from './settings/_cleanupUnusedCatalogs.mdx'

<CleanupUnusedCatalogs />
