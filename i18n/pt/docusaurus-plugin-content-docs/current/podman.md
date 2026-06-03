---
id: podman
title: Trabalhando com Podman
---

## Compartilhando arquivos entre um Container e o sistema de arquivos Btrfs hospedeiro

:::note

Este método funciona apenas em sistemas de arquivos de cópia em gravação suportados pelo Podman, como o Btrfs. Para outros sistemas de arquivos, como Ext4, o pnpm irá copiar os arquivos.

:::

Podman oferece suporte à sistemas de arquivos de cópia em gravação como o Btrfs. Com Btrfs, a execução de containers cria subvolumes Btrfs reais para seus volumes montados. O pnpm pode aproveitar deste comportamento realizando reflinks de arquivos entre diferentes volumes montados.

Para compartilhar arquivos entre o hospedeiro e o container, monte o diretório de armazenamento e o diretório `node_modules` do hospedeiro para o container. Isso permite ao pnpm de dentro do container naturalmente reutilizar os arquivos do hospedeiro como reflinks.

Abaixo temos um exemplo de configuração de container para demonstração:

```dockerfile title="Dockerfile"
FROM node:20-slim

# corepack é uma feature experimental no Node.js v20 que permite
# instalar e gerenciar versões do pnpm, npm e yarn
RUN corepack enable

VOLUME [ "/pnpm-store", "/app/node_modules" ]
RUN pnpm config --global set store-dir /pnpm-store

# Pode ser necessário copiar mais arquivos além do package.json em seu código
COPY package.json /app/package.json

WORKDIR /app
RUN pnpm install
RUN pnpm run build
```

Execute o seguinte comando para construir a imagem do podman:

```sh
podman build . --tag my-podman-image:latest -v "$HOME/.local/share/pnpm/store:/pnpm-store" -v "$(pwd)/node_modules:/app/node_modules"
```
