---
id: why
title: pnpm why
---

显示依赖于指定包的所有包。

输出结果是一个反向依赖关系树：搜索到的软件包出现在根节点，其依赖项作为分支，一直延伸到工作区根节点。

输出结果中会去除重复的子树，并显示为“去重后”。

## 配置项

### --recursive, -r

显示子目录下每个包中指定包的依赖关系树，或在工作空间内执行时显示每个工作空间包中指定包的依赖关系树。

### --json

以 JSON 格式显示信息。

### --long

输出详细信息。

### --parseable

显示可解析的输出而不是树形视图。

### --global, -g

列出全局安装目录中的包而不是当前项目中的包。

### --prod, -P

仅显示在 `dependencies` 中的包依赖关系树。

### --dev, -D

仅显示在 `devDependencies` 中的包依赖关系树。

### --depth &lt;number\>

仅显示特定深度内的依赖关系。

### --only-projects

仅显示同时也在工作空间内的依赖项。

### --exclude-peers

从结果中排除对等依赖关系（但不忽略对等依赖关系的依赖关系）。

### --filter &lt;package_selector\>

[阅读更多有关过滤的内容。](../filtering.md)

import FindBy from '../settings/_findBy.mdx'

<FindBy />
