---
id: versão-2-about-package-store-t-br
title: Sobre a loja de pacotes
original_id: about-package-store
---

Uma loja é uma pasta que contém pacotes e informações sobre projetos que os estão usando.
A loja não inclui a pasta `node_modules` de nenhum dos pacotes, a menos que o pacote tenha
[dependências agrupadas](https://docs.npmjs.com/files/package.json#bundleddependencies).

A loja é imutável. Execução de módulos da loja não pode remover/adicionar arquivos na loja,
porque os módulos são executados no contexto dos projetos aos quais estão vinculados.

## Estrutura de diretórios da loja

Estrutura do caminho: `<fonte do pacote>/<id do pacote>`. O caminho para um pacote na loja é o ID do pacote.

### Pacotes de registros compatíveis com npm

`<URL do registro>/<nome do pacote>/<versão do pacote>`

Por exemplo.:

```
registry.npmjs.org/gulp/2.1.0
registry.npmjs.org/@cycle/dom/14.1.0
registry.node-modules.io/@wmhilton/log/1.1.0
```

### Pacotes do Git

`<Git URL domain>/<caminho Git>/<commit hash>`

Por exemplo: `github.com/alexGugel/ied/b246270b53e43f1dc469df0c9b9ce19bb881e932`

## `store.json`

Um arquivo na raiz da loja que contém informações sobre projetos, dependendo de pacotes específicos da loja.

```json
{
  "/home/john_smith/src/ied": [
    "registry.npmjs.org/npm/3.10.2"
  ]
  "/home/john_smith/src/ied": [
    "registry.npmjs.org/arr-flatten/1.0.1",
    "registry.npmjs.org/byline/5.0.0",
    "registry.npmjs.org/cache-manager/2.2.0"
  ]
}
```