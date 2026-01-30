---
id: test
title: pnpm test
---

Aliases: `run test`, `t`, `tst`

Runs an arbitrary command specified in the package's `test` property of its
`scripts` object. 

The intended usage of the property is to specify a command that runs unit or
integration testing for your program.


## Passing custom options

If you want to pass options to Jest, use the `pnpm run test` command and append any needed options.

For instance, if you want to run a single test in a single file, run:

```sh
pnpm --filter core run test test/lockfile.ts -t "lockfile has dev deps even when installing for prod only"
```
