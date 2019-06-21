---
id: workspace-pt-br
title: Área de trabalho
---

O pnpm suporta ações simultâneas em repositórios multi-pacotes (espaços de trabalho).

Por padrão, quando você executa os comandos [`pnpm recursive [action]`](pnpm-recursive.md),
todos os diretórios são procurados por pacotes (diretórios com o arquivo `package.json`).
Você pode controlar quais diretórios são procurados passando uma matriz de globs para `packages` em` pnpm-workspace.yaml`.

Um exemplo de um `pnpm-workspace.yaml`:

`` `yaml
packages:
  # the root package.json
  - '.'
  # todos os pacotes em subdiretórios de pacotes/ e components/
  - 'packages/**'
  - 'components/**'
  # exclui pacotes que estão dentro de testes / diretórios
  - '!**/teste/**'
`` `

`pnpm-workspace.yaml` deve estar na raiz da área de trabalho.

