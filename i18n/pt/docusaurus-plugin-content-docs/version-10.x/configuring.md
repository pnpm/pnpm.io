---
id: configuring
title: Configurando
---

pnpm uses [npm's configuration] formats. Portanto, você deve definir a configuração da mesma forma que faria para o npm. Por exemplo,

```
pnpm config set store-dir /path/to/.pnpm-store
```

Se nenhuma loja estiver configurada, o pnpm criará automaticamente uma loja na
mesma unidade de armazenamento. If you need pnpm to work across multiple hard drives or filesystems,
please read [the FAQ].

Além disso, o pnpm usa a mesma configuração que o npm usa para fazer instalações. Se você tiver um registro privado e o npm estiver configurado para trabalhar com
ele, o pnpm deverá ser capaz de autorizar solicitações também, sem nenhuma configuração adicional.

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
