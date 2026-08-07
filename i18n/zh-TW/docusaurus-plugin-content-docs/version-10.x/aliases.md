---
id: aliases
title: 別名（Aliases）
---

別名讓您可以使用自定義名稱安裝軟件包。

Let's assume you use `lodash` all over your project. There is a bug in `lodash`
that breaks your project. You have a fix but `lodash` won't merge it. Normally
you would either install `lodash` from your fork directly (as a git-hosted
dependency) or publish it with a different name. If you use the second solution
you have to replace all the requires in your project with the new dependency
name (`require('lodash')` => `require('awesome-lodash')`). 透過別名，您將有第三種選擇方式。

Publish a new package called `awesome-lodash` and install it using `lodash` as
its alias:

```
pnpm add lodash@npm:awesome-lodash
```

不需要更改程式碼。 All the requires of `lodash` will now resolve to
`awesome-lodash`.

有時候您會想要在專案中使用兩個不同版本的套件。 這很簡單：

```sh
pnpm add lodash1@npm:lodash@1
pnpm add lodash2@npm:lodash@2
```

Now you can require the first version of lodash via `require('lodash1')` and the
second via `require('lodash2')`.

當與 hooks 結合使用時功能將會更強大。 Maybe you want to replace
`lodash` with `awesome-lodash` in all the packages in `node_modules`. You can
easily achieve that with the following `.pnpmfile.cjs`:

```js
function readPackage(pkg) {
  if (pkg.dependencies && pkg.dependencies.lodash) {
    pkg.dependencies.lodash = 'npm:awesome-lodash@^1.0.0'
  }
  return pkg
}

module.exports = {
  hooks: {
    readPackage
  }
}
```
