---
id: continuous-integration
title: Continuous Integration
---

pnpm can easily be used in various continuous integration systems.

## Travis

On [Travis CI](https://travis-ci.org/), you can use pnpm for installing your dependencies by adding this to your `.travis.yml` file:

```yaml
before_install:
  - curl -L https://unpkg.com/@pnpm/self-installer | node
install:
  - pnpm install
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
  image: znck/docker-pnpm:10
  command:
    - pnpm
  args:
    - install
```
To get the exact Node version and pnpm version you require you can always make your own Docker image and push to [Docker Hub](https://hub.docker.com/).
