---
id: package_json
title: package.json
---

一个包的清单文件。 它包含包的所有元数据，包括依赖项、标题、作者等等。 这是所有主要的 Node.js 包管理工具，包括 pnpm 的保留标准。

除了传统的 `package.json` 格式之外，pnpm 还支持 `package.json5` （通过 [json5]）和 `package.yaml` （通过 [js-yaml]）。

[json5]: https://www.npmjs.com/package/json5
[js-yaml]: https://www.npmjs.com/package/@zkochan/js-yaml

:::note

Since v11, pnpm no longer reads settings from the `pnpm` field of `package.json`. Settings must be defined in `pnpm-workspace.yaml` instead. See [Configuring](./configuring.md).

:::

## engines

你可以指定你的软件能够运行的 Node 版本和 pnpm 版本：

```json
{
    "engines": {
        "node": ">=10",
        "pnpm": ">=3"
    }
}
```

在本地开发时， 如果其版本与 `engines` 字段中指定的版本不匹配，pnpm 将始终失败并报错。

除非用户设置了 engineStrict 配置标志（参见 设置），否则此
字段仅供参考，并且仅当您的包作为依赖项安装时才会产生警告。

[settings]: ./settings.md#enginestrict

## engines.runtime

添加于：v10.21.0

指定依赖项所需的 Node.js 运行时环境。 当声明时，pnpm 将自动安装指定的 Node.js 版本。

```json
{
  "engines": {
    "runtime": {
      "name": "node",
      "version": "^24.11.0",
      "onFail": "download"
    }
  }
}
```

当一个包声明运行时时：

1. **对于 CLI 应用程序**：pnpm 将 CLI 绑定到所需的 Node.js 版本，确保无论全局安装的 Node.js 实例如何，它都能使用正确的运行时。
2. 对于带有 `postinstall` 脚本的软件包：该脚本使用指定的 Node.js 版本执行。

这对于需要特定 Node.js 版本才能正常运行的依赖项尤其有用。

## devEngines.runtime

添加于：v10.14

允许指定项目使用的一个或多个 JavaScript 运行时引擎。 支持的运行时包括 Node.js、Deno 和 Bun。

例如，下面是如何将 `node@^24.4.0` 添加到你的依赖项中：

```json
{
  "devEngines": {
    "runtime": {
      "name": "node",
      "version": "^24.4.0",
      "onFail": "download"
    }
  }
}
```

你也可以将多个运行时添加到同一个 package.json：

```json
{
  "devEngines": {
    "runtime": [
      {
        "name": "node",
        "version": "^24.4.0",
        "onFail": "download"
      },
      {
        "name": "deno",
        "version": "^2.4.3",
        "onFail": "download"
      }
    ]
  }
}
```

工作原理：

1. `pnpm install` 将你指定的范围解析为最新的匹配运行时版本。
2. 精确的版本（和校验和）保存在锁文件（lockfile）中。
3. 脚本使用本地运行时，确保跨环境的一致性。

To override the declared `onFail` behavior without editing the manifest, use the [`runtimeOnFail`](./settings.md#runtimeonfail) setting.

## devEngines.packageManager

添加于：v11.0.0

Allows specifying the pnpm version via `devEngines.packageManager` in `package.json`. Unlike the `packageManager` field, this supports version ranges. The resolved version is stored in `pnpm-lock.yaml` under `packageManagerDependencies` and reused if it still satisfies the range.

```json
{
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": ">=11.0.0",
      "onFail": "download"
    }
  }
}
```

:::note

When pnpm is declared via the legacy `packageManager` field (not `devEngines.packageManager`), its resolution info is **not** written to `pnpm-lock.yaml` — unless the pinned pnpm version is v12 or newer. 当从 pnpm v10 升级到 v11 时，锁文件将保持稳定，而不会强行将项目从旧版字段中移除。

:::

To override the `onFail` behavior without editing the manifest, see the [`pmOnFail`](./settings.md#pmonfail) setting.

## dependenciesMeta

用于在 `dependencies`, `optionalDependencies` 和 `devDependencies` 中声明的依赖项的补充元信息。

### dependenciesMeta.\*.injected

如果将本地工作区包依赖项设置为 `true`，则将通过在虚拟存储中创建硬链接副本来安装该包（`node_modules/.pnpm`）。

如果将其设置为 `false` 或未设置，则将通过创建指向工作空间中包的源目录的 `node_modules` 符号链接来安装依赖项。  这是缺省值，因为它更快，并确保对依赖关系的任何修改都将立即对其使用者可视。

例如，假设以下 `package.json` 是一个本地工作区包：

```json
{
  "name": "card",
  "dependencies": {
    "button": "workspace:1.0.0"
  }
}
```

`button` 依赖项通常会通过在 `card` 的 `node_modules` 目录中创建符号链接来安装，该符号链接指向 `button` 的开发目录。

但是，如果 `button` 在其 `peerDependencies` 中指定 `react`，该怎么办？ 如果 monorepo 中的所有项目都使用相同版本的 `react`，那么就没有问题。 但如果 `card` 依赖的 `button` 使用 `react@16` 并且 `form` 使用 `react@17` 呢？ 通常你必须选择一个版本的 `react` 并使用 `button` 的 `devDependencies` 来指定它。 符号链接无法为 `react` 对等依赖提供一种方式，使不同的消费者（例如 `card` 和 `form`）能够以不同的方式满足它。

`injected` 字段通过在虚拟存储中安装 button 的硬链接副本解决了这个问题。 为了实现这一点， `card` 的 `package.json` 可以按如下方式配置：

```json
{
  "name": "card",
  "dependencies": {
    "button": "workspace:1.0.0",
    "react": "16"
  },
  "dependenciesMeta": {
    "button": {
      "injected": true
    }
  }
}
```

而 `form` 的 `package.json` 可以按如下方式配置：

```json
{
  "name": "form",
  "dependencies": {
    "button": "workspace:1.0.0",
    "react": "17"
  },
  "dependenciesMeta": {
    "button": {
      "injected": true
    }
  }
}
```

通过这些变化，我们说 `button` 是 `card` 和 `form` 的“注入依赖项”。  当 `button` 导入`react` 时，它将在 `card` 的上下文中解析为 `react@16`，但在 `form` 的上下文中解析为 `react@17`。

由于注入依赖关系会生成其工作空间源目录的副本，因此每当修改代码时，都必须更新这些副本; 否则，新状态将不会反映给使用者。 当使用命令（例如 `pnpm --recursive run build`）构建多个项目时，此更新必须在重建每个注入的包之后但重建其使用者之前进行。 对于简单的用例，可以通过再次调用 `pnpm install` 来完成，也许是使用 `package.json` 生命周期脚本（如 `"prepare": "pnpm run build"`）来重建该项目。  第三方工具，如 [pnpm-sync](https://www.npmjs.com/package/pnpm-sync-lib) 和 [pnpm-sync-dependencies-meta-injected](https://www.npmjs.com/package/pnpm-sync-dependencies-meta-injected) 为更新注入的依赖项以及监视模式支持提供了更为强大和高效的解决方案。

## peerDependenciesMeta

此字段列出了一些与 `peerDependencies` 字段中列出的依赖关系相关的额外信息。

### peerDependenciesMeta.\*.optional

如果设置为 true，所选的 peer dependency 将被包管理工具标记为可选的。 因此，消费方省略它将不再被报告为错误。

示例：

```json
{
    "peerDependencies": {
        "foo": "1"
    },
    "peerDependenciesMeta": {
        "foo": {
            "optional": true
        },
        "bar": {
            "optional": true
        }
    }
}
```

请注意，即使在 `peerDependencies` 中没有指定 `bar`，它也会被标记为可选的。 因此，pnpm 将假定任何版本的 bar 都是被允许的。
但是，`foo` 是可选的，但只能使用指定的版本。

## publishConfig

在包被打包之前，可以覆盖清单中的某些字段。
以下字段可以被覆盖：

- [`bin`](https://github.com/stereobooster/package.json#bin)
- [`main`](https://github.com/stereobooster/package.json#main)
- [`exports`](https://nodejs.org/api/esm.html#esm_package_exports)
- [`types` 或 `typings`](https://github.com/conditionnowerter/package.json#types)
- [`module`](https://github.com/stereobooster/package.json#module)
- [`browser`](https://github.com/stereobooster/package.json#browser)
- [`esnext`](https://github.com/stereobooster/package.json#esnext)
- [`es2015`](https://github.com/stereobooster/package.json#es2015)
- [`unpkg`](https://github.com/stereobooster/package.json#unpkg-1)
- [`umd:main`](https://github.com/stereobooster/package.json#microbundle)
- [`typesVersions`](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html#version-selection-with-typesversions)
- cpu
- os
- `engines` (添加于 v10.22.0)

要覆盖字段，请将该字段的发布版本添加到 `publishConfig`。

例如，以下 `package.json`：

```json
{
    "name": "foo",
    "version": "1.0.0",
    "main": "src/index.ts",
    "publishConfig": {
        "main": "lib/index.js",
        "typings": "lib/index.d.ts"
    }
}
```

将被发布为：

```json
{
    "name": "foo",
    "version": "1.0.0",
    "main": "lib/index.js",
    "typings": "lib/index.d.ts"
}
```

### publishConfig.executableFiles

默认情况下，出于可移植性的原因，除了 bin 字段中列出的文件之外，不会在生成的包存档中将任何文件标记为可执行文件。 `executableFiles` 字段允许您声明必须设置可执行标志 (+x) 的额外字段，即使它们不能通过 bin 字段直接访问。

```json
{
  "publishConfig": {
    "executableFiles": [
      "./dist/shim.js"
    ]
  }
}
```

### publishConfig.directory

你还可以使用 `publishConfig.directory` 字段来自定义相对于当前 `package.json` 的发布子目录。

预计在指定目录中有当前包的修改版本（通常使用第三方构建工具）。

> 在这个例子中 `"dist"` 文件夹必须包含一个 `package.json`

```json
{
  "name": "foo",
  "version": "1.0.0",
  "publishConfig": {
    "directory": "dist"
  }
}
```

### publishConfig.linkDirectory

- 默认值：**true**
- 类型：**Boolean**

当设置为 `true` 时，项目将在本地开发期间从 `publishConfig.directory` 位置进行符号链接。

示例：

```json
{
  "name": "foo",
  "version": "1.0.0",
  "publishConfig": {
    "directory": "dist",
    "linkDirectory": true
  }
}
```
