---
title: Node-Modules configuration options with pnpm
author: Zoltan Kochan
authorURL: "http://twitter.com/zoltankochan"
authorImageURL: "https://gravatar.com/avatar/1f59f040fb37d5799e3879fa678c2373?s=48"
---

There are many ways to create a node_modules directory.
Your goal must be to create the most strict one but if that is not possible,
there are options to make a loose node_modules as well.

<!--truncate-->

## The default setup

By default, pnpm v5 will create a semi-strict node_modules. Semi-strict means that your application will only be able to require packages that are added as dependencies to `package.json` (with a few exceptions). However, your dependencies will be able to access any packages.

The default configuration looks like this:

```ini
; All packages are hoisted to node_modules/.pnpm/node_modules
hoist-pattern[]=*

; All types are hoisted to the root in order to make TypeScript happy
public-hoist-pattern[]=*types*

; All ESLint-related packages are hoisted to the root as well
public-hoist-pattern[]=*eslint*
```

## Plug'n'Play. The strictest configuration

pnpm supports [Yarn's Plug'n'Play](https://yarnpkg.com/features/pnp) since v5.9. With PnP, both your application and the dependencies of your application will have access only to their declared dependencies. This is even stricter then setting `hoist=false` because inside a monorepo, your application will not be able to access even the dependencies of the root project.

To use Plug'n'Play, set these settings:

```ini
node-linker=pnp
symlink=false
```

## A strict, traditional modules directory

If you are not ready to use PnP yet, you can still be strict and only allow packages to access their own dependencies by setting the hoist configuration to false:

```ini
hoist=false
```

However, if some of your dependencies are trying to access packages that they don't have in dependencies, you have two options:

1. Create a `pnpmfile.js` and use a [hook](/pnpmfile) to add the missing dependency to the package's manifest.

2. Add a pattern to the `hoist-pattern` setting. For instance, if the not found module is `babel-core`, add the following setting to `.npmrc`:

    ```ini
    hoist-pattern[]=babel-core
    ```

## The worst case - hoisting to the root

Some tools might not work even with the default configuration of pnpm, which hoists everything to the root of the virtual store and some packages to the root. In this case, you can hoist either everything or a subset of dependencies to the root of the modules directory.

Hoisting everything to the root of node_modules:

```ini
shamefully-hoist=true
```

Hoisting only packages that match a pattern:

```ini
public-hoist-pattern[]=babel-*
```
