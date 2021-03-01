---
id: version-5.18-continuous-integration
title: Continuous Integration
original_id: continuous-integration
---

pnpm can easily be used in various continuous integration systems.

## Tips
### Speeding-up
You can speed things up by:
##### - Disable store signature verification
```shell
pnpm set verify-store-integrity false
```

## Travis

On [Travis CI](https://travis-ci.org/), you can use pnpm for installing your dependencies by adding this to your `.travis.yml` file:

```yaml
cache:
  npm: false
  directories:
    - "~/.pnpm-store"
before_install:
  - curl -L https://unpkg.com/@pnpm/self-installer | node
  - pnpm config set store-dir ~/.pnpm-store
install:
  - pnpm install
```

## Semaphore

On [Semaphore](https://semaphoreci.com), you can use pnpm for installing and caching your dependencies by adding this to your `.semaphore/semaphore.yml` file:

```yaml
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
            - curl -L https://unpkg.com/@pnpm/self-installer | node
            - checkout
            - cache restore node-modules-$SEMAPHORE_GIT_BRANCH-$(checksum package-lock.json),node-modules-$SEMAPHORE_GIT_BRANCH,node-modules-master
            - pnpm install
            - cache store node-modules-$SEMAPHORE_GIT_BRANCH-$(checksum package-lock.json) node_modules
```

## AppVeyor

On [AppVeyor](https://www.appveyor.com/), you can use pnpm for installing your dependencies by adding this to your `appveyor.yml`:

```yaml
install:
  - ps: Install-Product node $env:nodejs_version
  - curl -L https://unpkg.com/@pnpm/self-installer | node
  - pnpm install
```

## Sail CI

On [Sail CI](https://sail.ci/), you can use pnpm for installing your dependencies by adding this to your `.sail.yml` file:

```yaml
install:
  image: znck/pnpm:latest
  command:
    - pnpm
  args:
    - install
```
To get the exact Node version and pnpm version you require you can always make your own Docker image and push to [Docker Hub](https://hub.docker.com/).

## GitHub Actions

On [GitHub](https://github.com/), this is an example of how pnpm can be used with GitHub Actions.
This config locate in`.github/workflows/[yourworkflowname].yaml`:

```yaml
name: Pnpm Example Workflow
on:
  push:
    branches: 
    - main
jobs:
  build:
    runs-on: ubuntu-20.04
    strategy:
      matrix:
        node-version: [15]
    steps:
    - uses: actions/checkout@main
    - name: Use Node.js ${{ matrix.node-version }}.x
      uses: actions/setup-node@v1
      with:
        node-version: ${{ matrix.node-version }}
        check-latest: true
    - name: Cache ~/.pnpm-store
      uses: actions/cache@main
      env:
        cache-name: cache-pnpm-store
      with:
        path: ~/.pnpm-store
        key: ${{ runner.os }}-${{ matrix.node-version }}-build-${{ env.cache-name }}-${{ hashFiles('**/pnpm-lock.yaml') }}
        restore-keys: |
          ${{ runner.os }}-${{ matrix.node-version }}-build-${{ env.cache-name }}-
          ${{ runner.os }}-${{ matrix.node-version }}-build-
          ${{ runner.os }}-
    - name: Install pnpm
      run: npm i -g pnpm
    - name: Npm Build
      run: |
        pnpm i
```

> Using `actions/setup-node@v2` you need to install with [root permissions](https://github.com/actions/setup-node/issues/177), eg:`sudo `
