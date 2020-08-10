---
id: version-5.5-installation
title: Installation
original_id: installation
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

Once you first installed pnpm, you can upgrade it using pnpm:

```sh
pnpm add -g pnpm
```

> Do you wanna use pnpm on CI servers? See: [Continuous Integration](continuous-integration).
