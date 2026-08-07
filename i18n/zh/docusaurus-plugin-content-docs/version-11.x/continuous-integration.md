---
id: continuous-integration
title: 持续集成
---

pnpm 可以很容易地用于各种持续集成系统。

:::note

在所有提供的配置文件中，存储都被缓存。 但是，这不是必需的，并且不能保证缓存的存储会使安装速度更快。 因此，不必在作业中缓存 pnpm 存储。

:::

:::tip Lockfile behavior in CI

当 pnpm 检测到它在 CI 中运行时，它会自动切换到 frozen-lockfile 模式。 自 v11 版本以来，pnpm 在 CI 中遇到不兼容的 lockfile 时也会失败——如果 lockfile 是由较新的 pnpm 主版本写入的，则安装会出错，而不是默默地重写它。 将你的 CI pnpm 版本升级到与生成 lockfile 时使用的版本一致。

:::

## AppVeyor

在 [AppVeyor] 上，在你的 `appveyor.yml` 中添加这些来使用 pnpm 安装你的依赖项：

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

在 Azure pipeline 中，你可以将以下内容添加到 `Azure-Pipelines.yml` 中，使用 pnpm 安装和缓存依赖项\`:

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

你可以使用 pnpm 来安装和缓存你的依赖项：

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

在 CircleCI 中，你可以将以下内容添加到 `.circleci/config.yml` 中，使用 pnpm 安装和缓存依赖项\`:

```yaml title=".circleci/config.yml"
version: 2.1

jobs:
  build: # 这可以是你选择的任意名称
    docker:
      - image: node:18
    resource_class: large
    parallelism: 10

    steps:
      - checkout
      - restore_cache:
          name: 恢复 pnpm 包缓存
          keys:
            - pnpm-packages-{{ checksum "pnpm-lock.yaml" }}
      - run:
          name: 安装 pnpm 包管理器
          command: |
            npm install --global corepack@latest
            corepack enable
            corepack prepare pnpm@next-11 --activate
            pnpm config set store-dir .pnpm-store
      - run:
          name: 安装依赖
          command: |
            pnpm install
      - save_cache:
          name: 保存 pnpm 包缓存
          key: pnpm-packages-{{ checksum "pnpm-lock.yaml" }}
          paths:
            - .pnpm-store
```

## GitHub Actions

在 GitHub Actions 上，你可以像这样使用 pnpm 安装和缓存你的依赖项（属于 ·.github/workflows/NAME.yml·）：

```yaml title=".github/workflows/NAME.yml"
name: pnpm 示例工作流
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
    - name: 安装 pnpm
        uses: pnpm/action-setup@8912a9102ac27614460f54aedde9e1e7f9aec20d # v6.0.5
      with:
        version: 11
    - name: 使用 Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v6
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'pnpm'
    - name: 安装依赖
      run: pnpm install
```

## GitLab CI

在 Gitlab 上，你可以像这样使用 pnpm 来安装和缓存你的依赖项（在 `.gitlab-ci.yml` 中）：

```yaml title=".gitlab-ci.yml"
stages:
  - build

build:
  stage: build
  image: node:24.14.1
  before_script:
    - npm install --global corepack@latest
    - corepack enable
    - corepack prepare pnpm@next-11 --activate
    - pnpm config set store-dir .pnpm-store
  script:
    - pnpm install # 安装依赖
  cache:
    key:
      files:
        - pnpm-lock.yaml
    paths:
      - .pnpm-store
```

## Jenkins

你可以使用 pnpm 来安装和缓存你的依赖项：

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

在 \[Semapore] 上，请将此内容添加到 `.semaphore/semaphore.yml` 文件中以使用 pnpm 来安装和缓存你的依赖：

```yaml title=".semaphore/semaphore.yml"
version: v1.0
name: Semaphore CI pnpm 示例
agent:
  machine:
    type: e1-standard-2
    os_image: ubuntu1804
blocks:
  - name: 安装依赖
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

在 [Travis CI] 上，请将此添加到你的 `.travis.yml` 文件中以使用 pnpm 来安装你的依赖项：

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
