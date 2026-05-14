---
id: production
title: 生产
---

有两种方法可以在生产环境中使用 pnpm 来引导你的包。 其中之一是提交锁文件。 然后，在你的生产环境中，运行 `pnpm install` - 这将使用锁文件构建依赖树，这意味着依赖版本将与提交锁文件时的一致。 这是最有效的方法（也是我们建议的方法），以确保您的依赖关系树在环境之间保持一致。

另一种方法是提交锁文件并将包存储复制到你的生产环境（你可以使用 [存储位置选项][store location option] 更改位置）。
然后，你可以运行 `pnpm install --offline` 并且 pnpm 将使用全局存储中的包，因此它不会向 npm 注册源发出任何请求。 这种方式只有在出于某种原因环境无法访问 npm 注册源时才推荐。

[store location option]: settings#storeDir
