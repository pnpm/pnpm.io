---
id: env
title: "pnpm env <cmd>"
---

Manages the Node.js environment.

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/84-MzN_0Cng" title="The pnpm patch command demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Commands

### use

Install and use the specified version of Node.js

Install the LTS version of Node.js:

```
pnpm env use --global lts
pnpm env use --global argon
```

Install Node.js v16:

```
pnpm env use --global 16
```

Install a prerelease version of Node.js:

```
pnpm env use --global nightly
pnpm env use --global rc
pnpm env use --global 16.0.0-rc.0
pnpm env use --global rc/14
```

Install the latest version of Node.js:

```
pnpm env use --global latest
```

### remove, rm

Added in v7.10.0

Removes the specified version of Node.JS.

Usage example:

```
pnpm env remove --global 14.0.0
```

## Options

### --global, -g

The changes are made systemwide.

