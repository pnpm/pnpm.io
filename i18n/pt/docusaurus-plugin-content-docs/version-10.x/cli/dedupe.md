---
id: dedupe
title: "pnpm dedupe"
---

Executar uma instalação removendo dependências mais antigas no arquivo lockfile se uma versão mais recente pode ser usada.

## Opções

### `--check`

O comando "dedupe" verifica se pode resultar em mudanças sem instalar pacotes ou editando o arquivo lockfile. Sai com um código de estado diferente de zero se houver mudanças possíveis.
