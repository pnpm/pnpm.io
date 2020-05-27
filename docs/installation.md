---
id: installation
title: Installation
---

The easiest way to install pnpm is using npm:

```sh
npm install -g pnpm
```

Other solutions are:

Using a [standalone script](https://github.com/pnpm/self-installer#readme):

```sh
curl -L https://raw.githubusercontent.com/pnpm/self-installer/master/install.js | node
```

On Windows (PowerShell):

```powershell
(Invoke-WebRequest 'https://raw.githubusercontent.com/pnpm/self-installer/master/install.js').Content | node
```

Via npx:

```sh
npx pnpm add -g pnpm
```

Once you first installed pnpm, you can upgrade it using pnpm (but see the NOTE below):

```sh
pnpm add -g pnpm
```

**NOTE!** There are [some issues](https://github.com/pnpm/pnpm/issues/1203) with `pnpm add -g <pkg>` on some systems. Any help is appreciated.

> Do you wanna use pnpm on CI servers? See: [Continuous Integration](continuous-integration).
