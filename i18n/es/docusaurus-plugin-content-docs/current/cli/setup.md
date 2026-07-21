---
id: setup
title: pnpm setup
---

Este comando es utilizado por los scripts de instalación independientes de pnpm. For instance, in [https://get.pnpm.io/install.sh][].

El instalador realizará las siguientes acciones:

* crea un directorio /home para el pnpm CLI
* actualiza el archivo de configuración para añadir el directorio /home al `PATH`
* copia el ejecutable pnpm en el directorio /home creado

:::tip

After upgrading to pnpm v11, run `pnpm setup` to update your shell configuration. In v11, globally installed binaries are stored in a `bin` subdirectory of `PNPM_HOME`.

:::

[https://get.pnpm.io/install.sh]: https://get.pnpm.io/install.sh