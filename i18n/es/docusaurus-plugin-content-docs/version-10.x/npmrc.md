---
id: npmrc
title: "Auth & Registry Settings (.npmrc)"
---

The settings on this page must be configured via `.npmrc` files. pnpm uses the npm CLI under the hood for publishing, so these settings need to be in a format that npm can read.

For details on how `.npmrc` files are loaded, see the [`pnpm config`](./cli/config.md) command.

For settings that can be configured in `pnpm-workspace.yaml`, see [Settings (pnpm-workspace.yaml)](./settings.md).

## Registry Settings

### registry

- Default: **https://registry.npmjs.org/**
- Type: **url**

The base URL of the npm package registry (trailing slash included).

### @jsr\:registry

Added in: v10.9.0

- Default: **https://npm.jsr.io/**
- Type: **url**

The base URL of the [JSR] package registry.

[JSR]: cli/add.md#install-from-the-jsr-registry

### &lt;scope&gt;&#58;registry

The npm registry that should be used for packages of the specified scope. For
example, setting `@babel:registry=https://example.com/packages/npm/`
will enforce that when you use `pnpm add @babel/core`, or any `@babel` scoped
package, the package will be fetched from `https://example.com/packages/npm`
instead of the default registry.

## Authentication Settings

### &lt;URL&gt;&#58;_authToken

Defina la señal de portadora de autenticación que se debe utilizar al acceder al registro
especificado. Por ejemplo:

```ini
//registry.npmjs.org/:_authToken=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

También puede utilizar una variable de entorno. Por ejemplo:

```ini
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

Or you may just use an environment variable directly, without changing `.npmrc` at all:

```
npm_config_//registry.npmjs.org/:_authToken=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### &lt;URL&gt;&#58;tokenHelper

Un token de ayuda es un ejecutable que genera un token de autenticación. Esto se puede usar en situaciones en las que authToken no es un valor constante sino algo que se actualiza regularmente, donde un script u otra herramienta puede usar un token de actualización existente para obtener un nuevo token de acceso.

La configuración de la ruta al asistente debe ser una ruta absoluta, sin argumentos. In order to be secure, it is only permitted to set this value in the user `.npmrc`. Otherwise a project could place a value in a project's local `.npmrc` and run arbitrary executables.

Configuración de un token de ayuda para el registro predeterminado:

```ini
tokenHelper=/home/ivan/token-generator
```

Configuración de un token de ayuda para el registro predeterminado:

```
//registry.corp.com:tokenHelper=/home/ivan/token-generator
```

## Proxy Settings

### https-proxy

- Default: **null**
- Type: **url**

Un proxy para usar con solicitudes HTTPS salientes. If the `HTTPS_PROXY`, `https_proxy`,
`HTTP_PROXY` or `http_proxy` environment variables are set, their values will be
used instead.

If your proxy URL contains a username and password, make sure to URL-encode them.
Por ejemplo:

```ini
https-proxy=https://use%21r:pas%2As@my.proxy:1234/foo
```

Do not encode the colon (`:`) between the username and password.

### http-proxy

### proxy

- Default: **null**
- Type: **url**

Un proxy para usar con solicitudes http salientes. Si se establecen las variables de entorno HTTP_PROXY o http_proxy, la biblioteca de solicitud
subyacente respetará la configuración del proxy.

### local-address

- Default: **undefined**
- Type: **IP Address**

La dirección IP de la interfaz local que se usará al realizar conexiones con el registro npm.

### maxsockets

- Default: **networkConcurrency x 3**
- Type: **Number**

El número máximo de conexiones a usar por origen (combinación de protocolo/host/puerto).

### noproxy

- Default: **null**
- Type: **String**

Una cadena de extensiones de dominio separadas por comas para las que no se debe usar un proxy.

## SSL Settings

### strict-ssl

- Default: **true**
- Type: **Boolean**

Si realizar o no la validación de la clave SSL al realizar solicitudes al registro a través de
HTTPS.

See also the `ca` option.

## Certificate Settings

### ca

- Default: **The npm CA certificate**
- Type: **String, Array or null**

El certificado de firma de la autoridad de certificación en el que se confía para las conexiones SSL
con el registro. Los valores deben estar en formato PEM (también conocido como
"X.509 codificado en Base-64 (.CER)"). Por ejemplo:

```sh
ca="-----BEGIN CERTIFICATE-----\nXXXX\nXXXX\n-----END CERTIFICATE-----"
```

Se establece en nulo para permitir sólo a los registradores conocidos, o a un certificado de CA específico para confiar en
sólo la autorización de firma específica.

Se puede confiar en varias CA especificando una arreglo de certificados:

```sh
ca[]="..."
ca[]="..."
```

See also the `strict-ssl` config.

### cafile

- Default: **null**
- Type: **path**

Una ruta a un archivo que contiene uno o varios certificados de firma de autoridad de certificación. Similar to the `ca` setting, but allows for multiple CAs, as well
as for the CA information to be stored in a file instead of being specified via
CLI.

### &lt;URL&gt;&#58;cafile

Define the path to a Certificate Authority file to use when accessing the specified
registry. Por ejemplo:

```sh
//registry.npmjs.org/:cafile=ca-cert.pem
```

### &lt;URL&gt;&#58;ca

Added in: v10.25.0

Define an inline Certificate Authority certificate for the specified registry.
The value must be PEM-encoded, like the global `ca` setting, but it only applies
to the matching registry URL.

```sh
//registry.example.com/:ca=-----BEGIN CERTIFICATE-----...-----END CERTIFICATE-----
```

### cert

- Default: **null**
- Type: **String**

Un certificado de cliente para pasar al acceder al registro. Los valores deben estar en formato PEM (también conocido como
"X.509 codificado en Base-64 (.CER)"). Por ejemplo:

```test
cert="-----BEGIN CERTIFICATE-----\nXXXX\nXXXX\n-----END CERTIFICATE-----"
```

It is not the path to a certificate file.

### &lt;URL&gt;&#58;cert

Added in: v10.25.0

Define an inline client certificate to use when accessing the specified
registry. Ejemplo:

```sh
//registry.example.com/:cert=-----BEGIN CERTIFICATE-----...-----END CERTIFICATE-----
```

### &lt;URL&gt;&#58;certfile

Define the path to a certificate file to use when accessing the specified
registry. Por ejemplo:

```sh
//registry.npmjs.org/:certfile=server-cert.pem
```

### key

- Default: **null**
- Type: **String**

Una clave de cliente para pasar al acceder al registro. Los valores deben estar en formato PEM (también conocido como
"X.509 codificado en Base-64 (.CER)"). Por ejemplo:

```sh
key="-----BEGIN PRIVATE KEY-----\nXXXX\nXXXX\n-----END PRIVATE KEY-----"
```

It is not the path to a key file. Use `<URL>&#58;keyfile` if you need to reference
the file system instead of inlining the key.

Esta configuración contiene información confidencial. Don't write it to a local `.npmrc` file committed to the repository.

### &lt;URL&gt;&#58;key

Added in: v10.25.0

Define an inline client key for the specified registry URL.

```sh
//registry.example.com/:key=-----BEGIN PRIVATE KEY-----...-----END PRIVATE KEY-----
```

### &lt;URL&gt;&#58;keyfile

Define the path to a client key file to use when accessing the specified
registry. Por ejemplo:

```sh
//registry.npmjs.org/:keyfile=server-key.pem
```
