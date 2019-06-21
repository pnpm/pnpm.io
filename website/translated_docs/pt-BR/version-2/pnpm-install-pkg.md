---
id: versão-2-pnpm-install-pkg
title: pnpm install <pkg>
original_id: pnpm-install-pkg
---

Instala um pacote e todos os pacotes dos quais ele depende.
Por padrão, qualquer novo pacote é instalado como uma dependência de produto.

![](/img/demos/pnpm-install-package.svg)

## tl; dr

|Command|Sginificado|
|--|--|
|`pnpm i sax`                          |npm package (salva em `dependencies`)|
|`pnpm i -D sax`                       |salva em `devDependencies`           |
|`pnpm i -O sax`                       |salva em `optionalDependencies`      |
|`pnpm i -P sax`                       |salva em `dependencies`              |
|`pnpm i sax@next`                     |especificando uma tag `next`                  |
|`pnpm i sax@3.0.0`                    |usando uma versão especifica `3.0.0`             |
|`pnpm i sax@">=1 <2.0"`               |usando um range de versão                |
|`pnpm i user/repo`                    |GitHub                              |
|`pnpm i user/repo#master`             |GitHub                              |
|`pnpm i user/repo#semver:^2.0.0`      |GitHub                              |
|`pnpm i github:user/repo`             |GitHub                              |
|`pnpm i gitlab:user/repo`             |GitHub                              |
|`pnpm i /path/to/repo`                |Caminho absoluto                       |
|`pnpm i ./archive.tgz`                |Tarball                             |
|`pnpm i https://site.com/archive.tgz` |Tarball via HTTP                    |


## Locais de pacotes suportados

Um pacote pode ser instalado de diferentes locais:

### Instalar a partir do registro npm

`pnpm install package-name` instalará a última versão
de `package-name` do [npm registry](https://www.npmjs.com/).

Você também pode instalar pacotes por:

* tag: `pnpm install express@nightly`
* versão: `pnpm install express@1.0.0`
* range de versão: `pnpm install express@2 react@">=0.1.0 <0.2.0"`

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

O argumento deve começar com "http://" ou "https://".

Exemplo:

```sh
pnpm install https://github.com/indexzero/forever/tarball/v0.5.6
```

### Instalar a partir do repositório Git

```sh
npm install <git remote url>
```

Instala o pacote do provedor Git hospedado, clonando-o com o Git.

Você pode instalar a partir do Git por:

* commit: `pnpm install kevva/is-positive#97edff6f525f192a3f83cea1944765f769ae2678`
* branch: `pnpm install kevva/is-positive#master`
* version range: `pnpm install kevva/is-positive#semver:^2.0.0`

## Opções

### --save-prod, -P

Isto irá instalar um ou mais pacotes nas suas `dependencies`.

### --save-dev, -D

Usar `--save-dev` ou` -D` instalará um ou mais pacotes em seu `devDependencies`.

### --save-opcional, -O

Usar `--save-optional` ou` -O` instalará um ou mais pacotes em seu `optionalDependencies`.

### --save-exact, -E

As dependências salvas serão configuradas com uma versão exata, em vez de usar o operador de intervalo semver padrão do pnpm.