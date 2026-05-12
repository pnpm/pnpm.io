---
id: pnpx-cli
title: pnpx CLI
---

:::warning

¡Este comando está en desuso! Utilice [`pnpm exec`][] y [`pnpm dlx`][] en su lugar.

:::

## Para nuevos usuarios

`pnpx` (PNPm eXecute) es una herramienta de línea de comandos que obtiene un paquete del registro sin instalarlo como una dependencia, lo carga en caliente y ejecuta cualquier binario de comando predeterminado que exponga.

Por ejemplo, para usar `create-react-app` en cualquier lugar para iniciar una aplicación de reacción sin necesitar instalarla en otro proyecto, puede ejecutar:

```sh
pnpx create-react-app my-project
```

Esto obtendrá `create-react-app` del registro y lo ejecutará con los argumentos dados. Para obtener más información, puede consultar [npx][] de npm, ya que ofrece la misma interfaz, excepto que utiliza `npm` en lugar de `pnpm` por debajo.

Si solo desea ejecutar un binario de la dependencia de un proyecto, consulte [`pnpm exec`][].

## Para usuarios de npm

npm tiene un excelente ejecutor de paquetes llamado [npx][]. pnpm ofrece la misma herramienta a través del comando `pnpx`. La única diferencia es que `pnpx` usa `pnpm` para instalar paquetes.

[npx]: https://www.npmjs.com/package/npx
[`pnpm exec`]: ./cli/exec.md
[`pnpm dlx`]: ./cli/dlx.md
