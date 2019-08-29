---
id: version-3.3-pnpm-publish
title: pnpm publish
original_id: pnpm-publish
---

Publica um pacote no registro.

```
pnpm publish [<tarball>|<folder>] [--tag <tag>] [--access <public|restricted>]
```

Ao publicar um pacote dentro de um [espaço de trabalho](workspace), o arquivo LICENSE
raiz do espaço de trabalho é embalado com o pacote (a menos que o pacote tenha uma licença própria).

## --tag &lt;tag>


Publica o pacote com a tag dada. Por padrão, o `pnpm publish` atualiza a tag `latest`.

Por exemplo:

```sh
# dentro do diretório do pacote foo
pnpm publish --tag next
# em um projeto onde você deseja usar a próxima versão do foo
pnpm add foo@next
```

## --access &lt;public|restricted>

Informa ao registro se o pacote publicado deve ser público ou restrito.