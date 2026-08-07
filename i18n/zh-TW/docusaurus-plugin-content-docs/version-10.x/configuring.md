---
id: configuring
title: 設定
---

pnpm uses [npm's configuration] formats. 因此，您應該以與 npm 相同的方式進行設定。 例如，

```
pnpm config set store-dir /path/to/.pnpm-store
```

如果沒有設定存放區，那麼 pnpm 將會自動於相同的磁碟機上建立存放區。 If you need pnpm to work across multiple hard drives or filesystems,
please read [the FAQ].

此外，pnmp 使用的設定與 npm 用於執行安裝的設定相同。 如果您有私有註冊源，且 npm 設定為使用私有註冊源工作，則 pnpm 也應該能夠授權要求，而無需其他設定。

In addition to those options, pnpm also allows you to use all parameters that
are flags (for example `--filter` or `--workspace-concurrency`) as options:

```
workspace-concurrency = 1
filter = @my-scope/*
```

See the [`config` command] for more information.

[npm's configuration]: https://docs.npmjs.com/misc/config
[the FAQ]: ./faq.md#does-pnpm-work-across-multiple-drives-or-filesystems
[`config` command]: ./cli/config.md
