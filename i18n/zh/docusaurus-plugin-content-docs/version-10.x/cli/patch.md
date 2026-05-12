---
id: patch
title: "pnpm patch <pkg>"
---

给软件包添加补丁（灵感来自于 Yarn 中一个类似的命令）。

该命令会将指定的软件包提取到一个可以随意编辑的临时目录中。

完成修改后, 运行 `pnpm patch-commit <path>` (`<path>` 是之前提取的临时目录) 以生成一个补丁文件，并提供 [`patchedDependencies`] 字段注册到你项目中的顶层清单文件。

使用方法：

```
pnpm patch <pkg name>@<version>
```

[`patchedDependencies`]: #patcheddependencies

:::note

如果你想更改包的依赖项，请不要使用修补来修改包的 `package.json` 文件。 要覆盖依赖项，请使用 [overrides] 或 [软件包钩子][package hook]。

:::

[overrides]: ../settings.md#overrides
[package hook]: ../pnpmfile#hooksreadpackagepkg-context-pkg--promisepkg

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/0GjLqRGRbcY" title="The pnpm patch command demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"></iframe>

## 配置项

### --edit-dir &lt;dir>

需要修补的软件包将被解压到此目录。

### --ignore-existing

修补时忽略现有的修补文件。

## 配置

### patchedDependencies

此字段会在你运行 [pnpm patch-commit] 时自动添加/更新。 它使用字典定义依赖的补丁：

[pnpm patch-commit]: ./patch-commit.md

- **键**：具有精确版本、版本范围或仅仅是名称的包名称。
- **值**：补丁文件的相对路径。

示例：

```yaml
patchedDependencies:
  express@4.18.1: patches/express@4.18.1.patch
```

依赖项可以按版本范围进行修补。 优先顺序为：

1. 精确版本（最高优先级）
2. 版本范围
3. 只有名称的补丁(应用于所有版本，除非覆盖)

特殊情况：版本范围 `*` 的行为类似于仅有名称的补丁，但不会忽略补丁失败。

示例：

```yaml
patchedDependencies:
  foo: patches/foo-1.patch
  foo@^2.0.0: patches/foo-2.patch
  foo@2.1.0: patches/foo-3.patch
```

- `patches/foo-3.patch` 应用于 `foo@2.1.0`。
- `patches/foo-2.patch` 适用于所有与 `^2.0.0` 匹配的 foo 版本，除了 `2.1.0`。
- `patches/foo-1.patch` 适用于所有其他 foo 版本。

避免版本范围重叠。 如果需要专用化某个子范围，请将其从更广泛的范围中明确排除。

示例：

```yaml
patchedDependencies:
  # 特殊子范围
  "foo@2.2.0-2.8.0": patches/foo.2.2.0-2.8.0.patch
  # 通用补丁，不包括上述子范围
  "foo@>=2.0.0 <2.2.0 || >2.8.0": patches/foo.gte2.patch
```

在大多数情况下，定义一个精确的版本就足以覆盖更广泛的范围。

### allowUnusedPatches

添加于: v10.7.0 (原命名为 `allowNonAppliedPatches`)

- 默认值： **false**
- 类型：**Boolean**

当设置为 `true` 时，如果 `patchedDependencies` 字段中的某些补丁未被应用，安装不会失败。

```json
patchedDependencies:
  express@4.18.1: patches/express@4.18.1.patch
allowUnusedPatches: true
```

### ignorePatchFailures

添加于: v10.7.0

- 默认值：**undefined**
- 类型：**Boolean**，**undefined**

控制如何处理补丁失败。

行为：

- **undefined（默认）**：
  - 当具有精确版本或版本范围的补丁失败时会出现错误。
  - 忽略仅有名称的补丁的失败。
- **false**：任何补丁失败都会出错。
- **true**：当任何补丁无法应用时，打印警告而不是失败。
