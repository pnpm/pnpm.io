---
id: configuring
title: Configuración
---

pnpm uses [npm's configuration] formats. Por lo tanto, debe establecer la configuración
la misma manera que lo haría para npm. Por ejemplo,

```
pnpm config set store-dir /path/to/.pnpm-store
```

Si no hay ningún almacenamiento configurado, pnpm creará automáticamente un almacenamiento en la misma unidad de disco. If you need pnpm to work across multiple hard drives or filesystems,
please read [the FAQ].

Además, pnpm utiliza la misma configuración que utiliza npm para realizar instalaciones. Si tienes un registro privado y npm está configurado para trabajar con él, pnpm debería poder autorizar solicitudes también, sin configuración adicional.

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
