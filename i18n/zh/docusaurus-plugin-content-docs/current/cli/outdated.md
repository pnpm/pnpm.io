---
id: outdated
title: pnpm outdated
---

检查过期的包。 通过提供参数（也支持模式），可以将检查限制在已安装包的子集中。

示例：
```sh
pnpm outdated
pnpm outdated "*gulp-*" @babel/core
```

## 配置项

### --recursive, -r

在子目录发现的所有包中，或者在一个工作空间执行时在所有工作空间包中检查过期依赖。

### --filter &lt;package_selector\>

[阅读更多有关过滤的内容。](../filtering.md)

### --global, -g

列出过时的全局包。

### --long

打印详细信息。

### --format &lt;format\>

* 默认值：**table**
* 类型: **table**, **list**, **json**

以给定格式打印已经过期的依赖项。

### --compatible

仅打印满足 `package.json` 规范的版本。

### --dev, -D

仅检查 `devDependencies`。

### --prod, -P

仅检查 `dependencies` 和 ` optionalDependencies`。

### --no-optional

不去检查 `optionalDependencies`。

### --sort-by

指定输出结果的排序顺序。 目前只接受值 `name`。
