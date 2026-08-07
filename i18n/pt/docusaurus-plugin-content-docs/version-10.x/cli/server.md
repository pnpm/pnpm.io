---
id: server
title: pnpm server
---

:::danger

Deprecated feature

:::

Gerenciar um servidor store.

## Comandos

### pnpm server start

Inicia um servidor que realiza todas as interações com a store.
Outros comandos delegarão quaisquer tarefas relacionadas à store para este servidor.

### pnpm server stop

Interrompe o servidor.

### pnpm server status

Mostra informações sobre o servidor em execução.

## Opções

### --background

- Default: **false**
- Type: **Boolean**

Executa o servidor em segundo plano, semelhante ao daemonizing em sistemas UNIX.

### --network-concurrency

- Default: **null**
- Type: **Number**

O número máximo de requests a serem processadas simultaneamente.

### --protocol

- Default: **auto**
- Type: **auto**, **tcp**, **ipc**

O protocolo de comunicação usado pelo servidor.
When this is set to `auto`, IPC is used on all systems except for Windows,
which uses TCP.

### --port

- Default: **5813**
- Type: **port number**

O número da porta a ser usado quando o TCP é usado para comunicação.
If a port is specified and the protocol is set to `auto`, regardless of system
type, the protocol is automatically set to use TCP.

### --store-dir

- Default: **&lt;home\>/.pnpm-store**
- Type: **Path**

O diretório a ser usado para o armazenamento endereçável de conteúdo.

### --[no-]lock

- Default: **false**
- Type: **Boolean**

Define se o armazenamento de pacotes será imutável para processos externos enquanto o servidor estiver em execução ou não.

### --ignore-stop-requests

- Default: **false**
- Type: **Boolean**

Prevents you from stopping the server using `pnpm server stop`.

### --ignore-upload-requests

- Default: **false**
- Type: **Boolean**

Impede a criação de um novo cache de side effect durante a instalação.
