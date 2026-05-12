---
id: pnx
title: pnx
---

Aliases: `pnpm dlx`, `pnpx`

Busca um pacote do registro sem instalá-lo como uma dependência, faz o hotload (recarrega automaticamente) e executa qualquer comando padrão que o binário expõe.

For example, to use `create-vue` anywhere to bootstrap a Vue project without
needing to install it under another project, you can run:

```
pnx create-vue my-app
```

This will fetch `create-vue` from the registry and run it with the given arguments.

Você também pode especificar qual versão exata do pacote você gostaria de usar:

```
pnx create-vue@next my-app
```

The `catalog:` protocol is also supported, allowing you to use versions defined in your workspace catalogs:

```
pnx shx@catalog:
```

## Opções

### --package &lt;name\>

O pacote a ser instalado antes de executar o comando.

Exemplo:

```
pnx --package=@pnpm/meta-updater meta-updater --help
pnx --package=@pnpm/meta-updater@0 meta-updater --help
```

Vários pacotes podem ser fornecidos para instalação:

```
pnx --package=yo --package=generator-webapp yo webapp --skip-install
```

### --allow-build

Added in: v10.2.0

A list of package names that are allowed to run postinstall scripts during installation.

Exemplo:

```
pnx --allow-build=esbuild my-bundler bundle
```

The actual packages executed by `dlx` are allowed to run postinstall scripts by default. So if in the above example `my-bundler` has to be built before execution, it will be built.

### --shell-mode, -c

Executa o comando em um shell. Uses `/bin/sh` on UNIX and `\cmd.exe` on Windows.

Exemplo:

```
pnx --package cowsay --package lolcatjs -c 'echo "hi pnpm" | cowsay | lolcatjs'
```

### --silent, -s

Apenas a saída do comando executado é exibida.

## Security and trust policies

Since v11.0.0, `pnx` (and its `pnpm dlx` / `pnpx` aliases) honors the project-level security and trust policy settings when resolving and fetching the requested package:

- [`minimumReleaseAge`](../settings.md#minimumreleaseage), [`minimumReleaseAgeExclude`](../settings.md#minimumreleaseageexclude), [`minimumReleaseAgeStrict`](../settings.md#minimumreleaseage)
- [`trustPolicy`](../settings.md#trustpolicy), [`trustPolicyExclude`](../settings.md#trustpolicyexclude), [`trustPolicyIgnoreAfter`](../settings.md#trustpolicyignoreafter)

This means `pnx` will refuse to execute freshly published or insufficiently trusted packages the same way a regular `pnpm install` would.
