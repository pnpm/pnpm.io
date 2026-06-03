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

- If the **$XDG_CONFIG_HOME** env variable is set: **$XDG_CONFIG_HOME/pnpm/**
- On Windows: **~/AppData/Local/pnpm/config/**
- On macOS: **~/Library/Preferences/pnpm/**
- On Linux: **~/.config/pnpm/**

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

See also the [`strictSsl`](./settings.md#strictssl) setting.

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
