---
id: using-changesets
title: Usando Changesets com pnpm
---

:::note

At the time of writing this documentation, the latest pnpm version was v10.4.1. The latest [Changesets](https://github.com/changesets/changesets) version was v2.28.0.

:::

## Configuração

Para configurar o changesets num ambiente pnpm, instale `changesets` como uma dependência de desenvolvimento na raiz do ambiente:

```sh
pnpm add -Dw @changesets/cli
```

Then run changesets' init command to generate a changesets config:

```sh
pnpm changeset init
```

## Adicionando novos changesets

Para gerar um novo changeset, execute `pnpm changeset` na raiz do repositório. Os arquivos markdown gerados no diretório `.changeset` devem ser commitados no repositório.

## Publicando changesets

1. Execute `pnpm changeset version`. Isso irá incrementar as versões dos pacotes previamente especificados com `pnpm changeset` (e quaisquer dependências dos mesmos) e atualizar os arquivos de changelog.
2. Execute `pnpm install`. Isto irá atualizar o lockfile e reconstruir pacotes.
3. Faça um commit das alterações.
4. Execute `pnpm publish -r`. Esse comando irá publicar todos os pacotes que possuem versões com colisão ainda não presentes no registro.

## Integration with GitHub Actions

To automate the process, you can use `changeset version` with GitHub actions. A ação detectará quando arquivos de changeset chegarem na branch `main` e, em seguida, abrirá um novo Pull Request listando todos os pacotes com versões alteradas. The PR will automatically update itself every time a new changeset file arrives in `main`. Once merged the packages will be updated, and if the `publish` input has been specified on the action they will  be published using the given command.

### Add a publish script

Add a new script called `ci:publish` which executes `pnpm publish -r`. This will publish to the registry once the PR created by `changeset version` has been merged. If the package is public and scoped, adding `--access=public` may be necessary to prevent npm rejecting the publish.

**package.json**
```json
{
   "scripts": {
      "ci:publish": "pnpm publish -r"
   },
   ...
}
```

### Add the workflow

Add a new workflow at `.github/workflows/changesets.yml`. This workflow will create a new branch and PR, so Actions should be given **read and write** permissions in the repo settings (`github.com/<repo-owner>/<repo-name>/settings/actions`). If including the `publish` input on the `changesets/action` step, the repo should also include an auth token for npm as a repository secret named `NPM_TOKEN`.

**.github/workflows/changesets.yml**
```yaml
name: Changesets

on:
  push:
    branches:
      - main

env:
  CI: true

jobs:
  version:
    timeout-minutes: 15
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code repository
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Create and publish versions
        uses: changesets/action@v1
        with:
          commit: "chore: update versions"
          title: "chore: update versions"
          publish: pnpm ci:publish
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

More info and documentation regarding the changesets action can be found [here](https://github.com/changesets/action).
