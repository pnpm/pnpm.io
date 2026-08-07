---
id: fetch
title: pnpm fetch
---

获取锁文件中列出的包到虚拟存储中，包清单将被忽略。

## 使用场景

此命令专门用于改进构建 Docker 镜像。

你可能已经阅读了如何为 Node.js 应用程序编写 Dockerfile 的 [官方指南][official guide]，如果你还没有阅读，你可能需要先阅读它。

从该指南中，我们学会了如何为使用 pnpm 的项目编写优化的 Dockerfile ，这将类似于

```Dockerfile
FROM node:20

WORKDIR /path/to/somewhere

RUN corepack enable pnpm && corepack install -g pnpm@latest-10

# pnpm install 所需文件
COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml .pnpmfile.cjs ./

# 如果你修补了任何包，在安装前包含这些布丁
COPY patches patches

RUN pnpm install --frozen-lockfile --prod

# 打包 app 源代码
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]
```

只要不更改 `.npmrc`， `package.json`， `pnpm-lock.yaml`，
`.pnpm-workspace.yaml`，`.pnpmfile.cjs`， Docker 构建缓存一直有效至 `RUN pnpm install --frozen-lockfile --prod` 层，而其在构建 Docker 镜像时耗费绝大部分时间。

但是，对 `package.json` 的修改可能比我们预期的频繁得多，因为它不仅包含依赖，而且还可能包含版本号，脚本和其他工具的任意配置。

维护构建 monorepo 项目的 Dockerfile 也很困难，它可能看起来像

```Dockerfile
FROM node:20

WORKDIR /path/to/somewhere

RUN corepack enable pnpm && corepack install -g pnpm@latest-10

# pnpm install 需要的文件
COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml .pnpmfile.cjs ./

# 如果你修补了任何包，在安装前包含补丁
COPY patches patches

# 对于每个子包，我们需要添加一个额外步骤来复制它的清单到正确的地方，因为 docker 无法通过单个指令仅过滤出 package.json 
COPY packages/foo/package.json packages/foo/
COPY packages/bar/package.json packages/bar/

RUN pnpm install --frozen-lockfile --prod

# 捆绑 app 源
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]
```

如你所见，当你添加或删除子软件包时，必须更新 Dockerfile。

`pnpm fetch` 通过提供仅使用锁文件和配置文件（`pnpm-workspace.yaml`）中的信息向虚拟存储中加载软件包的能力来完美地解决上述问题。

```Dockerfile
FROM node:20

WORKDIR /path/to/somewhere

RUN corepack enable pnpm && corepack install -g pnpm@latest-10

# pnpm fetch 只需要锁文件
COPY pnpm-lock.yaml pnpm-workspace.yaml ./

# 如果你修补了任何包，在运行 pnpm fetch 前包含补丁
COPY patches patches

RUN pnpm fetch --prod


ADD . ./
RUN pnpm install -r --offline --prod


EXPOSE 8080
CMD [ "node", "server.js" ]
```

它既适用于简单项目，也适用于 monorepo 项目，` --offline` 会强制 pnpm 不与包注册源通信，因为所有需要的软件包都应该已经存在于虚拟存储中。

只要锁文件没有改变，构建缓存直到层都有效，所以 `RUN pnpm install -r --offline --prod`，将为你节省大量时间。

:::note

本地 `file:` 协议依赖项在 `pnpm fetch` 期间被跳过，因为它们引用了在获取时可能不可用的目录（例如在 Docker 构建中）。

:::

## 配置项

### --dev, -D

只会获取开发软件包

### --prod, -P

不会获取开发软件包

[official guide]: https://github.com/nodejs/docker-node#readme
