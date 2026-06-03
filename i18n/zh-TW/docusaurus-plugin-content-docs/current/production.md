---
id: production
title: Production
---

There are two ways to bootstrap your package in a production environment with pnpm. One of these is to commit the lockfile. 接著，在生產環境中，執行 `pnpm install` - 這將會依據 lockfile 建立依賴套件樹狀結構，這表示依賴套件的使用版本將與提交的 lockfile 一致。 This is the most effective way (and the one we recommend) to ensure your dependency tree persists across environments.

The other method is to commit the lockfile AND copy the package store to your production environment (you can change where with the [store location option][]). 接著，您可以執行 `pnpm install --offline`，pnpm 將使用全域儲存庫中已安裝的套件，因此它不會對設定檔發出任何請求。 這種方式 **只有** 當某種原因導致環境無法存取設定檔時才建議使用。

[store location option]: settings#storeDir
