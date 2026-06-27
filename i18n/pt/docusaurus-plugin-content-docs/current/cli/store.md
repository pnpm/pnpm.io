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

Funcionalidade equivalente ao comando [`pnpm add`][], exceto que esse adiciona novos pacotes no armazenamento diretamente sem modificar nenhum projeto ou arquivo de fora.

### prune

Remove _pacotes sem referências_.

Pacotes não referenciados são pacotes que não são usados por nenhum projeto no sistema. Pacotes podem se tornar não referenciados quando muitas operações de instalações tornam dependências redudantes.

Por exemplo, durante `pnpm install`, o pacote `foo@1.0.0` é atualizado para `foo@1.0.1`. pnpm vai manter `foo@1.0.0` no armazenamento global, já que os pacotes não serão removidos automaticamente. Caso o pacote `foo@1.0.0` não seja usado por mais nenhum projeto no sistema, ele se torna um pacote não referenciado. Executar `pnpm store prune` removeria `foo@1.0.0` do armazenamento global.

Executar `pnpm store prune` não é prejudicial nem tem efeitos colaterais em seus projetos. Caso instalações futuras precisem dos pacotes removidos, pnpm irá baixá-los novamente.

É recomendado que se execute `pnpm store prune` ocasionalmente para limpar o armazenamento global, mas não com muita frequência. Algumas vezes, pacotes não referenciados podem ser exigidos novamente. Isso poderia acontecer ao trocar de branch e ter que instalar dependências mais antigas, que teriam que ser baixadas novamente, tornando o processo de instalação mais lento.

After pruning, pnpm displays the total size of removed files.

When the [global virtual store][] is enabled, `pnpm store prune` also performs mark-and-sweep garbage collection on the global virtual store's `links/` directory. Projects using the store are registered via symlinks in `{storeDir}/v11/projects/`, allowing pnpm to track active usage and safely remove unused packages from the global virtual store.

### path

Retorna o caminho do diretório de armazenamento.

[`pnpm add`]: ./add.md

[global virtual store]: ../settings.md#enableglobalvirtualstore
