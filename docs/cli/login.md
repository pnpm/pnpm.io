---
id: login
title: pnpm login
---

Added in: v11.0.0

Aliases: `adduser`

Authenticate with an npm registry.

```sh
pnpm login [--registry <url>] [--scope <scope>]
```

Supports web-based login with QR code as well as classic username/password authentication.

## Options

### --registry &lt;url\>

The registry to authenticate with. Defaults to the configured default registry.

### --scope &lt;scope\>

Associate the credentials with the specified scope. The registry for that scope will be used.
