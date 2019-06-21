---
id: pnpm-install-pkg-pt-br
title: pnpm install <pkg>
---

Instala um pacote e todos os pacotes dos quais ele depende.
Por padrão, qualquer novo pacote é instalado como uma dependência de produto.

![](/img/demos/pnpm-install-package.svg)

## tl; dr

| Comando | Significado |
| - | - |
| pnpm i sax` | npm package (salve para `dependencies`) |
| `pnpm i -D sax` | salvar em` devDependencies` |
| `pnpm i -O sax` | salvar em` optionalDependencies` |
| `pnpm i -P sax` | salvar em` dependências` |
| `pnpm i sax @ next` | Especifique a tag` next` |
| `pnpm i sax @ 3.0.0` | Especifique a versão` 3.0.0` |
| pnpm i sax @ "> = 1 <2.0" `| Especifique o intervalo de versões |
| `pnpm i usuário / repo` | GitHub |
| `pnpm i usuário / repo # master` | GitHub |
| pnpm i usuário / repo # semver: ^ 2.0.0` | GitHub |
| `pnpm i github: user / repo` | GitHub |
| `pnpm i gitlab: usuário / repo` | GitHub |
| `pnpm i / caminho / para / repo` | Caminho absoluto |
| `pnpm i. / archive.tgz` | Tarball |
| `pnpm i https: // site.com / archive.tgz` | Tarball via HTTP |

## Locais de pacotes suportados

Um pacote pode ser instalado de diferentes locais:

### Instalar a partir do registro npm

`pnpm install package-name` instalará a última versão
de `package-name` do [npm registry](https://www.npmjs.com/).

Você também pode instalar pacotes por:

* tag: `pnpm install express @ todas as noites
* versão: `pnpm install express @ 1.0.0`
* gama de versões: `pnpm install express @ 2 react @"> = 0.1.0 <0.2.0 "`

### Instalar a partir do sistema de arquivos local

Existem duas maneiras de instalar a partir do sistema de arquivos local:

1. de um arquivo tarball (`.tar`,` .tar.gz` ou `.tgz`)
2. de um diretório

Exemplos:

```sh
pnpm install ./package.tgz
pnpm install ./some-directory
```

Quando você instala a partir de um diretório, um link simbólico será criado no
o `node_modules` do projeto atual, então é o mesmo que rodar
`pnpm link`.

### Instalar a partir do tarball gzipped remoto

O argumento deve começar com "http: //" ou "https: //".

Exemplo:

```sh
pnpm install https://github.com/indexzero/forever/tarball/v0.5.6
```

### Instalar a partir do repositório Git

```sh
pnpm install <git remote url>
```

Instala o pacote do provedor Git hospedado, clonando-o com o Git.

Você pode instalar a partir do Git por:

* commit: `pnpm install kevva / é-positivo # 97edff6f525f192a3f83cea1944765f769ae2678`
* branch: `pnpm instala o kevva / é positivo # master`
* intervalo de versões: `pnpm install kevva / é-positivo # semver: ^ 2.0.0`

## Opções

### --save-prod, -P

Isto irá instalar um ou mais pacotes nas suas `dependências`.

### --save-dev, -D

Usar `--save-dev` ou` -D` instalará um ou mais pacotes em seu `devDependencies`.

### --save-opcional, -O

Usar `--save-optional` ou` -O` instalará um ou mais pacotes em seu `optionalDependencies`.

### --save-exact, -E

As dependências salvas serão configuradas com uma versão exata, em vez de usar o operador de intervalo semver padrão do pnpm.

### --save-peer

Adicionado em: v3.2.0

Usar `--save-peer` adicionará um ou mais pacotes a` peerDependencies` e os instalará como dependências dev.
