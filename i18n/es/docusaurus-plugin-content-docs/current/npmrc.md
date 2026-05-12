---
id: npmrc
title: "Authentication Settings"
---

The settings on this page contain sensitive credentials and are stored in INI-formatted files. Do not commit these files to your repository.

For non-sensitive settings (proxy, SSL, registries, etc.), see [Settings (pnpm-workspace.yaml)](./settings.md).

## Auth file locations

pnpm reads authentication settings from the following files, in order of priority (highest first):

1. **`<workspace root>/.npmrc`** — project-level auth. This file should be listed in `.gitignore`.
2. **`<pnpm config>/auth.ini`** — the primary user-level auth file. `pnpm login` writes tokens here.
3. **`~/.npmrc`** — read as a fallback for easier migration from npm. Use the [`npmrcAuthFile`](./settings.md#npmrcauthfile) setting to point to a different file.

The `<pnpm config>` directory is:

* If the **$XDG_CONFIG_HOME** env variable is set: **$XDG_CONFIG_HOME/pnpm/**
* On Windows: **~/AppData/Local/pnpm/config/**
* On macOS: **~/Library/Preferences/pnpm/**
* On Linux: **~/.config/pnpm/**

## Authentication Settings

### &lt;URL&gt;&#58;_authToken

Defina la señal de portadora de autenticación que se debe utilizar al acceder al registro especificado. Por ejemplo:

```ini
//registry.npmjs.org/:_authToken=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

También puede utilizar una variable de entorno. Por ejemplo:

```ini
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

### &lt;URL&gt;&#58;tokenHelper

Un token de ayuda es un ejecutable que genera un token de autenticación. Esto se puede usar en situaciones en las que authToken no es un valor constante sino algo que se actualiza regularmente, donde un script u otra herramienta puede usar un token de actualización existente para obtener un nuevo token de acceso.

La configuración de la ruta al asistente debe ser una ruta absoluta, sin argumentos. Para mayor seguridad, solo se permite establecer este valor en el usuario `.npmrc`. De lo contrario, un proyecto podría colocar un valor en el `.npmrc` local de un proyecto y ejecutar ejecutables arbitrarios.

Configuración de un token de ayuda para el registro predeterminado:

```ini
tokenHelper=/home/ivan/token-generator
```

Configuración de un token de ayuda para el registro predeterminado:

```
//registry.corp.com:tokenHelper=/home/ivan/token-generator
```

## Certificate Settings

### ca

* Valor predeterminado: **El certificado CA de npm**
* Tipo: **Cadena, Arreglo o nulo**

El certificado de firma de la autoridad de certificación en el que se confía para las conexiones SSL con el registro. Los valores deben estar en formato PEM (también conocido como "X.509 codificado en Base-64 (.CER)"). Por ejemplo:

```sh
ca="-----BEGIN CERTIFICATE-----\nXXXX\nXXXX\n-----END CERTIFICATE-----"
```

Se establece en nulo para permitir sólo a los registradores conocidos, o a un certificado de CA específico para confiar en sólo la autorización de firma específica.

Se puede confiar en varias CA especificando una arreglo de certificados:

```sh
ca[]="..."
ca[]="..."
```

See also the [`strictSsl`](./settings.md#strictssl) setting.

### cafile

* Default: **null**
* Tipo: **path**

Una ruta a un archivo que contiene uno o varios certificados de firma de autoridad de certificación. Similar a la configuración `ca`, pero permite múltiples CA, así como que la información de CA se almacene en un archivo en lugar de especificarse a través de CLI.

### &lt;URL&gt;&#58;cafile

Define the path to a Certificate Authority file to use when accessing the specified registry. Por ejemplo:

```sh
//registry.npmjs.org/:cafile=ca-cert.pem
```

### &lt;URL&gt;&#58;ca

Added in: v10.25.0

Define an inline Certificate Authority certificate for the specified registry. The value must be PEM-encoded, like the global `ca` setting, but it only applies to the matching registry URL.

```sh
//registry.example.com/:ca=-----BEGIN CERTIFICATE-----...-----END CERTIFICATE-----
```

### cert

* Default: **null**
* Tipo: **String**

Un certificado de cliente para pasar al acceder al registro. Los valores deben estar en formato PEM (también conocido como "X.509 codificado en Base-64 (.CER)"). Por ejemplo:

```test
cert="-----BEGIN CERTIFICATE-----\nXXXX\nXXXX\n-----END CERTIFICATE-----"
```

It is not the path to a certificate file.

### &lt;URL&gt;&#58;cert

Added in: v10.25.0

Define an inline client certificate to use when accessing the specified registry. Ejemplo:

```sh
//registry.example.com/:cert=-----BEGIN CERTIFICATE-----...-----END CERTIFICATE-----
```

### &lt;URL&gt;&#58;certfile

Define the path to a certificate file to use when accessing the specified registry. Por ejemplo:

```sh
//registry.npmjs.org/:certfile=server-cert.pem
```

### key

* Por defecto: **null**
* Tipo: **String**

Una clave de cliente para pasar al acceder al registro. Los valores deben estar en formato PEM (también conocido como "X.509 codificado en Base-64 (.CER)"). Por ejemplo:

```sh
key="-----BEGIN PRIVATE KEY-----\nXXXX\nXXXX\n-----END PRIVATE KEY-----"
```

It is not the path to a key file. Use `<URL>&#58;keyfile` if you need to reference the file system instead of inlining the key.

Esta configuración contiene información confidencial. No lo escriba en un archivo local `.npmrc` asignado al repositorio.

### &lt;URL&gt;&#58;key

Added in: v10.25.0

Define an inline client key for the specified registry URL.

```sh
//registry.example.com/:key=-----BEGIN PRIVATE KEY-----...-----END PRIVATE KEY-----
```

### &lt;URL&gt;&#58;keyfile

Define the path to a client key file to use when accessing the specified registry. Por ejemplo:

```sh
//registry.npmjs.org/:keyfile=server-key.pem
```
