---
id: npmrc
title: "身份验证 & 注册源设置 (.npmrc)"
---

此页面上的设置必须通过 `.npmrc` 文件进行配置。 pnpm 底层使用 npm CLI 进行发布，因此这些设置需要采用 npm 可以读取的格式。

有关如何加载 `.npmrc` 文件的详细信息，请参阅 [`pnpm config`](./cli/config.md) 命令。

对于可以在 `pnpm-workspace.yaml` 中配置的设置，请参阅 [设置 (pnpm-workspace.yaml)](./settings.md)。

## 注册源设置

### 注册源

- 默认值： **.https://registry.npmjs.org/**
- 类型：**url**

npm 包注册源地址 (包括末尾斜杠) 。

### @jsr\:registry

添加于：v10.9.0

- 默认值： **.https://npm.jsr.io/**
- 类型：**url**

[JSR] 包注册源的基础网址。

[JSR]: cli/add.md#install-from-the-jsr-registry

### &lt;scope&gt;&#58;registry

用于指定包的注册源范围 例如，设置 `@babel:registry=https://example.com/packages/npm/` 将在你使用 `pnpm add @babel/core` 或任何 `@babel` 范围的包时，该包将强制从 `https://example.com/packages/npm`
而不是默认注册源中获取。

## 认证设置

### &lt;URL&gt;&#58;_authToken

访问指定注册源时要使用的身份验证承载令牌。 示例：

```ini
//registry.npmjs.org/:_authToken=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

你还可以使用环境变量。 示例：

```ini
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

或者，你可以在完全不更改 `.npmrc` 下直接使用环境变量：

```
npm_config_//registry.npmjs.org/:_authToken=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### &lt;URL&gt;&#58;tokenHelper

令牌助手是输出身份验证令牌的可执行文件。 这可以用于 authToken 不是常量值而是定期刷新值的情况，其中脚本或其他工具可以使用现有的刷新令牌来获取新的访问令牌。

助手路径的配置必须是绝对路径，没有参数。 为了安全起见，只允许在用户 `.npmrc` 中设置该值。 否则，项目可以在项目的本地 `.npmrc` 中放置一个值并运行任意可执行文件。

为默认注册表设置令牌助手：

```ini
tokenHelper=/home/ivan/token-generator
```

为指定注册源设置令牌助手：

```
//registry.corp.com:tokenHelper=/home/ivan/token-generator
```

## 代理设置

### https-proxy

- 默认值： **null**
- 类型：**url**

用于传出 HTTPS 请求的代理。 如果设置了 `HTTPS_PROXY`、 `https_proxy`、`HTTP_PROXY` 或 `http_proxy` 环境变量，将使用环境变量的值。

如果你的代理 URL 包含用户名和密码，请确保对它们进行 URL 编码。
例如：

```ini
https-proxy=https://use%21r:pas%2As@my.proxy:1234/foo
```

不要对用户名和密码之间的冒号 (`:`) 进行编码。

### http-proxy

### proxy

- 默认值： **null**
- 类型：**url**

用于传出 HTTP 请求的代理。 如果设置了 HTTP_PROXY 或 http_proxy 环境变量，底层请求库将遵循代理设置。

### local-address

- 默认值：**undefined**
- 类型：**IP 地址**

与 npm 注册源建立连接时要使用的本地接口的 IP 地址。

### maxsockets

- 默认值：**网络并发 x 3**
- 类型：**Number**

每个源(由协议/主机/端口号组合而成)允许的最大连接数。

### noproxy

- 默认值： **null**
- 类型：**字符串**

一个由逗号分割的域名字符串，表示不应该被使用的代理

## SSL 设置

### strict-ssl

- 默认值：**true**
- 类型：**Boolean**

通过 HTTPS 向registry发出请求时是否进行 SSL 密钥验证。

另请参阅 `ca` 配置项。

## 证书设置

### ca

- 默认值：**npm CA 证书**
- 类型：**String，Array 或 null**

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

更多信息可见 `strict-ssl` 设置

### cafile

- 默认值： **null**
- 类型：**路径**

包含一个或多个 CA 证书的文件路径。 类似于 `ca` 设置，但允许多个CA， 此外，
CA 信息将存储在一个文件中，而不是通过 CLI 指定。

### &lt;URL&gt;&#58;CA文件

定义访问指定注册源时使用的证书颁发机构文件的路径。 示例：

```sh
//registry.npmjs.org/:cafile=ca-cert.pem
```

### &lt;URL&gt;&#58;ca

添加于：v10.25.0

为指定的注册源定义一个内联证书颁发机构证书。
该值必须采用 PEM 编码，就像全局 `ca` 设置一样，但它只对匹配的注册表 URL 适用
。

```sh
//registry.example.com/:ca=-----BEGIN CERTIFICATE-----...-----END CERTIFICATE-----
```

### cert

- 默认值： **null**
- 类型：**字符串**

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

- 默认值： **null**
- 类型：**string**

访问注册源时要传递的客户端密钥。 值应为 PEM 格式（也称 "Base-64 encoded X.509 (.CER)"）。 示例：

```sh
key="-----BEGIN PRIVATE KEY-----\nXXXX\nXXXX\n-----END PRIVATE KEY-----"
```

这不是密钥文件的路径。 如果你需要引用文件系统而不是内嵌密钥，使用 `<URL>&#58;#;密钥文件` 。

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
