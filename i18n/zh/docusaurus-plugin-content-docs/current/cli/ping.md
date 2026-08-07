---
id: ping
title: pnpm ping
---

添加于：v11.0.0

Ping the configured registry to verify connectivity.

```sh
pnpm ping [--registry <url>]
```

On success, the registry's response is printed. This is useful for quickly confirming that the current machine can reach the registry without installing or publishing anything.

## 配置项

### --registry &lt;url\>

The registry to ping. 默认使用已配置的默认注册源。
