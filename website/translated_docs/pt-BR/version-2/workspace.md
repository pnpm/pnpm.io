---
id: version-2-workspace
title: área de trabalho
original_id: área de trabalho
---

O pnpm suporta ações simultâneas em repositórios multi-pacotes (espaços de trabalho).

Por padrão, quando você executa os comandos [`pnpm recursive [action]`](pnpm-recursive),
todos os diretórios são procurados por pacotes (diretórios com o arquivo `package.json`).
A partir de `v1.35.0`, você pode controlar quais diretórios são procurados passando uma matriz de globs para `packages` em `pnpm-workspace.yaml`.

Um exemplo de um `pnpm-workspace.yaml`:

```yaml
packages:
  # the root package.json
  - '.'
  # todos os pacotes em subdiretórios de pacotes/ e componentes/
  - 'packages/**'
  - 'components/**'
  # exclui pacotes que estão dentro de testes/diretórios
  - '!**/test/**'
```

`pnpm-workspace.yaml` deve estar na raiz da área de trabalho.

## Vinculando pacotes dentro de um espaço de trabalho

(Este exemplo funcionará com o pnpm v2.14.0 ou mais recente)

Ao trabalhar dentro de um espaço de trabalho, você deseja que suas dependências sejam vinculadas a partir do monorepo, mas declaradas como dependências regulares.
Vamos supor que você tenha este espaço de trabalho:

```
.
├─ pnpm-workspace.yaml
└─ packages
   ├─ car
   └─ garage
```

Se você criar um arquivo `.npmrc` na raiz do seu repositório e definir o valor de` link-workspace-packages` para `true`, a instalação
O comando tentará encontrar pacotes no repositório antes de resolvê-los do registro.

Então, quando você executar o `pnpm install car` em `/packages/garage`, o pnpm ligará `car` a `garage/node_modules/car` a partir de `packages/car`.
Mesmo que o `car` esteja vinculado, ele será adicionado como uma dependência de semver regular às dependências de `garage`. Então, se a versão do `carro` na área de trabalho for `1.0.0`, então esta é
como o `package.json` de `garage` será parecido depois de executar `pnpm install car`:

```json
{
  "name": "garage",
  "version": "1.0.0",
  "dependencies": {
    "car": "^1.0.0"
  }
}
```

## Usando um `shrinkwrap.yaml` compartilhado

A partir da v2, o pnpm cria uma pasta dedicada `shrinkwrap.yaml` e `node_modules` para cada pacote de área de trabalho por padrão.
Mas a partir de `v2.17.0`, é possível adicionar [shared-workspace-shrinkwrap = true](pnpm-recursive.md#shared-workspace-shrinkwrap) à raiz` .npmrc` do seu monorepo.
Quando e `shared-workspace-shrinkwrap` é `true`, os pacotes usam um único `shrinkwrap.yaml` na raiz do monorepo.
Esta configuração será `true` por padrão a partir do pnpm v3.