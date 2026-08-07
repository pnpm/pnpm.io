---
title: pnpm的node_modules配置选项
authors: zkochan
---

创建node_modules目录结构有多种方式。 你一定想要创建最严格的结构，当然如果你当前的项目尚无法支持，你可以配置为不严格的。

<!--truncate-->

## 默认配置

默认情况下，pnpm v5将创建一个“半严格”的node_modules。 “半严格”意味着您的应用程序将只能导入 `package.json` 中列出的依赖项(但也有例外)。 然而，你所依赖的那些包将能访问任何其他的包。

默认配置如下所示：

```ini
; 提升所有包到 node_modules/.pnpm/node_modules
hoist-pattern[]=*

; 提升所有名称包含types的包至根，以便Typescript能找到
public-hoist-pattern[]=*types*

; 提升所有ESLint相关的包至根
public-hoist-pattern[]=*eslint*
```

## Plug'n'Play. 最严格的配置

自v5.9起，pnpm支持 [Yarn的Plug'n'Play](https://yarnpkg.com/features/pnp)。 使用PnP，您的应用以及你所依赖的包都只能访问他们声明的依赖关系。 这比设置 `hoist = false` 更为严格，因为在monorepo中，您的应用甚至连根项目的依赖项也无法访问。

要使用 Plug'n'Play，请设置以下设置:

```ini
node-linker=pnp
symlink=false
```

## 严格的模块目录

如果您尚未准备好使用PnP，也可以通过将提升配置设置为false来仅允许程序包访问其自身的依赖项，确保其“严格”性：

```ini
hoist=false
```

但是，如果您的某些依赖项需要访问它们在依赖项中没有的程序包，则有两种选择：

1. 创建 `pnpmfile.js` 并使用一个 [hook](/pnpmfile) 将缺少的依赖项添加到包的清单中。

2. 添加到 `hoist-pattern` 中。 例如，如果未找到的模块是 `babel-core`，则将以下设置添加到 `.npmrc`：

    ```ini
    hoist-pattern[]=babel-core
    ```

## 最坏的情况 -- 提升至根

即使使用pnpm的默认配置，某些工具也可能无法工作，默认配置下所有内容都悬挂在虚拟存储的根目录中，而某些软件包则悬挂在根目录中。 在这种情况下，您可以将所有内容或部分依赖关系提升到modules目录的根目录。

要将所有内容提升到node_modules的根目录：

```ini
shamefully-hoist=true
```

按匹配规则提升:

```ini
public-hoist-pattern[]=babel-*
```
