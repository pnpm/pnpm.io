---
id: publish
title: pnpm publish
---

Publica um pacote no registry do npm.

```sh
pnpm [-r] publish [<tarball|folder>] [--tag <tag>]
     [--access <public|restricted>] [options]
```

:::note

Since v11, `pnpm publish` is implemented natively and no longer delegates to the `npm` CLI. If you rely on a feature that is now gone, please open an issue at [pnpm/pnpm](https://github.com/pnpm/pnpm/issues). As a workaround, you can still run `pnpm pack && npm publish *.tgz`.

:::

Ao publicar um pacote dentro de um workspace [](../workspaces.md), o arquivo LICENSE da raiz do workspace é compactado com o pacote (a menos que o pacote tenha uma licença própria).

Você pode substituir alguns campos antes de publicar, usando o campo [publishConfig][] em `package.json`. Você também pode usar o [`publishConfig.directory`](../package_json.md#publishconfigdirectory) para personalizar o subdiretório publicado (geralmente usando ferramentas de compilação de terceiros).

Ao executar este comando recursivamente (`pnpm -r publish`), o pnpm publicará todos os pacotes que possuem versões ainda não publicadas no registry.

## Opções

### --recursive, -r

Publica todos os pacotes do workspace.

### --json

Mostra informações no formato JSON.

### --tag &lt;tag\>

Publica o pacote com a determinada tag. Por padrão, o `pnpm publish` atualiza a `latest` tag.

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

* Padrão: **master** e **main**
* Tipos: **String**

A branch principal do repositório que é usada para publicar as últimas mudanças.

### --force

Tente publicar os pacotes mesmo se as suas versões já forem encontradas no registro.

### --report-summary

Salve a lista de pacotes publicados em `pnpm-publish-summary.json`. Útil quando alguma outra ferramenta é usada para reportar a lista de pacotes publicados.

Um exemplo de um arquivo `pnpm-publish-summary.json`:

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

You can also provide the OTP via the `PNPM_CONFIG_OTP` environment variable:

```sh
export PNPM_CONFIG_OTP='<your OTP here>'
pnpm publish --no-git-checks
```

If the registry requests OTP and you have not provided it via the environment variable or the `--otp` flag, pnpm will prompt you directly for an OTP code.

If the registry requests web-based authentication, pnpm will print a scannable QR code along with the URL.

### --provenance

When publishing from a supported cloud CI/CD system, the package will be publicly linked to where it was built and published from.

### --filter &lt;package_selector\>

[Leia mais sobre filtragem.](../filtering.md)

## Configuração

You can also set `gitChecks`, `publishBranch` options in the `pnpm-workspace.yaml` file.

Por exemplo:

```yaml title="pnpm-workspace.yaml"
gitChecks: false
publishBranch: production
```

## Scripts de Life Cycle

* `prepublishOnly`
* `prepublish`
* `prepack`
* `prepare`
* `postpack`
* `publish`
* `postpublish`

[publishConfig]: ../package_json.md#publishconfig

