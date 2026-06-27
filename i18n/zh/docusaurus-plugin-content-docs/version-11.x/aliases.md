---
id: aliases
title: 别名（Aliases）
---

别名让你可以使用自定义名称安装软件包。

假设你在项目中大量地使用了 `lodash`， 但 `lodash` 中的一个 bug 破坏了你的项目， 你提交了一个 fix 但是 `lodash` 不打算合并它。 通常你会直接从你的分叉库中安装修改过的 `lodash` (Git 托管的依赖) 或者修改一下名称作为新包发布到 npm。 如果你使用第二种解决方式，则必须使用新的包名（`require('lodash')` => `require('awesome-lodash')`）来替换项目中的所有引用。 有了别名，你可以有第三种解决方式。

发布一个名为 `awesome-lodash` 的新包，并使用 `lodash` 作为别名来安装它：

```
pnpm add lodash@npm:awesome-lodash
```

不需要更改代码， 所有的 `lodash` 引用都被解析到了 `awesome-lodash`。

有时你会想要在项目中使用一个包的两个不同版本， 很简单：

```sh
pnpm add lodash1@npm:lodash@1
pnpm add lodash2@npm:lodash@2
```

现在你可以通过 `require('lodash1')` 引入第一个版本的 lodash ，通过 `require('lodash2')` 引入第二个。

当与钩子结合使用时，这会变得更加强大。 比如你想将 `node_modules` 里所有的 `lodash` 引用也替换为 `awesome-lodash` 。 你可以用下面的 `.pnpmfile.mjs` 轻松实现：

```js
function readPackage(pkg) {
  if (pkg.dependencies && pkg.dependencies.lodash) {
    pkg.dependencies.lodash = 'npm:awesome-lodash@^1.0.0'
  }
  return pkg
}

export const hooks = {
  readPackage
}
```
