---
id: workspaces
title: 工作空间（Workspace）
---

pnpm 内置了对单一存储库（也称为多包存储库、多项目存储库或单体存储库）的支持。 你可以创建一个工作空间以将多个项目合并到一个仓库中。

一个工作空间必须在它的根目录有一个 [`pnpm-workspace.yaml`] 文件。

[`pnpm-workspace.yaml`]: pnpm-workspace_yaml.md

:::tip

如果你正在查看 monorepo 管理，那么你可能还希望查看 [Bit]。
Bit 在后台使用 pnpm，但将许多当前在由 pnpm/npm/Yarn 管理的传统工作区中手动完成的事情自动化。 有一篇关于 `bit install` 的文章讨论了这一点：[使用 Bit 进行无痛的 Monorepo 依赖管理][Painless Monorepo Dependency Management with Bit]。

:::

[Bit]: https://bit.dev/?utm_source=pnpm&utm_medium=workspace_page
[Painless Monorepo Dependency Management with Bit]: https://bit.dev/blog/painless-monorepo-dependency-management-with-bit-l4f9fzyw?utm_source=pnpm&utm_medium=workspace_page

## 工作空间协议 (workspace:)

如果 \[link-workspace-packages] 设置为 `true`，则 pnpm 将在可用包与声明的范围匹配时链接工作区中的包。 例如，如果 `bar` 在其依赖项中具有 `"foo": "^1.0.0"` 并且 `foo@1.0.0` 在工作区中，则 `foo@1.0.0` 会链接到 `bar`。 但是，如果 `bar` 的依赖项中有 `"foo": "2.0.0"`，而工作区中没有 `foo@2.0.0`，则会从源中安装 `foo@2.0.0`。 这种行为带来了一些不确定性。

幸运的是， pnpm 支持 `workspace:` 协议。 当使用此协议时，pnpm 将拒绝解析除本地工作空间所包含包之外的任何内容。 因此，如果设置 `"foo": "workspace:2.0.0"`，那么此时
安装将失败，因为工作空间中不存在 `"foo@2.0.0"`。

当 \[link-workspace-packages] 选项被设置为 `false` 时，这个协议特别有用。 在这种情况下，如果使用 `workspace:` 协议，pnpm 将仅链接来自工作区的包。

[linkWorkspacePackages]: #linkworkspacepackages

### 通过别名引用工作空间包

假设你在 workspace 中有一个名为 `foo` 的包， 通常，你会将其引用为 `"foo"："workspace:*"`。

如果你想使用不同的别名，以下语法也将起作用：
`"bar": "workspace:foo@*"`。

在发布之前，别名被转换为常规名称。 上述示例将变成：`"bar": "npm:foo@1.0.0"`。

### 通过相对路径引用工作空间包

假如工作空间中有 2 个包：

```
+ packages
	+ foo
	+ bar
```

`bar` 的依赖项中可能有 `foo`，声明为
`"foo": "workspace:../foo"`。 在发布之前，这些将转换为所有包管理器支持的常规版本规范。

### 发布工作空间包

当一个工作空间包被打包为归档 ( 无论是通过
`pnpm pack` 还是一个发布命令如 `pnpm publish`) 时，我们动态地
替换任何 "workspace:\` 依赖为：

- 目标工作区中的对应版本（如果你使用 `workspace:`、`workspace:*`、`workspace:~` 或 `workspace:^`）
- 相关的语义化版本范围（对于任何其他范围类型）

没有版本范围的裸 `workspace:` 将被视为 `workspace:*`。

如此例，如果我们在工作空间中有 `foo`， `bar`， `qar`， `zoo ' ，它们都是版本`1.5.0\`，如下所示 :

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

将会被转化为：

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

这个功能允许你发布转化之后的包到远端，并且可以正常使用本地工作空间的包，而不需要其它中间步骤。包的使用者也可以像常规的包那样正常使用，且仍然可以受益于语义化版本。

## 发布工作流

workspace 中的包版本管理是一个复杂的任务，pnpm 目前也并未提供内置的解决方案。 不过，有两个不错且支持 pnpm 的版本控制工具可以使用：

- [changesets](https://github.com/changesets/changesets)
- [Rush](https://rushjs.io)

有关如何使用 Rush 设置存储库，请阅读 [此页面][rush-setup]。

要使用 pnpm 的变更集，请阅读[本指南][changesets-guide]。

[rush-setup]: https://rushjs.io/pages/maintainer/setup_new_repo
[changesets-guide]: using-changesets.md

## 问题排查

如果工作空间依赖项之间存在循环，则 pnpm 无法保证脚本将按拓扑顺序运行。 如果 pnpm 在安装过程中检测到循环依赖，则会提供一个 warning 警告。 如果 pnpm 能够找出导致循环的依赖项，也会将其展示出来。

如果你看到此消息 `There are cyclic workspace dependencies` ，请检查在 `dependencies`, `optionalDependencies` 和 `devDependencies` 中声明的工作空间依赖。

## 使用示例

以下是几个使用了 pnpm 工作空间功能的最受欢迎的开源项目：

| 项目                                                                        | 星星数                                                                              | 迁移日期       | 迁移提交                                                                                                                                                     |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Next.js](https://github.com/vercel/next.js)              | ![](https://img.shields.io/github/stars/vercel/next.js)                          | 2022-05-29 | [`f7b81316aea4fc9962e5e54981a6d559004231aa`](https://github.com/vercel/next.js/commit/f7b81316aea4fc9962e5e54981a6d559004231aa)                          |
| [n8n](https://github.com/n8n-io/n8n)                                      | ![](https://img.shields.io/github/stars/n8n-io/n8n)                              | 2022-11-09 | [`736777385c54d5b20174c9c1fda38bb31fbf14b4`](https://github.com/n8n-io/n8n/commit/736777385c54d5b20174c9c1fda38bb31fbf14b4)                              |
| [Material UI](https://github.com/mui/material-ui)                         | ![](https://img.shields.io/github/stars/mui/material-ui)                         | 2024-01-03 | [`a1263e3e5ef8d840252b4857f85b33caa99f471d`](https://github.com/mui/material-ui/commit/a1263e3e5ef8d840252b4857f85b33caa99f471d)                         |
| [Vite](https://github.com/vitejs/vite)                                    | ![](https://img.shields.io/github/stars/vitejs/vite)                             | 2021-09-26 | [`3e1cce01d01493d33e50966d0d0fd39a86d229f9`](https://github.com/vitejs/vite/commit/3e1cce01d01493d33e50966d0d0fd39a86d229f9)                             |
| [Nuxt](https://github.com/nuxt/nuxt)                                      | ![](https://img.shields.io/github/stars/nuxt/nuxt)                               | 2022-10-17 | [`74a90c566c936164018c086030c7de65b26a5cb6`](https://github.com/nuxt/nuxt/commit/74a90c566c936164018c086030c7de65b26a5cb6)                               |
| [Vue](https://github.com/vuejs/core)                                      | ![](https://img.shields.io/github/stars/vuejs/core)                              | 2021-10-09 | [`61c5fbd3e35152f5f32e95bf04d3ee083414cecb`](https://github.com/vuejs/core/commit/61c5fbd3e35152f5f32e95bf04d3ee083414cecb)                              |
| [Astro](https://github.com/withastro/astro)                               | ![](https://img.shields.io/github/stars/withastro/astro)                         | 2022-03-08 | [`240d88aefe66c7d73b9c713c5da42ae789c011ce`](https://github.com/withastro/astro/commit/240d88aefe66c7d73b9c713c5da42ae789c011ce)                         |
| [Prisma](https://github.com/prisma/prisma)                                | ![](https://img.shields.io/github/stars/prisma/prisma)                           | 2021-09-21 | [`c4c83e788aa16d61bae7a6d00adc8a58b3789a06`](https://github.com/prisma/prisma/commit/c4c83e788aa16d61bae7a6d00adc8a58b3789a06)                           |
| [Novu](https://github.com/novuhq/novu)                                    | ![](https://img.shields.io/github/stars/novuhq/novu)                             | 2021-12-23 | [`f2ea61f7d7ac7e12db4c9e70767082841ed98b2b`](https://github.com/novuhq/novu/commit/f2ea61f7d7ac7e12db4c9e70767082841ed98b2b)                             |
| [Slidev](https://github.com/slidevjs/slidev)                              | ![](https://img.shields.io/github/stars/slidevjs/slidev)                         | 2021-04-12 | [`d6783323eb1ab1fc612577eb63579c8f7bc99c3a`](https://github.com/slidevjs/slidev/commit/d6783323eb1ab1fc612577eb63579c8f7bc99c3a)                         |
| [Turborepo](https://github.com/vercel/turborepo)                          | ![](https://img.shields.io/github/stars/vercel/turborepo)                        | 2022-03-02 | [`fd171519ec02a69c9afafc1bc5d9d1b481fba721`](https://github.com/vercel/turborepo/commit/fd171519ec02a69c9afafc1bc5d9d1b481fba721)                        |
| [Quasar Framework](https://github.com/quasarframework/quasar)             | ![](https://img.shields.io/github/stars/quasarframework/quasar)                  | 2024-03-13 | [`7f8e550bb7b6ab639ce423d02008e7f5e61cbf55`](https://github.com/quasarframework/quasar/commit/7f8e550bb7b6ab639ce423d02008e7f5e61cbf55)                  |
| [Element Plus](https://github.com/element-plus/element-plus)              | ![](https://img.shields.io/github/stars/element-plus/element-plus)               | 2021-09-23 | [`f9e192535ff74d1443f1d9e0c5394fad10428629`](https://github.com/element-plus/element-plus/commit/f9e192535ff74d1443f1d9e0c5394fad10428629)               |
| [NextAuth.js](https://github.com/nextauthjs/next-auth)    | ![](https://img.shields.io/github/stars/nextauthjs/next-auth)                    | 2022-05-03 | [`4f29d39521451e859dbdb83179756b372e3dd7aa`](https://github.com/nextauthjs/next-auth/commit/4f29d39521451e859dbdb83179756b372e3dd7aa)                    |
| [Ember.js](https://github.com/emberjs/ember.js)           | ![](https://img.shields.io/github/stars/emberjs/ember.js)                        | 2023-10-18 | [`b6b05da662497183434136fb0148e1dec544db04`](https://github.com/emberjs/ember.js/commit/b6b05da662497183434136fb0148e1dec544db04)                        |
| [Qwik](https://github.com/BuilderIO/qwik)                                 | ![](https://img.shields.io/github/stars/BuilderIO/qwik)                          | 2022-11-14 | [`021b12f58cca657e0a008119bc711405513e1ee9`](https://github.com/BuilderIO/qwik/commit/021b12f58cca657e0a008119bc711405513e1ee9)                          |
| [VueUse](https://github.com/vueuse/vueuse)                                | ![](https://img.shields.io/github/stars/vueuse/vueuse)                           | 2021-09-25 | [`826351ba1d9c514e34426c85f3d69fb9875c7dd9`](https://github.com/vueuse/vueuse/commit/826351ba1d9c514e34426c85f3d69fb9875c7dd9)                           |
| [SvelteKit](https://github.com/sveltejs/kit)                              | ![](https://img.shields.io/github/stars/sveltejs/kit)                            | 2021-09-26 | [`b164420ab26fa04fd0fbe0ac05431f36a89ef193`](https://github.com/sveltejs/kit/commit/b164420ab26fa04fd0fbe0ac05431f36a89ef193)                            |
| [Verdaccio](https://github.com/verdaccio/verdaccio)                       | ![](https://img.shields.io/github/stars/verdaccio/verdaccio)                     | 2021-09-21 | [`9dbf73e955fcb70b0a623c5ab89649b95146c744`](https://github.com/verdaccio/verdaccio/commit/9dbf73e955fcb70b0a623c5ab89649b95146c744)                     |
| [Vercel](https://github.com/vercel/vercel)                                | ![](https://img.shields.io/github/stars/vercel/vercel)                           | 2023-01-12 | [`9c768b98b71cfc72e8638bf5172be88c39e8fa69`](https://github.com/vercel/vercel/commit/9c768b98b71cfc72e8638bf5172be88c39e8fa69)                           |
| [Vitest](https://github.com/vitest-dev/vitest)                            | ![](https://img.shields.io/github/stars/vitest-dev/vitest)                       | 2021-12-13 | [`d6ff0ccb819716713f5eab5c046861f4d8e4f988`](https://github.com/vitest-dev/vitest/commit/d6ff0ccb819716713f5eab5c046861f4d8e4f988)                       |
| [Cycle.js](https://github.com/cyclejs/cyclejs)            | ![](https://img.shields.io/github/stars/cyclejs/cyclejs)                         | 2021-09-21 | [`f2187ab6688368edb904b649bd371a658f6a8637`](https://github.com/cyclejs/cyclejs/commit/f2187ab6688368edb904b649bd371a658f6a8637)                         |
| [Milkdown](https://github.com/Saul-Mirone/milkdown)                       | ![](https://img.shields.io/github/stars/Saul-Mirone/milkdown)                    | 2021-09-26 | [`4b2e1dd6125bc2198fd1b851c4f00eda70e9b913`](https://github.com/Saul-Mirone/milkdown/commit/4b2e1dd6125bc2198fd1b851c4f00eda70e9b913)                    |
| [Nhost](https://github.com/nhost/nhost)                                   | ![](https://img.shields.io/github/stars/nhost/nhost)                             | 2022-02-07 | [`10a1799a1fef2f558f737de3bb6cadda2b50e58f`](https://github.com/nhost/nhost/commit/10a1799a1fef2f558f737de3bb6cadda2b50e58f)                             |
| [Logto](https://github.com/logto-io/logto)                                | ![](https://img.shields.io/github/stars/logto-io/logto)                          | 2021-07-29 | [`0b002e07850c8e6d09b35d22fab56d3e99d77043`](https://github.com/logto-io/logto/commit/0b002e07850c8e6d09b35d22fab56d3e99d77043)                          |
| [Rollup 插件](https://github.com/rollup/plugins)                            | ![](https://img.shields.io/github/stars/rollup/plugins)                          | 2021-09-21 | [`53fb18c0c2852598200c547a0b1d745d15b5b487`](https://github.com/rollup/plugins/commit/53fb18c0c2852598200c547a0b1d745d15b5b487)                          |
| [icestark](https://github.com/ice-lab/icestark)                           | ![](https://img.shields.io/github/stars/ice-lab/icestark)                        | 2021-12-16 | [`4862326a8de53d02f617e7b1986774fd7540fccd`](https://github.com/ice-lab/icestark/commit/4862326a8de53d02f617e7b1986774fd7540fccd)                        |
| [ByteMD](https://github.com/bytedance/bytemd)                             | ![](https://img.shields.io/github/stars/bytedance/bytemd)                        | 2021-02-18 | [`36ef25f1ea1cd0b08752df5f8c832302017bb7fb`](https://github.com/bytedance/bytemd/commit/36ef25f1ea1cd0b08752df5f8c832302017bb7fb)                        |
| [Stimulus 组件](https://github.com/stimulus-components/stimulus-components) | ![](https://img.shields.io/github/stars/stimulus-components/stimulus-components) | 2024-10-26 | [`8e100d5b2c02ad5bf0b965822880a60f543f5ec3`](https://github.com/stimulus-components/stimulus-components/commit/8e100d5b2c02ad5bf0b965822880a60f543f5ec3) |
| [Serenity/JS](https://github.com/serenity-js/serenity-js)                 | ![](https://img.shields.io/github/stars/serenity-js/serenity-js)                 | 2025-01-01 | [`43dbe6f440d8dd81811da303e542381a17d06b4d`](https://github.com/serenity-js/serenity-js/commit/43dbe6f440d8dd81811da303e542381a17d06b4d)                 |
| [kysely](https://github.com/kysely-org/kysely)                            | ![](https://img.shields.io/github/stars/kysely-org/kysely)                       | 2025-07-29 | [`5ac19105ddb17af310c67e004c11fa3345454b66`](https://github.com/kysely-org/kysely/commit/5ac19105ddb17af310c67e004c11fa3345454b66)                       |

## 配置

### linkWorkspacePackages

- 默认值： **false**
- 类型：**true**、**false**、**deep**

启用该选项后，本地可用的软件包将被链接到 `node_modules` 中而不是从注册源下载。 这在 monorepo 中非常方便。 如果你需要本地包也链接到子依赖项，可以使用 `deep` 设置。

否则，软件包将全部从注册源下载并安装。 然而，工作空间包仍然可以通过使用 `workspace:` 范围协议进行链接。

仅当软件包的版本满足依赖范围时，才会链接。

### injectWorkspacePackages

- 默认值： **false**
- 类型：**Boolean**

启用所有本地工作区依赖项的硬链接，而不是符号链接它们。 或者，可以使用 [`dependencyMeta[].injected`](package_json.md#dependenciesmetainjected) 来实现，这允许有选择地为特定依赖项启用硬链接。

:::note

即使启用此设置，pnpm 也会倾向于使用符号链接对注入的依赖项进行重复数据删除 - 除非由于对等依赖项不匹配而需要多个依赖图。 此行为由 `dedepeInjectedDeps` 设置控制。

:::

### dedupeInjectedDeps

- 默认值：**true**
- 类型：**Boolean**

启用此设置后， [注入的依赖项](package_json.md#dependenciesmetainjected) 将尽可能从工作区进行符号链接。 如果依赖项和注入的依赖项引用相同的对等依赖项，则无需将注入的依赖项物理复制到依赖项的 `node_modules` 中，符号链接就足够了。

### syncInjectedDepsAfterScripts

添加于：v10.5.0

- 默认值：**undefined**
- 类型：**String[]**

注入的工作区依赖项是硬链接的集合，当文件的源发生变化时，它们不会添加或删除文件。 这会导致需要构建的包出现问题（例如在 TypeScript 项目中）。

此设置是脚本名称的列表。 当这些脚本中的任何一个在工作区包中执行时，内部注入的依赖项 `node_modules` 也将同步。

### preferWorkspacePackages

- 默认值： **false**
- 类型：**Boolean**

如果启用了此选项，工作空间中的本地 <code>package </code>将优先于注册表，即使注册表中有了该 <code>package </code> 的新版本。

仅当工作区不使用 `saveWorkspaceProtocol` 时，此设置才有用。

### sharedWorkspaceLockfile

- 默认值：**true**
- 类型：**Boolean**

如果启用此选项，pnpm 会在工作空间的根目录中创建一个唯一的 `pnpm-lock.yaml` 文件。 这也意味着工作区包的所有依赖项将
位于单个“node_modules”中（并符号链接到它们的包“node_modules”
文件夹以进行 Node 的模块解析）。

此选项的好处：

- 每个依赖都是一个单例
- 在 monorepo 中的安装更快
- 代码更改都在一个文件中、代码审查减少

:::note

尽管所有依赖项都将硬链接到根 `node_modules` 中，但软件包只能访问 `package.json` 中声明的
，因此 pnpm 的严格性得以保留。
这是上述软链接的效果。

:::

### saveWorkspaceProtocol

- 默认值：**rolling**
- 类型：**true**、**false**、**rolling**

这个设置控制从工作空间中链接的 dependencies 如何添加至 `package.json`。

如果 `foo@1.0.0` 在工作空间中，在工作空间的另一个项目中运行 `pnpm add foo`，则 `foo` 会被按如下方式添加到依赖项字段。 `savePrefix` 设置也会影响规范的创建方式。

| saveWorkspaceProtocol | savePrefix | spec               |
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

- 默认值： **false**
- 类型：**Boolean**

在工作区中递归执行命令时，也在根工作区项目上执行它们。

### ignoreWorkspaceCycles

- 默认值： **false**
- 类型：**Boolean**

当设置为 `true` 时，不会打印工作区循环警告。

### disallowWorkspaceCycles

- 默认值： **false**
- 类型：**Boolean**

当设置为 `true` 时，如果工作区存在循环，安装将失败。

### failIfNoMatch

- 默认值： **false**
- 类型：**Boolean**

当设置为 `true` 时，如果没有包与提供的过滤器匹配，CLI 将用非零代码退出。

例如，以下命令将以非零代码退出，因为工作区中不存在 `bad-pkg-name`：

```sh
pnpm --filter=bad-pkg-name test
```
