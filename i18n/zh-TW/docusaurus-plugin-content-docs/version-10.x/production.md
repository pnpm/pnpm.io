---
id: production
title: Production
---

There are two ways to bootstrap your package in a production environment with
pnpm. One of these is to commit the lockfile. 接著，在正式環境中執行 `pnpm install`。這將會依 lockfile 組建相依樹，表示相依套件的版本會與提交 lockfile 時的保持一致。 This is the most effective way (and the one we
recommend) to ensure your dependency tree persists across environments.

另一種方式為提交 lockfile 及套件儲存區的副本至正式環境（您可以透過 [store location option]變更位置）。
接著，您可以執行 `pnpm install --offline`，pnpm 將使用全域儲存區中的套件，不會對套件庫發出任何請求。 此方式**僅**推薦用於出於某種原因，無法存取外部套件庫的環境。

[store location option]: settings#storeDir
