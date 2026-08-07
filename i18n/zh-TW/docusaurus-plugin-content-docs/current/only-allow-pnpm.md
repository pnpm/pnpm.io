---
id: only-allow-pnpm
title: 在專案中限用 pnpm
---

當您在專案中使用 pnpm 時，不希望其他團隊成員不小心執行 `npm install` 或 `yarn`。 如要防止他人使用別的套件管理器，可以在 `package.json` 中加入 `preinstall` 命令。

```json
{
    "scripts": {
        "preinstall": "npx only-allow pnpm"
    }
}
```

以後當有人執行 `npm install` 或 `yarn` 時，只會收到錯誤訊息且中止安裝。

如果您使用 npm v7，請改用 `npx -y`。
