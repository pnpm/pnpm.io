---
id: errors
title: Códigos de Erro
---

## ERR_PNPM_UNEXPECTED_STORE

Um diretório de módulos está presente e está vinculado a um diretório de armazenamento diferente.

Se você alterou o diretório de armazenamento intencionalmente, execute `pnpm install` e o pnpm reinstalará as dependências usando o novo armazenamento.

## ERR_PNPM_NO_MATCHING_VERSION_INSIDE_WORKSPACE

Um projeto tem uma dependência de área de trabalho que não existe na área de trabalho principal.

Por exemplo, o pacote `foo` tem `bar@1.0.0` em ` dependencies `:

```json
{
  "name": "foo",
  "version": "1.0.0",
  "dependencies": {
    "bar": "workspace:1.0.0"
  }
}
```

No entanto, há apenas `bar@2.0.0` na área de trabalho, portanto, `pnpm install` falhará.

Para corrigir esse erro, todas as dependências que usam o protocolo [de área de trabalho][] devem ser atualizadas para usar as versões dos pacotes presentes na área de trabalho. Isso pode ser feito manualmente ou usando o comando `pnpm -r update`.

## ERR_PNPM_PEER_DEP_ISSUES

`pnpm install` falhará se o projeto tiver dependências de pares não resolvidas ou se as dependências de pares não corresponderem aos intervalos desejados. Para corrigir isso, instale as dependências de pares ausentes.

You may also selectively ignore these errors using the [peerDependencyRules.ignoreMissing][] and [peerDependencyRules.allowedVersions][] settings.

## ERR_PNPM_OUTDATED_LOCKFILE

Este erro ocorre quando a instalação não pode ser executada sem alterações no arquivo lockfile. Isso poderá acontecer no ambiente de CI se alguém alterar o arquivo `package.json` no repositório sem executar `pnpm install` depois. Ou quando alguém esquecer de fazer o commit das alterações no arquivo lockfile.

Para corrigir este erro, apenas execute `pnpm install` e faça o commit das alterações do arquivo lockfile.

## ERR\_PNPM\_TARBALL\_INTEGRITY

Este erro indica que o tarball do pacote baixado não correspondeu à soma de verificação de integridade esperada.

Se você usa o registro npm (`registry.npmjs.org`), então isso provavelmente significa que a integridade em seu arquivo lockfile está incorreta. Isso pode acontecer se um arquivo lockfile tiver resolvido mal os conflitos de mesclagem.

Se você usa um registro que permite substituir as versões existentes de um pacote, então pode significar que em seu cache de metadados local tem a soma de verificação de integridade de uma versão mais antiga do pacote. Neste caso, você deve executar `pnpm store prune`. Este comando removerá seu cache de metadados local. Então você pode tentar novamente o comando que falhou.

Mas também tenha cuidado e verifique se o pacote foi baixado da URL correta. A URL deve ser impressa na mensagem de erro.

## ERR_PNPM_MISMATCHED_RELEASE_CHANNEL

O campo de configuração `use-node-version` define um canal de lançamento diferente do sufixo da versão.

Por exemplo:
* `rc/20.0.0` define um canal `rc` mas a versão é a de uma versão estável.
* `release/20.0.0-rc.0`define um canal `release` mas a versão é a de um lançamento RC.

Para corrigir esse erro, remova o prefixo do canal de lançamento ou corrija o sufixo da versão.

Note that it is not allowed to specify node versions like `lts/Jod`. The correct syntax for stable release is strictly X.Y.Z or release/X.Y.Z.

## ERR_PNPM_INVALID_NODE_VERSION

O valor do campo de configuração `use-node-version` possui uma sintaxe inválida.

Abaixo estão as formas válidas de `use-node-version`:
* Versão estável:
  * `X.Y.Z` (`X`, `Y`, `Z` são inteiros)
  * `release/X.Y.Z` (`X`, `Y`, `Z` são inteiros)
* Versão do RC:
  * `X.Y.Z-rc.W` (`X`, `Y`, `Z`, `W` são inteiros)
  * `rc/X.Y.Z-rc.W` (`X`, `Y`, `Z`, `W` são inteiros)

[de área de trabalho]: ./workspaces.md#workspace-protocol-workspace

[peerDependencyRules.ignoreMissing]: settings#peerdependencyrulesignoremissing
[peerDependencyRules.allowedVersions]: settings#peerdependencyrulesallowedversions
