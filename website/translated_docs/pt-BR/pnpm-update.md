---
id: pnpm-update-pt-br
title: pnpm update
---

O `pnpm update` atualiza os pacotes para sua versão mais recente baseada no intervalo especificado.

## tl; dr

| Comando | Significado |
| - | - |
| `pnpm up` | atualiza todas as dependências. Adere intervalos especificados em `package.json` |
| `pnpm up --latest` | atualiza todas as dependências. Ignora os intervalos especificados em `package.json` |
| `pnpm up foo @ 2` | atualiza o` foo` para o ultimo v2 |

## Opções

### --latest

Adicionado em: v3.2.0

Ignora o intervalo de versão especificado em `package.json`. Em vez disso, a versão especificada pela tag `latest` será usada (potencialmente atualizando os pacotes nas principais versões).
