---
id: configuring
title: 配置
---

pnpm 使用 [npm 的配置][npm's configuration] 格式。 因此，你设置配置的方式应该与 npm 相同。 例如，

```
pnpm config set store-dir /path/to/.pnpm-store
```

如果没有配置存储，那么 pnpm 将自动在同一磁盘上创建存储。 如果你需要 pnpm 跨多个硬盘或文件系统工作，
请阅读[常见问题解答][the FAQ]。

此外，pnpm 使用与 npm 相同的配置进行安装。 如果你有一个私有源并且 npm 被配置使用它， pnpm 应该不需要额外的配置也能够授权请求。

除了这些选项外， pnpm 也允许你使用作为标志的所有的参数（例如 `--filter` 或 `--workspace concurrency`) ：

```
workspace-concurrency = 1
filter = @my-scope/*
```

更多信息请参阅 [`config` 命令][`config` command]。

[npm's configuration]: https://docs.npmjs.com/misc/config
[the FAQ]: ./faq.md#does-pnpm-work-across-multiple-drives-or-filesystems
[`config` command]: ./cli/config.md
