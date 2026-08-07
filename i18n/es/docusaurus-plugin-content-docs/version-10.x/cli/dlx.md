---
id: dlx
title: "pnpm dlx"
---

Aliases: `pnpx` is an alias for `pnpm dlx`

Busca un paquete desde el registro sin tener que intalarlo como una dependencia, se carga al momento, y corre cualquier comando binario por defecto que expone.

For example, to use `create-vue` anywhere to bootstrap a Vue project without
needing to install it under another project, you can run:

```
pnpm dlx create-vue my-app
```

This will fetch `create-vue` from the registry and run it with the given arguments.

También puede especificar qué versión exacta del paquete le gustaría usar:

```
pnpm dlx create-vue@next my-app
```

The `catalog:` protocol is also supported, allowing you to use versions defined in your workspace catalogs:

```
pnpm dlx shx@catalog:
```

## Opciones

### --package &lt;name\>

El paquete a instalar antes de ejecutar el comando.

Ejemplo:

```
pnpm --package=@pnpm/meta-updater dlx meta-updater --help
pnpm --package=@pnpm/meta-updater@0 dlx meta-updater --help
```

Se pueden proporcionar varios paquetes para la instalación:

```
pnpm --package=yo --package=generator-webapp dlx yo webapp --skip-install
```

### --allow-build

Added in: v10.2.0

A list of package names that are allowed to run postinstall scripts during installation.

Ejemplo:

```
pnpm --allow-build=esbuild my-bundler bundle
```

The actual packages executed by `dlx` are allowed to run postinstall scripts by default. So if in the above example `my-bundler` has to be built before execution, it will be built.

### --shell-mode, -c

Ejecuta el comando dentro de un shell. Uses `/bin/sh` on UNIX and `\cmd.exe` on Windows.

Ejemplo:

```
pnpm --package cowsay --package lolcatjs -c dlx 'echo "hi pnpm" | cowsay | lolcatjs'
```

### --silent, -s

Solo se imprime la salida del comando ejecutado.
