---
id: pnx
title: pnx
---

Aliases: `pnpm dlx`, `pnpx`

Busca un paquete desde el registro sin tener que intalarlo como una dependencia, se carga al momento, y corre cualquier comando binario por defecto que expone.

For example, to use `create-vue` anywhere to bootstrap a Vue project without
needing to install it under another project, you can run:

```
pnx create-vue my-app
```

This will fetch `create-vue` from the registry and run it with the given arguments.

También puede especificar qué versión exacta del paquete le gustaría usar:

```
pnx create-vue@next my-app
```

The `catalog:` protocol is also supported, allowing you to use versions defined in your workspace catalogs:

```
pnx shx@catalog:
```

## Opciones

### --package &lt;name\>

El paquete a instalar antes de ejecutar el comando.

Ejemplo:

```
pnx --package=@pnpm/meta-updater meta-updater --help
pnx --package=@pnpm/meta-updater@0 meta-updater --help
```

Se pueden proporcionar varios paquetes para la instalación:

```
pnx --package=yo --package=generator-webapp yo webapp --skip-install
```

### --allow-build

Added in: v10.2.0

A list of package names that are allowed to run postinstall scripts during installation.

Ejemplo:

```
pnx --allow-build=esbuild my-bundler bundle
```

The actual packages executed by `dlx` are allowed to run postinstall scripts by default. So if in the above example `my-bundler` has to be built before execution, it will be built.

### --shell-mode, -c

Ejecuta el comando dentro de un shell. Uses `/bin/sh` on UNIX and `\cmd.exe` on Windows.

Ejemplo:

```
pnx --package cowsay --package lolcatjs -c 'echo "hi pnpm" | cowsay | lolcatjs'
```

### --silent, -s

Solo se imprime la salida del comando ejecutado.

## Security and trust policies

Since v11.0.0, `pnx` (and its `pnpm dlx` / `pnpx` aliases) honors the project-level security and trust policy settings when resolving and fetching the requested package:

- [`minimumReleaseAge`](../settings.md#minimumreleaseage), [`minimumReleaseAgeExclude`](../settings.md#minimumreleaseageexclude), [`minimumReleaseAgeStrict`](../settings.md#minimumreleaseage)
- [`trustPolicy`](../settings.md#trustpolicy), [`trustPolicyExclude`](../settings.md#trustpolicyexclude), [`trustPolicyIgnoreAfter`](../settings.md#trustpolicyignoreafter)

This means `pnx` will refuse to execute freshly published or insufficiently trusted packages the same way a regular `pnpm install` would.
