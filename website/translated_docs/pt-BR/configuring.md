---
id: configuring-pt-br
title: Configurando
---

O pnpm usa as configurações do [npm](https://docs.npmjs.com/misc/config). Portanto, você deve definir as configurações da mesma forma que faria para o npm. Por exemplo,

```
npm config set store /path/to/.pnpm-store
```


Se nenhuma loja estiver configurada, o pnpm criará automaticamente uma loja na mesma unidade.
Se estiver configurando o pnpm para funcionar em vários discos rígidos ou sistemas de arquivos, leia [o FAQ](faq.md#does-pnpm-work-across-multiple-hard-drives-or-filesystems).

Além disso, o pnpm usa as mesmas configurações que o npm usa para fazer instalações. Se você tem um registro privado e o npm está configurado
para trabalhar com ele, o pnpm deve ser capaz de autorizar solicitações, sem configuração adicional.

Além dessas opções, o pnpm também permite que você use todos os parâmetros que são flags (por exemplo `--filter` ou` --workspace-concurrency`) como opção:
```
workspace-concurrency = 1
filter = @my-scope/*
```

