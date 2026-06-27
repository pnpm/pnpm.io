---
id: store
title: pnpm store
---

Gerenciando o armazenamento de pacotes.

## Comandos

### status

Verifica se há pacotes modificados no armazenamento.

Retorna o código de saída 0 se o conteúdo do pacote for o mesmo que no momento da descompactação.

### add

Functionally equivalent to [`pnpm add`], except this adds new packages to the
store directly without modifying any projects or files outside of the store.

[`pnpm add`]: ./add.md

### prune

Removes _unreferenced packages_ from the store.

Pacotes não referenciados são pacotes que não são usados por nenhum projeto no sistema. Pacotes podem se tornar não referenciados quando muitas operações de instalações tornam dependências redudantes.

For example, during `pnpm install`, package `foo@1.0.0` is updated to
`foo@1.0.1`. pnpm will keep `foo@1.0.0` in the store, as it does not
automatically remove packages. If package `foo@1.0.0` is not used by any other
project on the system, it becomes unreferenced. Running `pnpm store prune` would
remove `foo@1.0.0` from the store.

Running `pnpm store prune` is not harmful and has no side effects on your
projects. Caso instalações futuras precisem dos pacotes removidos, pnpm irá baixá-los novamente.

It is best practice to run `pnpm store prune` occasionally to clean up the
store, but not too frequently. Algumas vezes, pacotes não referenciados podem ser exigidos novamente. Isso poderia acontecer ao trocar de branch e ter que instalar dependências mais antigas, que teriam que ser baixadas novamente, tornando o processo de instalação mais lento.

When the [global virtual store] is enabled, `pnpm store prune` also performs mark-and-sweep garbage collection on the global virtual store's `links/` directory. Projects using the store are registered via symlinks in `{storeDir}/v10/projects/`, allowing pnpm to track active usage and safely remove unused packages from the global virtual store.

[global virtual store]: ../settings.md#enableglobalvirtualstore

Please note that this command is prohibited when a [store server] is running.

[store server]: ./server.md

### path

Retorna o caminho do diretório de armazenamento.
