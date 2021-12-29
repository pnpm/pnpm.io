---
title: The year 2021 for pnpm
author: Zoltan Kochan
authorURL: "http://twitter.com/zoltankochan"
authorImageURL: "https://gravatar.com/avatar/1f59f040fb37d5799e3879fa678c2373?s=48"
---

It is the end of the year and it was a good year for pnpm, so let's see how it went.

## Usage

### Download stats

My goal this year was to beat Bower by the number of downloads. We were able to achieve this goal [in November](https://npm-stat.com/charts.html?package=pnpm&package=bower&from=2021-01-01&to=2021-12-29)!

![](/img/blog/pnpm-vs-bower-stats.png)

pnpm was downloaded about [3 times more](https://npm-stat.com/charts.html?package=pnpm&from=2016-12-01&to=2021-12-29) in 2021 than in 2020:

![](/img/blog/download-stats-2021.png)

:::note

These stats don't even measure all the different ways that pnpm may be installed!
They only measure the downloads of the [pnpm npm package](https://www.npmjs.com/package/pnpm). However, this year we also added compiled binary versions of pnpm, which are shipped differently.

:::

### Docs visits

We collect some unpersonalized stats from our docs using Google Analytics.
In 2021, sometimes we had more than 2000 unique visitors a week.

![](/img/blog/ga-unique-visits-2021.png)

Most of our users are from the United States and China.

![](/img/blog/countries-2021.png)

### GitHub stars

Our [main GitHub repository](https://github.com/pnpm/pnpm) received +5,000 stars this year.

![](/img/blog/stars-2021.png)

### New users

Our biggest new user this year is [Bytedance](https://github.com/pnpm/pnpm.github.io/pull/89) (the company behind TikTok).

Also, many great open-source projects started to use pnpm. Some switched to pnpm because of its great support of monorepos:

* [Vue](https://github.com/vuejs/vue-next)
* [Vite](https://github.com/vitejs/vite)
* and [others](https://github.com/vitejs/vite).

Some switched because they like how efficient, fast, and beautiful pnpm is:

* [Autoprefixer](https://twitter.com/Autoprefixer/status/1476226146488692736)
* [PostCSS](https://twitter.com/PostCSS/status/1470438664006258701)
* [Browserslist](https://twitter.com/Browserslist/status/1468264308308156419)

## Feature Highlights

### New lockfile format (since [v6.0.0](https://github.com/pnpm/pnpm/releases/tag/v6.0.0))

One of the first and most important changes this year was the new `pnpm-lock.yaml` format. This was a breaking change, so we had to release v6. But it was a success. The old lockfile was causing Git conflicts frequently. Since the new format was introduced, we did not receive any complaints about Git conflicts.

### Managing Node.js versions (since [v6.12.0](https://github.com/pnpm/pnpm/releases/tag/v6.12.0))

We shipped a new command (`pnpm env`) that allows to manage Node.js versions. So you may use pnpm instead of Node.js version managers like nvm or Volta.

Also, pnpm is shipped as a standalone executable, so you can run it even with no Node.js preinstalled on the system.

### Injecting local dependencies (since [v6.20.0](https://github.com/pnpm/pnpm/releases/tag/v6.20.0))

You may "inject" a local dependency. By default, local dependencies are symlinked to `node_modules` but with this new feature you may instruct pnpm to hard link the files of the package instead.

### Improved reporting of peer dependency issues (since [v6.24.0](https://github.com/pnpm/pnpm/releases/tag/v6.24.0))

Peer dependency issues used to be printed as plain text and it was hard to understand them. They are now all grouped and printed in a nice hierarchy structure.

## The Competition

### Yarn

Yarn added a pnpm linker in [v3.1](https://dev.to/arcanis/yarn-31-corepack-esm-pnpm-optional-packages--3hak#new-install-mode-raw-pnpm-endraw-). So Yarn can create a similar node-modules directory structure to the one that pnpm create.

Also, the Yarn team plans to implement a content-addressable storage to be more disk space efficient.

### npm

The npm team decided to also adopt the symlinked node-modules directory structure that pnpm uses (related [RFC](https://github.com/npm/rfcs/blob/main/accepted/0042-isolated-mode.md)).

### Others

[Bun](https://twitter.com/jarredsumner/status/1473416431291174912/photo/1) written in Zig and [Volt](https://github.com/voltpkg/volt) written in Rust both claim to be faster than npm/Yarn/pnpm. I did not benchmark this new package managers yet.

## Future Plans

Faster, better, best.
