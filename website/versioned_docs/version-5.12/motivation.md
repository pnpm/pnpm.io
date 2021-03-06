---
id: motivation
title: Motivation
original_id: motivation
---

pnpm uses a content-addressable filesystem to store all files from all module directories on a disk.
When using npm or Yarn, if you have 100 projects using lodash, you will have 100 copies of lodash on disk.
With pnpm, lodash will be stored in a content-addressable storage, so:

1. If you depend on different versions of lodash, only the files that differ are added to the store.
  If lodash has 100 files, and a new version has a change only in one of those files,
  `pnpm update` will only add 1 new file to the storage.
1. All the files are saved in a single place on the disk. When packages are installed, their files are hard-linked
  from that single place consuming no additional disk space.

As a result, you save gigabytes of space on your disk and you have a lot faster installations!
If you'd like more details about the unique `node_modules` structure that pnpm creates and
why it works fine with the Node.js ecosystem, read this small article: [Flat node_modules is not the only way](/blog/2020/05/27/flat-node-modules-is-not-the-only-way).
