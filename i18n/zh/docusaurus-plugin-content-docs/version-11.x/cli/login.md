---
id: login
title: pnpm login
---

添加于：v11.0.0

别名：`adduser`

使用 npm 注册源进行身份验证。

```sh
pnpm login [--registry <url>] [--scope <scope>]
```

支持使用二维码进行网页登录，以及传统的用户名/密码验证。

Auth tokens are written to [`<pnpm config>/auth.ini`](../npmrc.md#auth-file-locations).

## 配置项

### --registry &lt;url\>

用于身份验证的注册源。 默认使用已配置的默认注册源。

### --scope &lt;scope\>

将凭据与指定范围关联。 将使用该范围的注册源。
