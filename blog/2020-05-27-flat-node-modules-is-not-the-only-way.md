---
title: Flat node_modules is not the only way
authors: zkochan
---

New users of pnpm frequently ask me about the weird structure of `node_modules` that pnpm creates. Why is it not flat? Where are all the sub-dependencies?

<!--truncate-->

> I am going to assume that readers of the article are already familiar with flat `node_modules` created by npm and Yarn. If you don't understand why npm 3 had to start using flat `node_modules` in v3, you can find some prehistory in [Why should we use pnpm?](https://www.kochan.io/nodejs/why-should-we-use-pnpm.html).

So why is pnpm's `node_modules` unusual? Let's create two directories and run `npm add express` in one of them and `pnpm add express` in the other one. Here's the top of what you get in the first directory's `node_modules`:

```text
.bin
accepts
array-flatten
body-parser
bytes
content-disposition
cookie-signature
cookie
debug
depd
destroy
ee-first
encodeurl
escape-html
etag
express
```

You can see the whole directory [here](https://github.com/zkochan/comparing-node-modules/tree/master/npm-example/node_modules).

And this is what you get in the `node_modules` created by pnpm:

```text
.pnpm
.modules.yaml
express
```

You can check it [here](https://github.com/zkochan/comparing-node-modules/tree/master/pnpm5-example/node_modules).

So where are all the dependencies? There is only one folder in the `node_modules` called `.pnpm` and a symlink called `express`. Well, we installed only `express`, so that is the only package that your application has to have access to 

> Read more about why pnpm's strictness is a good thing [here](https://medium.com/pnpm/pnpms-strictness-helps-to-avoid-silly-bugs-9a15fb306308)

Let's see what is inside `express`:

```text
▾ node_modules
  ▸ .pnpm
  ▾ express
    ▸ lib
      History.md
      index.js
      LICENSE
      package.json
      Readme.md
  .modules.yaml
```

`express` has no `node_modules`? Where are all the dependencies of `express`?

The trick is that `express` is just a symlink. When Node.js resolves dependencies, it uses their real locations, so it does not preserve symlinks. But where is the real location of `express`, you might ask?

Here: [node_modules/.pnpm/express@4.17.1/node_modules/express](https://github.com/zkochan/comparing-node-modules/tree/master/pnpm5-example/node_modules/.pnpm/express@4.17.1/node_modules/express).

OK, so now we know the purpose of the `.pnpm/` folder. `.pnpm/` stores all the packages in a flat folder structure, so every package can be found in a folder named by this pattern:

```text
.pnpm/<name>@<version>/node_modules/<name>
```

We call it the virtual store directory.

This flat structure avoids the long path issues that were caused by the nested `node_modules` created by npm v2 but keeps packages isolated unlike the flat `node_modules` created by npm v3,4,5,6 or Yarn v1.

Now let's look into the real location of `express`:

```text
  ▾ express
    ▸ lib
      History.md
      index.js
      LICENSE
      package.json
      Readme.md
```

Is it a scam? It still lacks `node_modules`! The second trick of pnpm's `node_modules` structure is that the dependencies of packages are on the same directory level as the real location of the dependent package. So dependencies of `express` are not in `.pnpm/express@4.17.1/node_modules/express/node_modules/` but in [.pnpm/express@4.17.1/node_modules/](https://github.com/zkochan/comparing-node-modules/tree/master/pnpm5-example/node_modules/.pnpm/express@4.17.1/node_modules):

```text
▾ node_modules
  ▾ .pnpm
    ▸ accepts@1.3.5
    ▸ array-flatten@1.1.1
    ...
    ▾ express@4.16.3
      ▾ node_modules
        ▸ accepts
        ▸ array-flatten
        ▸ body-parser
        ▸ content-disposition
        ...
        ▸ etag
        ▾ express
          ▸ lib
            History.md
            index.js
            LICENSE
            package.json
            Readme.md
```

All the dependencies of `express` are symlinks to appropriate directories in `node_modules/.pnpm/`. Placing dependencies of `express` one level up allows avoiding circular symlinks.

So as you can see, even though pnpm's `node_modules` structure seems unusual at first:

1. it is completely Node.js compatible
2. packages are nicely grouped with their dependencies

The structure is a little bit [more complex](/how-peers-are-resolved) for packages with peer dependencies but the idea is the same: using symlinks to create a nesting with a flat directory structure.
