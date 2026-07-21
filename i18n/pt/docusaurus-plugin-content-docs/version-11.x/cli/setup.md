---
id: setup
title: pnpm setup
---

Este comando é utilizado pelos scripts de instalação independentes do pnpm. For instance, in [https://get.pnpm.io/install.sh].

Realiza as seguintes ações:

- cria um diretório inicial para a CLI do pnpm
- adds the pnpm home directory to the `PATH` by updating the shell configuration file
- copia o executável do pnpm para o diretório inicial do pnpm

:::tip

After upgrading to pnpm v11, run `pnpm setup` to update your shell configuration. In v11, globally installed binaries are stored in a `bin` subdirectory of `PNPM_HOME`.

:::

[https://get.pnpm.io/install.sh]: https://get.pnpm.io/install.sh