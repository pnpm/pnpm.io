---
id: errors
title: Códigos de Erro
---

## ERR_PNPM_UNEXPECTED_STORE

Um diretório de módulos está presente e está vinculado a um diretório de armazenamento diferente.

If you changed the store directory intentionally, run `pnpm install` and pnpm will reinstall the dependencies using the new store.

## ERR_PNPM_NO_MATCHING_VERSION_INSIDE_WORKSPACE

Um projeto tem uma dependência de área de trabalho que não existe na área de trabalho principal.

For instance, package `foo` has `bar@1.0.0` in the `dependencies`:

```json
{
  "name": "foo",
  "version": "1.0.0",
  "dependencies": {
    "bar": "workspace:1.0.0"
  }
}
```

However, there is only `bar@2.0.0` in the workspace, so `pnpm install` will fail.

To fix this error, all dependencies that use the [workspace protocol] should be updated to use versions of packages that are present in the workspace. This can be done either manually or using the `pnpm -r update` command.

[workspace protocol]: ./workspaces.md#workspace-protocol-workspace

## ERR_PNPM_PEER_DEP_ISSUES

`pnpm install` will fail if the project has unresolved peer dependencies or the peer dependencies are not matching the wanted ranges. Para corrigir isso, instale as dependências de pares ausentes.

You may also selectively ignore these errors using the [peerDependencyRules.ignoreMissing] and [peerDependencyRules.allowedVersions] settings.

[peerDependencyRules.ignoreMissing]: settings#peerdependencyrulesignoremissing
[peerDependencyRules.allowedVersions]: settings#peerdependencyrulesallowedversions

## ERR_PNPM_OUTDATED_LOCKFILE

Este erro ocorre quando a instalação não pode ser executada sem alterações no arquivo lockfile. This might happen in a CI environment if someone has changed a `package.json` file in the repository without running `pnpm install` afterwards. Ou quando alguém esquecer de fazer o commit das alterações no arquivo lockfile.

To fix this error, just run `pnpm install` and commit the changes to the lockfile.

## ERR\_PNPM\_TARBALL\_INTEGRITY

Este erro indica que o tarball do pacote baixado não correspondeu à soma de verificação de integridade esperada.

If you use the npm registry (`registry.npmjs.org`), then this probably means that the integrity in your lockfile is incorrect.
Isso pode acontecer se um arquivo lockfile tiver resolvido mal os conflitos de mesclagem.

Se você usa um registro que permite substituir as versões existentes de um pacote, então pode significar que em seu cache de metadados local tem a soma de verificação de integridade de uma versão mais antiga do pacote. In this case, you should run `pnpm store prune`. Este comando removerá seu cache de metadados local. Então você pode tentar novamente o comando que falhou.

Mas também tenha cuidado e verifique se o pacote foi baixado da URL correta. A URL deve ser impressa na mensagem de erro.

## ERR_PNPM_MISMATCHED_RELEASE_CHANNEL

The config field `use-node-version` defines a release channel different from version suffix.

Por exemplo:

- `rc/20.0.0` defines an `rc` channel but the version is that of a stable release.
- `release/20.0.0-rc.0` defines a `release` channel but the version is that of an RC release.

Para corrigir esse erro, remova o prefixo do canal de lançamento ou corrija o sufixo da versão.

Note that it is not allowed to specify node versions like `lts/Jod`.
The correct syntax for stable release is strictly X.Y.Z or release/X.Y.Z.

## ERR_PNPM_INVALID_NODE_VERSION

The value of config field `use-node-version` has an invalid syntax.

Below are the valid forms of `use-node-version`:

- Versão estável:
  - `X.Y.Z` (`X`, `Y`, `Z` are integers)
  - `release/X.Y.Z` (`X`, `Y`, `Z` are integers)
- Versão do RC:
  - `X.Y.Z-rc.W` (`X`, `Y`, `Z`, `W` are integers)
  - `rc/X.Y.Z-rc.W` (`X`, `Y`, `Z`, `W` are integers)
