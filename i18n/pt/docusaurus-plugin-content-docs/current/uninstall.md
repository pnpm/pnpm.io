---
id: uninstall
title: Desinstalando o pnpm
---

## Removendo os pacotes instalados globalmente

Antes de remover o CLI do pnpm, você pode também remover todos os pacotes globais instalados pelo pnpm.

Para listar todos os pacotes globais, execute `pnpm ls -g`. Existem duas maneiras de se remover os pacotes globais:

1. Execute `pnpm rm -r <pkg>...` com cada pacote global listado.
2. Execute `pnpm root -g` para encontrar o local do diretório global e removê-lo manualmente.

## Removendo a ferramenta de linha de comando pnpm

Se você usou o script autônomo para instalar o pnpm, poderá desinstalar a CLI do pnpm removendo o diretório inicial do pnpm:

```
rm -rf "$PNPM_HOME"
```

Você também pode limpar a varíavel de ambiente `PNPM_HOME` em seu arquivo de configuração do shell (`$HOME/.bashrc`, `$HOME/.zshrc` ou `$HOME/.config/fish/config.fish`).

Se você usou o npm para instalar o pnpm, então deve utilizar o npm para removê-lo:

```
npm rm -g pnpm
```

## Removendo o armazenamento de conteúdo endereçável global

```
rm -rf "$(pnpm store path)"
```

Se você usou o pnpm em um disco adicional ou particionado, você deve executar o comando acima em cada disco onde o pnpm foi usado. O pnpm cria um armazenamento por disco.

