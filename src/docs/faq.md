# Frequently Asked Questions

## Why does my `node_modules` folder use disk space if packages are stored in a global store?

pnpm creates [hard links](https://en.wikipedia.org/wiki/Hard_link) from the global store to project's `node_modules` folders.
Hard links point to the same place on the disk where the original files are.
So, for example, if you have `foo` in your project as a dependency and it occupies 1MB of space,
then it will look like it occupies 1MB of space in the project's `node_modules` folder and
the same amount of space in the global store. However, that 1MB is *the same space* on the disk
addressed from two different locations. So in total `foo` occupies 1MB,
not 2MB.

For more on this subject:

* [Why do hard links seem to take the same space as the originals?](https://unix.stackexchange.com/questions/88423/why-do-hard-links-seem-to-take-the-same-space-as-the-originals)
* [A thread from the pnpm chat room](https://gist.github.com/zkochan/106cfef49f8476b753a9cbbf9c65aff1)
* [An issue in the pnpm repo](https://github.com/pnpm/pnpm/issues/794)

## Does it work on Windows? It is harder to create symlinks on Windows

Using symlinks on Windows is problematic indeed. That is why pnpm uses junctions instead of symlinks on Windows OS.

## Does it work on Windows? Nested `node_modules` approach is basically incompatible with Windows

Early versions of npm had issues because of nesting all `node_modules` (see [Node's nested node_modules approach is basically incompatible with Windows](https://github.com/nodejs/node-v0.x-archive/issues/6960)). However, pnpm does not create deep folders, it stores all packages flatly and uses symlinks to create the dependency tree structure.

## What about circular symlinks?

Although pnpm uses symlinks to put dependencies into `node_modules` folders, circular symlinks are avoided because parent packages are placed into the same `node_modules` folder in which their dependencies are. So `foo`'s dependencies are not in `foo/node_modules` but `foo` is in `node_modules/foo`, together with its own dependencies.

## Why have hard links at all? Why not symlink directly to the global store?

One package can have different sets of dependencies on one machine.

In project **A** `foo@1.0.0` can have dependency resolved to `bar@1.0.0` but in project **B** the same dependency of `foo` might
resolve to `bar@1.1.0`. So pnpm hard links `foo@1.0.0` to every project where it is used, in order to create different sets
of dependencies for it.

Direct symlinking to the global store would work with Node's `--preserve-symlinks` flag. But `--preserve-symlinks` comes
with a bunch of different issues, so we decided to stick with hard links.
For more details about why this decision was made, see: https://github.com/nodejs/node-eps/issues/46.
