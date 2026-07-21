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

Define o token de autenticação <i>bearer</i> ao acessar o registro especificado. Por exemplo:

```ini
//registry.npmjs.org/:_authToken=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

Você também pode usar uma variável de ambiente. Por exemplo:

```ini
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

Or you may just use an environment variable directly, without changing `.npmrc` at all:

```
npm_config_//registry.npmjs.org/:_authToken=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### &lt;URL&gt;&#58;tokenHelper

Um <i>token helper</i> é um executável que gera um token de autenticação. Isso pode ser utilizado em situação onde o <code>authToken</code> não é um valor constante, mas é algo que é atualizado regularmente, onde um script ou outra ferramenta pode utilizar um <i>refresh token</i> para obter um novo token de acesso.

A configuração para o caminho do <i>helper</i> deve ser um caminho absoluto, sem argumentos. In order to be secure, it is only permitted to set this value in the user `.npmrc`. Otherwise a project could place a value in a project's local `.npmrc` and run arbitrary executables.

Definindo um <i>token helper</i> para o registro padrão:

```ini
tokenHelper=/home/ivan/token-generator
```

Definindo um <i>token helper</i> para o registro especificado:

```
//registry.corp.com:tokenHelper=/home/ivan/token-generator
```

## Proxy Settings

### https-proxy

- Default: **null**
- Type: **url**

Um proxy a ser usado para solicitações HTTPS de saída. If the `HTTPS_PROXY`, `https_proxy`,
`HTTP_PROXY` or `http_proxy` environment variables are set, their values will be
used instead.

If your proxy URL contains a username and password, make sure to URL-encode them.
Por exemplo:

```ini
https-proxy=https://use%21r:pas%2As@my.proxy:1234/foo
```

Do not encode the colon (`:`) between the username and password.

### http-proxy

### proxy

- Default: **null**
- Type: **url**

Um proxy a ser usado para solicitações http de saída. Se as variáveis de ambiente HTTP_PROXY ou http_proxy
forem definidas, as configurações de proxy serão respeitadas pela biblioteca de solicitação
subjacente.

### local-address

- Default: **undefined**
- Type: **IP Address**

O endereço IP da interface local a ser usada ao fazer conexões com o registro npm.

### maxsockets

- Default: **networkConcurrency x 3**
- Type: **Number**

O número máximo de conexões a serem usadas por origem (combinação protocolo/host/porta [protocol/host/port]).

### noproxy

- Default: **null**
- Type: **String**

Uma sequência de extensões de domínio separada por vírgulas para as quais um proxy não deve ser usado.

## SSL Settings

### strict-ssl

- Default: **true**
- Type: **Boolean**

Se deve ou não fazer a validação da chave SSL ao fazer solicitações ao registro via
HTTPS.

See also the `ca` option.

## Certificate Settings

### ca

- Default: **The npm CA certificate**
- Type: **String, Array or null**

O certificado de assinatura da Autoridade Certificadora que é confiável para conexões SSL com o registro. Os valores podem ser no formato PEM (também conhecido como "Base-64 encoded X.509 (.CER)"). Por exemplo:

```sh
ca="-----BEGIN CERTIFICATE-----\nXXXX\nXXXX\n-----END CERTIFICATE-----"
```

Defina como "null" para permitir apenas registros conhecidos, ou um certificado de CA específico para confiar apenas naquela autoridade de assinatura específica.

Múltiplos CAs confiáveis podem especificados em um array de certificados:

```sh
ca[]="..."
ca[]="..."
```

See also the `strict-ssl` config.

### cafile

- Default: **null**
- Type: **path**

O caminho de um arquivo contendo um ou mais certificados de assinatura de Autoridade Certificadora. Similar to the `ca` setting, but allows for multiple CAs, as well
as for the CA information to be stored in a file instead of being specified via
CLI.

### &lt;URL&gt;&#58;cafile

Define the path to a Certificate Authority file to use when accessing the specified
registry. Por exemplo:

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

Um certificado de cliente a ser aprovado ao acessar o registro. Os valores devem estar em
formato PEM (também conhecido como "Base-64 codificado X.509 (. CER)"). Por exemplo:

```test
cert="-----BEGIN CERTIFICATE-----\nXXXX\nXXXX\n-----END CERTIFICATE-----"
```

It is not the path to a certificate file.

### &lt;URL&gt;&#58;cert

Added in: v10.25.0

Define an inline client certificate to use when accessing the specified
registry. Exemplo:

```sh
//registry.example.com/:cert=-----BEGIN CERTIFICATE-----...-----END CERTIFICATE-----
```

### &lt;URL&gt;&#58;certfile

Define the path to a certificate file to use when accessing the specified
registry. Por exemplo:

```sh
//registry.npmjs.org/:certfile=server-cert.pem
```

### key

- Default: **null**
- Type: **String**

Uma chave de cliente a ser passada para acessar o registry. Os valores devem estar no formato PEM (X.509 codificado em Base-64 (.CER)). Por exemplo:

```sh
key="-----BEGIN PRIVATE KEY-----\nXXXX\nXXXX\n-----END PRIVATE KEY-----"
```

It is not the path to a key file. Use `<URL>&#58;keyfile` if you need to reference
the file system instead of inlining the key.

Essa configuração contém informações confidenciais. Don't write it to a local `.npmrc` file committed to the repository.

### &lt;URL&gt;&#58;key

Added in: v10.25.0

Define an inline client key for the specified registry URL.

```sh
//registry.example.com/:key=-----BEGIN PRIVATE KEY-----...-----END PRIVATE KEY-----
```

### &lt;URL&gt;&#58;keyfile

Define the path to a client key file to use when accessing the specified
registry. Por exemplo:

```sh
//registry.npmjs.org/:keyfile=server-key.pem
```
