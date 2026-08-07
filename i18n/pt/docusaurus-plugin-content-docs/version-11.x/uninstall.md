---
id: uninstall
title: Desinstalando o pnpm
---

## Removendo os pacotes instalados globalmente

Antes de remover o CLI do pnpm, você pode também remover todos os pacotes globais instalados pelo pnpm.

To list all the global packages, run `pnpm ls -g`. Existem duas maneiras de se remover os pacotes globais:

1. Run `pnpm rm -g <pkg>...` with each global package listed.
2. Run `pnpm root -g` to find the location of the global directory and remove it manually.

## Removendo a ferramenta de linha de comando pnpm

Se você usou o script autônomo para instalar o pnpm, poderá desinstalar a CLI do pnpm removendo o diretório inicial do pnpm:

```
rm -rf "$PNPM_HOME"
```

You might also want to clean the `PNPM_HOME` env variable in your shell configuration file (`$HOME/.bashrc`, `$HOME/.zshrc` or `$HOME/.config/fish/config.fish`).

Se você usou o npm para instalar o pnpm, então deve utilizar o npm para removê-lo:

```
npm rm -g pnpm
```

## Removendo o armazenamento de conteúdo endereçável global

```
rm -rf "$(pnpm store path)"
```

Se você usou o pnpm em um disco adicional ou particionado, você deve executar o comando acima em cada disco onde o pnpm foi usado.
O pnpm cria um armazenamento por disco.

