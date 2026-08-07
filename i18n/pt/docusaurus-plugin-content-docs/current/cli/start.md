---
id: start
title: pnpm start
---

Aliases: `run start`

Executa um comando arbitrário especificado na propriedade `start` do objeto `scripts` do pacote. Se `start` não estiver especificado no objeto `scripts`, o pnpm tentará executar `node server.js` por padrão, falhando caso nenhum dos dois estiverem presntes.

O propósito da propriedade é especificar um comando que inicia seu programa.
