---
id: podman
title: 使用 Podman
---

## 在容器和主机 Btrfs 文件系统之间共享文件

:::note

此方法仅适用于 Podman 支持的写时复制文件系统，例如 Btrfs。 对于其他文件系统，例如 Ext4，pnpm 将复制文件。

:::

Podman 支持像 Btrfs 这样的写时复制文件系统。 通过 Btrfs，容器运行时为其挂载的卷创建实际的 Btrfs 子卷。 pnpm 可以通过此行为在不同已挂载的卷之间重新链接文件。

要在主机和容器之间共享文件，请将主机上的 store 目录和 `node_modules` 目录挂载到容器中。 这允许容器内的 pnpm 自然地重用主机中的文件作为引用链接。

以下是用于演示的示例容器设置：

```dockerfile title="Dockerfile"
FROM node:20-slim

# corepack 是 Node.js v20 中的一项实验性功能，它允许
# 安装和管理 pnpm、npm、yarn 的版本
RUN corepack enable

VOLUME [ "/pnpm-store", "/app/node_modules" ]
RUN pnpm config --global set store-dir /pnpm-store

# 除了 package.json 之外，您可能还需要在代码中复制更多文件
COPY package.json /app/package.json

WORKDIR /app
RUN pnpm install
RUN pnpm run build
```

运行以下命令来构建 podman 镜像：

```sh
podman build . --tag my-podman-image:latest -v "$HOME/.local/share/pnpm/store:/pnpm-store" -v "$(pwd)/node_modules:/app/node_modules"
```
