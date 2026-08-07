---
id: patch
title: "pnpm patch <pkg>"
---

给软件包添加补丁（灵感来自于 Yarn 中一个类似的命令）。

该命令会将指定的软件包提取到一个可以随意编辑的临时目录中。

一旦完成了你的修改，运行 `pnpm patch-commit <path>`（其中 `<path>` 是之前提取的临时目录）来生成一个补丁文件，并通过 [`patchedDependencies`][] 字段在项目的顶层清单文件进行注册。

使用方法：

```
pnpm patch <pkg name>@<version>
```

:::note

如果你想更改包的依赖项，请不要使用修补来修改包的 `package.json` 文件。 要覆盖依赖项，请使用 [overrides][] 或 [软件包钩子][]。

:::

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/0GjLqRGRbcY" title="pnpm patch 命令示例" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"></iframe>

## 配置项

### --edit-dir &lt;dir>

需要修补的软件包将被解压到此目录。

### --ignore-existing

修补时忽略现有的修补文件。

## 配置

### patchedDependencies

此字段会在你运行 [pnpm patch-commit][] 时自动添加/更新。 它使用字典定义依赖的补丁：

* **键**: 包含确切版本、版本范围或仅包含名称的软件包名称。
* **值**: 补丁文件的相对路径。

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

* `patches/foo-3.patch` 应用于 `foo@2.1.0`。
* `patches/foo-2.patch` 适用于所有匹配 `^2.0.0`的 foo 版本，但 `2.1.0` 除外。
* `patches/foo-1.patch` 适用于所有其他 foo 版本。

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

* 默认值：**false**
* 类型：**Boolean**

当设置为 `true`时，如果 `patchedDependencies` 字段中的某些补丁未被应用，安装不会失败。

```yaml
patchedDependencies:
  express@4.18.1: patches/express@4.18.1.patch
allowUnusedPatches: true
```

:::note

In v11, patch application failures always throw an error — the `ignorePatchFailures` setting has been removed. When multiple patches in a group are applied, a failure in one does not prevent the rest from being attempted; all patch errors are reported together at the end.

:::

[`patchedDependencies`]: #patcheddependencies

[overrides]: ../settings.md#overrides
[软件包钩子]: ../pnpmfile#hooksreadpackagepkg-context-pkg--promisepkg

[pnpm patch-commit]: ./patch-commit.md

