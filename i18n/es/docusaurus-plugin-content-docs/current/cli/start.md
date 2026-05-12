---
id: start
title: pnpm start
---

Aliases: `run start`

Ejecuta el comando especificado en la propiedad `start` del objeto "scripts" del package.json. Si no hay un valor definido en la propiedad `start` del objeto `scripts`, se intentará ejecutar el comando `node server.js` por defaulf, fallará si ninguno de los dos está presente.

La función de la propiedad `start` es la de definir el comando que de inicio a su programa.
