---
id: npmrc
title: "认证设置"
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
* 在 Windows 系统上： **~/AppData/Local/pnpm/config/**
* 在 macOS 上： **~/Library/Preferences/pnpm/**
* On Linux: **~/.config/pnpm/**

## 认证设置

### &lt;URL&gt;&#58;_authToken

访问指定注册源时要使用的身份验证承载令牌。 示例：

```ini
//registry.npmjs.org/:_authToken=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

你也可以使用环境变量。 示例：

```ini
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

### &lt;URL&gt;&#58;tokenHelper

令牌助手是输出身份验证令牌的可执行文件。 这可以用于 authToken 不是常量值而是定期刷新值的情况，其中脚本或其他工具可以使用现有的刷新令牌来获取新的访问令牌。

助手路径的配置必须是绝对路径，没有参数。 为了安全起见，只允许在用户 `.npmrc`设置此值。 否则，项目可以在项目的本地 `.npmrc` 放置一个值并运行任意可执行文件。

为默认注册表设置令牌助手：

```ini
tokenHelper=/home/ivan/token-generator
```

为指定注册源设置令牌助手：

```
//registry.corp.com:tokenHelper=/home/ivan/token-generator
```

## 证书设置

### ca

* 默认值：**npm CA 证书**
* 类型：**String，Array 或 null**

可信的用于注册源 SSL 链接的 CA 签名证书。 值应采用 PEM 格式（也称 “Base-64 encoded X.509 (.CER)”）。 示例：

```sh
ca="-----BEGIN CERTIFICATE-----\nXXXX\nXXXX\n-----END CERTIFICATE-----"
```

设置为 null 时仅允许已知注册商，若指定 CA 证书将只信任指定的证书颁发机构。

通过指定一个证书数组，可以信任多个 CA：

```sh
ca[]="..."
ca[]="..."
```

See also the [`strictSsl`](./settings.md#strictssl) setting.

### cafile

* 默认值：**null**
* 类型：**path**

包含一个或多个 CA 证书的文件路径。 类似于 `ca` 设置，但允许多个CA， 此外， CA 信息将存储在一个文件中，而不是通过 CLI 指定。

### &lt;URL&gt;&#58;CA文件

定义访问指定注册源时使用的证书颁发机构文件的路径。 示例：

```sh
//registry.npmjs.org/:cafile=ca-cert.pem
```

### &lt;URL&gt;&#58;ca

添加于：v10.25.0

为指定的注册源定义一个内联证书颁发机构证书。 该值必须采用 PEM 编码，就像全局 `ca` 设置一样，但它仅将 应用于匹配的注册表 URL。

```sh
//registry.example.com/:ca=-----BEGIN CERTIFICATE-----...-----END CERTIFICATE-----
```

### cert

* 默认值：**null**
* 类型：**String**

访问注册源时传递的客户端证书。 值应为 PEM 格式（也称 "Base-64 encoded X.509 (.CER)"）。 示例：

```test
cert="-----BEGIN CERTIFICATE-----\nXXXX\nXXXX\n-----END CERTIFICATE-----"
```

这不是证书文件的路径。

### &lt;URL&gt;&#58;cert

添加于：v10.25.0

定义一个内联客户端证书，以便在访问指定的注册源时使用。 示例：

```sh
//registry.example.com/:cert=-----BEGIN CERTIFICATE-----...-----END CERTIFICATE-----
```

### &lt;URL&gt;&#58;证书文件

定义访问指定注册源时使用的证书文件的路径。 示例：

```sh
//registry.npmjs.org/:certfile=server-cert.pem
```

### key

* 默认值：**null**
* 类型：**String**

访问注册源时要传递的客户端密钥。 值应为 PEM 格式（也称 "Base-64 encoded X.509 (.CER)"）。 示例：

```sh
key="-----BEGIN PRIVATE KEY-----\nXXXX\nXXXX\n-----END PRIVATE KEY-----"
```

这不是密钥文件的路径。 用途 `<URL>&#58;密钥文件` 如果你需要引用文件系统而不是内嵌密钥。

此设置包含敏感信息。 不要将其写入本地会提交到仓库的 `.npmrc` 文件。

### &lt;URL&gt;&#58;key

添加于：v10.25.0

为指定的注册表 URL 定义一个内联客户端密钥。

```sh
//registry.example.com/:key=-----BEGIN PRIVATE KEY-----...-----END PRIVATE KEY-----
```

### &lt;URL&gt;&#58;密钥文件

定义访问指定注册源时使用的客户端密钥文件的路径。 示例：

```sh
//registry.npmjs.org/:keyfile=server-key.pem
```
