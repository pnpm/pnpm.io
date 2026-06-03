---
id: dlx
title: "pnpm dlx"
---

Aliases: `pnpx` is an alias for `pnpm dlx`

Busca um pacote do registro sem instalá-lo como uma dependência, faz o hotload (recarrega automaticamente) e executa qualquer comando padrão que o binário expõe.

For example, to use `create-vue` anywhere to bootstrap a Vue project without needing to install it under another project, you can run:

```
pnpm dlx create-vue my-app
```

This will fetch `create-vue` from the registry and run it with the given arguments.

Você também pode especificar qual versão exata do pacote você gostaria de usar:

```
pnpm dlx create-vue@next my-app
```

The `catalog:` protocol is also supported, allowing you to use versions defined in your workspace catalogs:

```
pnpm dlx shx@catalog:
```

## Opções

### --package &lt;name\>

O pacote a ser instalado antes de executar o comando.

Exemplo:

```
pnpm --package=@pnpm/meta-updater dlx meta-updater --help
pnpm --package=@pnpm/meta-updater@0 dlx meta-updater --help
```

Vários pacotes podem ser fornecidos para instalação:

```
pnpm --package=yo --package=generator-webapp dlx yo webapp --skip-install
```

### --allow-build

Added in: v10.2.0

A list of package names that are allowed to run postinstall scripts during installation.

Exemplo:

```
pnpm --allow-build=esbuild my-bundler bundle
```

The actual packages executed by `dlx` are allowed to run postinstall scripts by default. So if in the above example `my-bundler` has to be built before execution, it will be built.

### --shell-mode, -c

Executa o comando em um shell. Utilize `/bin/sh` no UNIX e `\cmd.exe` no Windows.

Exemplo:

```
pnpm --package cowsay --package lolcatjs -c dlx 'echo "hi pnpm" | cowsay | lolcatjs'
```

### --silent, -s

Apenas a saída do comando executado é exibida.
