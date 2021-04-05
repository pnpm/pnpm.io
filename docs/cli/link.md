---
id: link
title: pnpm link
---

Aliases: `ln`

Makes the current local package accessible system-wide, or in another location.

```text
pnpm link <dir>
pnpm link --global
pnpm link --global <pkg>
```

## Options

### --dir &lt;dir\>, -C

* **Default**: Current working directory
* **Type**: Path string

Changes the link location to `<dir>`.
