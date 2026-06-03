---
id: pnpx-cli
title: pnpx CLI
---

:::warning

Este comando foi descontinuado! Use [`pnpm exec`][] e [`pnpm dlx`][].

:::

## Para novos usuários

`pnpx` (PNPm eXecute) é uma ferramenta de linha de comando que busca um pacote do registro sem instalá-lo como dependência, carrega de forma dinâmica, e roda qualquer comando binário padrão que este expõe.

Por exemplo, para usar `create-react-app` em qualquer lugar para inicializar um novo aplicativo React sem a necessidade de instalá-lo num projeto, você pode rodar:

```sh
pnpx create-react-app my-project
```

O `create-react-app` será carregado do registro e executado conforme os argumentos fornecidos. Para mais informações, você pode consultar o [npx][] do npm, pois oferece a mesma ‘interface’, porém utilizando o `npm` ao invés do `pnpm` internamente.

Se você deseja apenas executar um binário de uma dependência do projeto, consulte [`pnpm exec`][].

## Para usuários de npm

npm possui um ótimo executador de pacote chamado [npx][]. pnpm oferece a mesma ferramenta por meio do comando `pnpx`. A única diferença é que `pnpx` usa `pnpm` para instalar pacotes.

[npx]: https://www.npmjs.com/package/npx
[`pnpm exec`]: ./cli/exec.md
[`pnpm dlx`]: ./cli/dlx.md
