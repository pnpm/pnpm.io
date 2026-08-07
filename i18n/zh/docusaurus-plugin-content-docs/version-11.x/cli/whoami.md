---
id: whoami
title: pnpm whoami
---

添加于：v11.0.0

Print the username associated with the current registry credentials.

```sh
pnpm whoami [--registry <url>]
```

If you are not logged in, the command exits with an error. Use [`pnpm login`](./login.md) to authenticate first.

## 配置项

### --registry &lt;url\>

The registry to check. 默认使用已配置的默认注册源。
