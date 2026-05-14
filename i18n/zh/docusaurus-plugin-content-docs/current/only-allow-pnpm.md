---
id: only-allow-pnpm
title: 只允许 pnpm
---

当你在项目中使用 pnpm 时，你不希望被其他人意外运行`npm install` 或 `yarn`。 为了防止开发人员使用其他的包管理器，你可以将下面的这个 `preinstall` 脚本添加到您的 `package.json`：

```json
{
    "scripts": {
        "preinstall": "npx only-allow pnpm"
    }
}
```

现在，每当有人运行 `npm install` 或 `yarn`时，他们都会收到错误，并且安装将无法继续。

如果你使用 npm v7，请改用 `npx -y`。
