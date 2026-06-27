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

Inicia um servidor que realiza todas as interações com a store. Outros comandos delegarão quaisquer tarefas relacionadas à store para este servidor.

### pnpm server stop

Interrompe o servidor.

### pnpm server status

Mostra informações sobre o servidor em execução.

## Opções

### --background

* Padrão: **false**
* Tipo: **Boolean**

Executa o servidor em segundo plano, semelhante ao daemonizing em sistemas UNIX.

### --network-concurrency

* Default: **null**
* Tipo: **Number**

O número máximo de requests a serem processadas simultaneamente.

### --protocol

* Padrão: **auto**
* Tipo: **auto**, **tcp**, **tcp**

O protocolo de comunicação usado pelo servidor. Quando definido como `auto`, o IPC é usado em todos os sistemas, exceto no Windows, que usa TCP.

### --port

* Padrão: **5813**
* Tipo: **port number**

O número da porta a ser usado quando o TCP é usado para comunicação. Se uma porta for especificada e o protocolo for definido como `auto`, independentemente do tipo de sistema, o protocolo será definido automaticamente para usar TCP.

### --store-dir

* Padrão: **&lt;home\>/.pnpm-store**
* Tipo: **Path**

O diretório a ser usado para o armazenamento endereçável de conteúdo.

### --[no-]lock

* Padrão: **false**
* Tipo: **Boolean**

Define se o armazenamento de pacotes será imutável para processos externos enquanto o servidor estiver em execução ou não.

### --ignore-stop-requests

* Padrão: **false**
* Tipo: **Boolean**

Impede que você pare o servidor usando `pnpm server stop`.

### --ignore-upload-requests

* Padrão: **false**
* Tipo: **Boolean**

Impede a criação de um novo cache de side effect durante a instalação.
