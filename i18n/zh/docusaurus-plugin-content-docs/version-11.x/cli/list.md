---
id: list
title: pnpm list
---

别名：`ls`

此命令将以树结构的形式输出已安装的所有软件包的版本以及及其依赖项。

如果位置参数是 `name-pattern@version-range` 标识符，会将输出限制为仅为这样命名的包。 例如，`pnpm list "babel-*" "eslint-*" semver@5`。

## 配置项

### --recursive, -r

在工作空间内执行时，在子目录中的每个包或每个工作空间包中执行命令。

### --json

JSON 格式的日志输出。

### --long

显示扩展信息。

### --lockfile-only

添加于：v10.23.0

从锁文件读取软件包信息，而不是检查实际的 `node_modules` 目录。 这有助于快速检查需要安装的内容，而无需进行完整的安装。

### --parseable

以可解析的格式而不是树状视图输出包目录。

### --global, -g

列出全局安装目录中的包而不是当前项目中的包。

### --depth &lt;number\>

依赖项的树的最大显示深度。

`pnpm ls --depth 0`（默认）将仅列出直接依赖项。
`pnpm ls --depth -1` 将仅列出项目。 在工作空间中和 `-r` 选项一起使用时会很有用。
`pnpm ls --depth Infinity` 将列出所有依赖项，无论深度如何。

### --prod, -P

仅显示在 `dependencies` 和 `optionalDependencies` 中的软件包的依赖关系图。

### --dev, -D

只显示 `devDependencies` 中的软件包依赖关系图。

### --no-optional

显示除 `optionalDependencies` 之外的包的依赖关系图。

### --only-projects

仅显示同时也在工作区内的依赖项。

### --exclude-peers

从结果中排除对等依赖关系（但不忽略对等依赖关系的依赖关系）。

### --filter &lt;package_selector\>

[阅读更多有关过滤的内容。](../filtering.md)

import FindBy from '../settings/_findBy.mdx'

<FindBy />
