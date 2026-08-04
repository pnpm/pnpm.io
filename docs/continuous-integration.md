---
id: continuous-integration
title: Continuous Integration
---

pnpm can easily be used in various continuous integration systems.

:::note

In all the provided configuration files the store is cached. However, this is not required, and it is not guaranteed that caching the store will make installation faster. So feel free to not cache the pnpm store in your job.

:::

:::important

Only cache pnpm's store and cache directories in locations writable by trusted jobs. Do not let untrusted CI jobs write to a store or metadata cache that trusted jobs later restore. These directories are trusted caches; see the [`storeDir`](./settings/store.md#storedir) and [`cacheDir`](./settings/other.md#cachedir) settings for details.

:::

:::tip Lockfile behavior in CI

When pnpm detects that it is running in CI, it switches to frozen-lockfile mode automatically. Since v11, pnpm also fails on incompatible lockfiles in CI — if the lockfile was written by a newer pnpm major version, the install will error out instead of silently rewriting it. Upgrade your CI pnpm version to match the one used to generate the lockfile.

:::

## AppVeyor

On [AppVeyor], you can use pnpm for installing your dependencies by adding this
to your `appveyor.yml`:

```yaml title="appveyor.yml"
install:
  - ps: Install-Product node $env:nodejs_version
  - npm install --global corepack@latest
  - corepack enable
  - corepack prepare pnpm@latest-11 --activate
  - pnpm install
```

[AppVeyor]: https://www.appveyor.com

## Azure Pipelines

On Azure Pipelines, you can use pnpm for installing and caching your dependencies by adding this to your `azure-pipelines.yml`:

```yaml title="azure-pipelines.yml"
variables:
  pnpm_config_cache: $(Pipeline.Workspace)/.pnpm-store

steps:
  - task: Cache@2
    inputs:
      key: 'pnpm | "$(Agent.OS)" | pnpm-lock.yaml'
      path: $(pnpm_config_cache)
    displayName: Cache pnpm

  - script: |
      npm install --global corepack@latest
      corepack enable
      corepack prepare pnpm@latest-11 --activate
      pnpm config set store-dir $(pnpm_config_cache)
    displayName: "Setup pnpm"

  - script: |
      pnpm install
      pnpm run build
    displayName: "pnpm install and build"
```

## Bitbucket Pipelines

You can use pnpm for installing and caching your dependencies:

```yaml title=".bitbucket-pipelines.yml"
definitions:
  caches:
    pnpm: $BITBUCKET_CLONE_DIR/.pnpm-store

pipelines:
  pull-requests:
    "**":
      - step:
          name: Build and test
          image: node:24.14.1
          script:
            - npm install --global corepack@latest
            - corepack enable
            - corepack prepare pnpm@latest-11 --activate
            - pnpm install
            - pnpm run build # Replace with your build/test…etc. commands
          caches:
            - pnpm
```

## CircleCI

On CircleCI, you can use pnpm for installing and caching your dependencies by adding this to your `.circleci/config.yml`:

```yaml title=".circleci/config.yml"
version: 2.1

jobs:
  build: # this can be any name you choose
    docker:
      - image: node:18
    resource_class: large
    parallelism: 10

    steps:
      - checkout
      - restore_cache:
          name: Restore pnpm Package Cache
          keys:
            - pnpm-packages-{{ checksum "pnpm-lock.yaml" }}
      - run:
          name: Install pnpm package manager
          command: |
            npm install --global corepack@latest
            corepack enable
            corepack prepare pnpm@latest-11 --activate
            pnpm config set store-dir .pnpm-store
      - run:
          name: Install Dependencies
          command: |
            pnpm install
      - save_cache:
          name: Save pnpm Package Cache
          key: pnpm-packages-{{ checksum "pnpm-lock.yaml" }}
          paths:
            - .pnpm-store
```

## GitHub Actions

On GitHub Actions, you can use pnpm for installing and caching your dependencies
like so (belongs in `.github/workflows/NAME.yml`):

```yaml title=".github/workflows/NAME.yml"
name: pnpm Example Workflow
on:
  push:

jobs:
  build:
    runs-on: ubuntu-24.04
    strategy:
      matrix:
        node-version: [24]
    steps:
      - uses: actions/checkout@v6
      - name: Install pnpm and Node.js
        uses: pnpm/setup@c9883cc79df532ad1a7b81bf9ab944ceb090d65c # v2.0.0
        with:
          runtime: node@${{ matrix.node-version }}
          cache: true
```

[`pnpm/setup`][pnpm-setup] installs pnpm, then uses it to install the requested
runtime, so no separate `actions/setup-node` step is needed. It also runs `pnpm
install` for you, and `cache: true` caches the pnpm store between runs. Set
`install: false` if you would rather run the install yourself.

The pnpm version comes from the `packageManager` or `devEngines.packageManager`
field of your `package.json`, so the workflow never needs updating when you
change it. Add a `version` input if your `package.json` declares neither.

[pnpm-setup]: https://github.com/pnpm/setup

## GitLab CI

On GitLab, you can use pnpm for installing and caching your dependencies
like so (belongs in `.gitlab-ci.yml`):

```yaml title=".gitlab-ci.yml"
stages:
  - build

build:
  stage: build
  image: node:24.14.1
  before_script:
    - npm install --global corepack@latest
    - corepack enable
    - corepack prepare pnpm@latest-11 --activate
    - pnpm config set store-dir .pnpm-store
  script:
    - pnpm install # install dependencies
  cache:
    key:
      files:
        - pnpm-lock.yaml
    paths:
      - .pnpm-store
```

## Jenkins

You can use pnpm for installing and caching your dependencies:

```title="Jenkinsfile"
pipeline {
    agent {
        docker {
            image 'node:lts-bullseye-slim'
            args '-p 3000:3000'
        }
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install --global corepack@latest'
                sh 'corepack enable'
                sh 'corepack prepare pnpm@latest-11 --activate'
                sh 'pnpm install'
            }
        }
    }
}
```

## Semaphore

On [Semaphore], you can use pnpm for installing and caching your dependencies by
adding this to your `.semaphore/semaphore.yml` file:

```yaml title=".semaphore/semaphore.yml"
version: v1.0
name: Semaphore CI pnpm example
agent:
  machine:
    type: e1-standard-2
    os_image: ubuntu2404
blocks:
  - name: Install dependencies
    task:
      jobs:
        - name: pnpm install
          commands:
            - npm install --global corepack@latest
            - corepack enable
            - corepack prepare pnpm@latest-11 --activate
            - checkout
            - cache restore node-$(checksum pnpm-lock.yaml)
            - pnpm install
            - cache store node-$(checksum pnpm-lock.yaml) $(pnpm store path)
```

[Semaphore]: https://semaphoreci.com

## Travis

On [Travis CI], you can use pnpm for installing your dependencies by adding this
to your `.travis.yml` file:

```yaml title=".travis.yml"
cache:
  npm: false
  directories:
    - "~/.pnpm-store"
before_install:
  - npm install --global corepack@latest
  - corepack enable
  - corepack prepare pnpm@latest-11 --activate
  - pnpm config set store-dir ~/.pnpm-store
install:
  - pnpm install
```

[Travis CI]: https://travis-ci.org
