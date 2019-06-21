---
id: pnpm-server-pt-br
title: pnpm server
---

## pnpm server start

Adicionado em: v1.30.0

Inicia um servidor que faz todas as interações com a loja.
Outros comandos delegarão tarefas relacionadas à loja a esse servidor.

### fundo

Adicionado em: v1.30.0

* Padrão: **falso**
* Tipo: **Boolean**

Executa o servidor em segundo plano.

protocolo ###

Adicionado em: v1.30.0

* Padrão: **auto**
* Tipo: **auto**, **tcp**, **ipc**

O protocolo de comunicação usado pelo servidor.
Quando **auto** é usado, **ipc** é usado em servidores não Windows e **tcp** no Windows.

porta ###

Adicionado em: v1.30.0

* Padrão: **5813**
* Tipo: **número da porta**

O número da porta a ser usado quando o TCP é usado para comunicação.
Se a porta for especificada e o **protocolo** estiver definido como automático, o protocolo **tcp** será usado.

Outras configurações que são usadas pelo `pnpm server`: **store**, **lock**.

### ignore-stop-requests

Adicionado em: v1.30.0

* Padrão: **false**
* Tipo: **Boolean**

Não permite parar o servidor usando o `pnpm server stop`.

### ignore-upload-requests

Adicionado em: v1.31.0

* Padrão: **false**
* Tipo: **Boolean**

Não permite criar novo cache de efeitos colaterais durante a instalação.

## pnpm server stop

Adicionado em: v1.30.0

Pára o servidor da loja.

## pnpm server status

Adicionado em: v2.5.0

Imprime informações sobre o servidor em execução.
