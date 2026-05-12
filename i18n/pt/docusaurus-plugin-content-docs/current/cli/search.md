---
id: search
title: pnpm search
---

Added in: v11.0.0

Aliases: `s`, `se`, `find`

Search the registry for packages matching the given keywords.

```sh
pnpm search <keyword> [<keyword> ...]
```

## Exemplos

```sh
pnpm search webpack plugin
pnpm search @types/node
```

## Opções

### --json

Output search results in JSON format.

### --search-limit &lt;number\>

- Default: **20**

Maximum number of results to show.
