---
id: pnpm-publish-pt-br
title: pnpm publish
---

Publica um pacote no registro.

```
pnpm publish [<tarball>|<folder>] [--tag <tag>] [--access <public|restricted>]
```

Ao publicar um pacote dentro de um [espaço de trabalho] (workspace.md), o arquivo LICENSE
raiz do espaço de trabalho é embalado com o pacote (a menos que o pacote tenha uma licença própria).

tag ## --tag & lt;

Publica o pacote com a tag dada. Por padrão, o `pnpm publish` atualiza a tag `latest`.

Por exemplo:

```sh
# dentro do diretório do pacote foo
pnpm publish --tag next
# em um projeto onde você deseja usar a próxima versão do foo
pnpm add foo @ next
```

## --acesso & lt; público | restrito>

Informa ao registro se o pacote publicado deve ser público ou restrito.

## package.json publishConfig

Adicionado em: v3.4.0

É possível sobrescrever alguns campos no manifesto antes que o pacote seja empacotado.
Os seguintes campos podem ser sobrescritos: `typings`, `types`, `main` e `module`.
Para sobrescrever um campo, adicione a versão de publicação do campo ao `publishConfig`.

Por exemplo, o seguinte `package.json`:

```json
{
    "name": "foo",
    "version": "1.0.0",
    "main": "src/index.ts",
    "publishConfig": {
        "main": "lib/index.js",
        "typings": "lib/index.d.ts"
    }
}
```

Será publicado como:

```json
{
    "name": "foo",
    "version": "1.0.0",
    "main": "lib/index.js",
    "typings": "lib/index.d.ts"
}
```