---
id: logout
title: pnpm logout
---

添加于：v11.0.0

Log out of an npm registry. Revokes the authentication token on the registry and removes it from the local auth config file.

```sh
pnpm logout [--registry <url>] [--scope <scope>]
```

If a scope is provided, the registry associated with that scope is used.

The token is removed from [`<pnpm config>/auth.ini`](../npmrc.md#auth-file-locations).

## 配置项

### --registry &lt;url\>

The registry to log out from. 默认使用已配置的默认注册源。

### --scope &lt;scope\>

Use the registry associated with the given scope.
