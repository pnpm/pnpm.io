---
id: intro
title: pnpm
---

[![npm version](https://img.shields.io/npm/v/pnpm.svg)](https://www.npmjs.com/package/pnpm)
[![GitHub stars](https://img.shields.io/github/stars/pnpm/pnpm.svg?style=social&label=Stars)](https://github.com/pnpm/pnpm)
[![Twitter Follow](https://img.shields.io/twitter/follow/pnpmjs.svg?style=social&label=Follow)](https://twitter.com/pnpmjs)
[![Join the chat at https://gitter.im/pnpm/pnpm](https://badges.gitter.im/pnpm/pnpm.svg)](https://gitter.im/pnpm/pnpm?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

> Fast, disk space efficient package manager

Features:

* **Fast.** Faster than npm and Yarn.
* **Efficient.** One version of a package is saved only ever once on a disk.
* **Deterministic.** Has a lockfile called `shrinkwrap.yaml`.
* **Strict.** A package can access only dependencies that are specified in its `package.json`.
* **Works everywhere.** Works on Windows, Linux and OS X.
* **Hooks.** `node_modules` is not a black box anymore.
* **Aliases.** Install different versions of the same package or import it using a different name.

Like this project? Let people know with a [tweet](https://bit.ly/tweet-pnpm).

## Background

pnpm uses hard links and symlinks to save one version of a module only ever once on a disk.
When using npm or Yarn for example, if you have 100 projects using the same version
of lodash, you will have 100 copies of lodash on disk. With pnpm, lodash will be saved in a
single place on the disk and a hard link will put it into the `node_modules` where it should
be installed.

As a result, you save gigabytes of space on your disk and you have a lot faster installations!
If you'd like more details about the unique `node_modules` structure that pnpm creates and
why it works fine with the Node.js ecosystem, read this small article: [Why should we use pnpm?](https://www.kochan.io/nodejs/why-should-we-use-pnpm.html)
