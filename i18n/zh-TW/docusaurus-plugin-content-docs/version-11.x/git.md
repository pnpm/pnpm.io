---
id: git
title: 使用 Git
---

## Lockfiles

You should always commit the lockfile (`pnpm-lock.yaml`). 這有很多原因，其中主要原因是：

- 由於省去了套件的解析過程，因此在 CI 與生產環境中能夠更快完成安裝。
- 在開發、測試與生產環境，它將強制執行一致的安裝與解析過程，這表示在測試與生產環境中使用的套件將與開發環境中使用的套件一致。

### 合併衝突

pnpm can automatically resolve merge conflicts in `pnpm-lock.yaml`.
If you have conflicts, just run `pnpm install` and commit the changes.

但請注意自動解決合併衝突的過程。 建議您在提交變更之前檢查變更內容，因為我們不敢保證 pnpm 會選擇正確的標頭 (head) - 它使用最新的 lockfile 來建構環境，這在大部分的情況下會是理想的。
