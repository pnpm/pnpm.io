---
id: installation
title: Installation
original_id: installation
---

The easiest way to install pnpm is using npm:

```sh
npm install -g pnpm
```

Other solutions are:

Using a standalone script:

```sh
curl -L https://pnpm.js.org/pnpm.js | node - add --global pnpm
```

On Windows (PowerShell):

```powershell
(Invoke-WebRequest 'https://pnpm.js.org/pnpm.js' -UseBasicParsing).Content | node - add --global pnpm
```

Via npx:

```sh
npx pnpm add -g pnpm
```

Once you first installed pnpm, you can upgrade it using pnpm:

```sh
pnpm add -g pnpm
```

> Do you wanna use pnpm on CI servers? See: [Continuous Integration](continuous-integration).

## Compatibility

Here is a list of past pnpm versions with respective Node.js version support.

| Node.js | pnpm |
| -- | -- |
| 4 | 1 |
| 6 | 2 |
| 8 | 3 |
| 10, 12, 14 | 4, 5 |
