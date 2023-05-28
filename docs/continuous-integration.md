---
id: continuous-integration
title: Continuous Integration
---

pnpm can easily be used in various continuous integration systems.

:::note

In all the provided configuration files the store is cached. However, this is not required, and it is not guaranteed that caching the store will make installation faster. So feel free to not cache the pnpm store in your job.

:::

## Travis

On [Travis CI], you can use pnpm for installing your dependencies by adding this
to your `.travis.yml` file:

```yaml title=".travis.yml"
cache:
  npm: false
  directories:
    - "~/.pnpm-store"
before_install:
  - corepack enable
  - corepack prepare pnpm@latest-8 --activate
  - pnpm config set store-dir ~/.pnpm-store
install:
  - pnpm install
```

[Travis CI]: https://travis-ci.org

## Semaphore

On [Semaphore], you can use pnpm for installing and caching your dependencies by
adding this to your `.semaphore/semaphore.yml` file:

```yaml title=".semaphore/semaphore.yml"
version: v1.0
name: Semaphore CI pnpm example
agent:
  machine:
    type: e1-standard-2
    os_image: ubuntu1804
blocks:
  - name: Install dependencies
    task:
      jobs:
        - name: pnpm install
          commands:
            - corepack enable
            - corepack prepare pnpm@latest-8 --activate
            - checkout
            - cache restore node-$(checksum pnpm-lock.yaml)
            - pnpm install
            - cache store node-$(checksum pnpm-lock.yaml) $(pnpm store path)
```

[Semaphore]: https://semaphoreci.com

## AppVeyor

On [AppVeyor], you can use pnpm for installing your dependencies by adding this
to your `appveyor.yml`:

```yaml title="appveyor.yml"
install:
  - ps: Install-Product node $env:nodejs_version
  - corepack enable
  - corepack prepare pnpm@latest-8 --activate
  - pnpm install
```

[AppVeyor]: https://www.appveyor.com

## GitHub Actions

On GitHub Actions, you can use pnpm for installing and caching your dependencies
like so (belongs in `.github/workflows/NAME.yml`):

```yaml title=".github/workflows/NAME.yml"
name: pnpm Example Workflow
on:
  push:
jobs:
  build:
    runs-on: ubuntu-20.04
    strategy:
      matrix:
        node-version: [15]
    steps:
    - uses: actions/checkout@v3
    - uses: pnpm/action-setup@v2
      with:
        version: 8
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'pnpm'
    - name: Install dependencies
      run: pnpm install
```

:::note

Caching packages dependencies with `actions/setup-node@v2` requires you to install pnpm with version **6.10+**.

:::

## GitLab CI

On GitLab, you can use pnpm for installing and caching your dependencies
like so (belongs in `.gitlab-ci.yml`):

```yaml title=".gitlab-ci.yml"
stages:
  - build

build:
  stage: build
  image: node:16.20.0
  before_script:
    - corepack enable
    - corepack prepare pnpm@latest-8 --activate
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
          image: node:16.20.0
          script:
            - corepack enable
            - corepack prepare pnpm@latest-8 --activate
            - pnpm install
            - pnpm run build # Replace with your build/test…etc. commands
          caches:
            - pnpm
```

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
      corepack enable
      corepack prepare pnpm@latest-8 --activate
      pnpm config set store-dir $(pnpm_config_cache)
    displayName: "Setup pnpm"

  - script: |
      pnpm install
      pnpm run build
    displayName: "pnpm install and build"
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
            corepack enable
            corepack prepare pnpm@latest-8 --activate
      - run:
          name: Install Dependencies
          command: |
            pnpm install
      - save_cache:
          name: Save pnpm Package Cache
          key: pnpm-packages-{{ checksum "pnpm-lock.yaml" }}
          paths:
            - node_modules
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
                sh 'corepack enable'
                sh 'corepack prepare pnpm@latest-8 --activate'
                sh 'pnpm install'
            }
        }
    }
}
```
