---
id: publish
title: pnpm publish
---

Publica um pacote no registry do npm.

```sh
pnpm [-r] publish [<tarball|folder>] [--tag <tag>]
     [--access <public|restricted>] [options]
```

When publishing a package inside a [workspace](../workspaces.md), the LICENSE file
from the root of the workspace is packed with the package (unless the package
has a license of its own).

You may override some fields before publish, using the
[publishConfig] field in `package.json`.
You also can use the [`publishConfig.directory`](../package_json.md#publishconfigdirectory) to customize the published subdirectory (usually using third party build tools).

When running this command recursively (`pnpm -r publish`), pnpm will publish all
the packages that have versions not yet published to the registry.

[publishConfig]: ../package_json.md#publishconfig

## Opções

### --recursive, -r

Publica todos os pacotes do workspace.

### --json

Show information in JSON format.

### --tag &lt;tag\>

Publica o pacote com a determinada tag. By default, `pnpm publish` updates
the `latest` tag.

Por exemplo:

```sh
# dentro do diretório do pacote foo
pnpm publish --tag next
# em um projeto onde você deseja usar a próxima versão de foo
pnpm add foo@next
```

### --access &lt;public|restricted\>

Informa ao registro se o pacote publicado deve ser público ou restrito.

### --no-git-checks

Não verifique se a branch atual é a branch de publicação, limpa e atualizada com o remote.

### --publish-branch &lt;branch\>

- Default: **master** and **main**
- Types: **String**

A branch principal do repositório que é usada para publicar as últimas mudanças.

### --force

Tente publicar os pacotes mesmo se as suas versões já forem encontradas no registro.

### --report-summary

Save the list of published packages to `pnpm-publish-summary.json`. Útil quando alguma outra ferramenta é usada para reportar a lista de pacotes publicados.

An example of a `pnpm-publish-summary.json` file:

```json
{
  "publishedPackages": [
    {
      "name": "foo",
      "version": "1.0.0"
    },
    {
      "name": "bar",
      "version": "2.0.0"
    }
  ]
}
```

### --dry-run

Realize todo o processo de publicação, mas sem realmente publicar no registro.

### --otp

Ao publicar pacotes que requerem autenticação de dois fatores, esta opção pode especificar uma senha de uso único.

### --provenance

When publishing from a supported cloud CI/CD system, the package will be publicly linked to where it was built and published from.

### --filter &lt;package_selector\>

[Read more about filtering.](../filtering.md)

## Configuração

You can also set `gitChecks`, `publishBranch` options in the `pnpm-workspace.yaml` file.

Por exemplo:

```yaml title="pnpm-workspace.yaml"
gitChecks: false
publishBranch: production
```

## Scripts de Life Cycle

- `prepublishOnly`
- `prepublish`
- `prepack`
- `prepare`
- `postpack`
- `publish`
- `postpublish`

