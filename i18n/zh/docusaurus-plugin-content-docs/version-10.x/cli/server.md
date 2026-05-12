---
id: server
title: pnpm server
---

:::danger

已弃用的功能

:::

管理一个存储服务器。

## 命令

### pnpm server start

启动一个服务器来执行与存储之间的所有交互。
其他命令会将任何与存储相关的任务委托给该服务器。

### pnpm server stop

关闭存储服务器。

### pnpm server status

打印正在运行的服务器的信息。

## 配置项

### --background

- 默认值： **false**
- 类型：**Boolean**

在后台运行服务器，类似于 UNIX 系统上的守护进程。

### --network-concurrency

- 默认值： **null**
- 类型：**Number**

同时处理的最大网络请求数。

### --protocol

- 默认值： **auto**
- 类型：**auto**、**tcp**、**ipc**

服务器使用的通信协议。
当它设置为 `auto` 时，IPC 会用于除 Windows 所有系统，Windows 会使用 TCP。

### --port

- 默认值：**5813**
- 类型：**端口号**

使用 TCP 进行通信时使用的端口号。
如果指定了端口并且协议设置为 `auto`，则无论系统类型如何，协议都会自动设置为使用 TCP。

### --store-dir

- 默认值：**&lt;home\>/.pnpm-store**
- 类型：**路径**

用于内容可寻址存储的目录。

### --[no-]lock

- 默认值： **false**
- 类型：**Boolean**

设置是否使软件包存储对外部进程不可变，无论服务器是否运行。

### --ignore-stop-requests

- 默认值： **false**
- 类型：**Boolean**

阻止你使用 `pnpm server stop` 停止服务器。

### --ignore-upload-requests

- 默认值： **false**
- 类型：**Boolean**

防止在安装期间创建新的副作用缓存。
