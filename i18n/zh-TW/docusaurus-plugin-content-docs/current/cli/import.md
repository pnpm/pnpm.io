---
id: import
title: pnpm import
---

`pnpm import` 指令能幫您匯入其他套件管理器的 lockfile 檔案並產生 `pnpm-lock.yaml`。 支援的來源檔案：
* `package-lock.json`
* `npm-shrinkwrap.json`
* `yarn.lock`

請注意，若您想為工作區匯入相依性，則需要事先在 [ pnpm-workspace.yaml](../pnpm-workspace_yaml.md) 檔案中宣告。
