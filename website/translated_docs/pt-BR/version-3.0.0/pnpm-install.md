---
id: versão-3.0.0-pnpm-install
title: pnpm install
original_id: pnpm-install
---

O `pnpm install` é usado para instalar todas as dependências de um projeto.

![](/img/demos/pnpm-install.svg)


## tl; dr

| Comando | Significado |
| - | - |
| `pnpm i --offline` | sem pedidos de rede |
| `pnpm i --frozen-lockfile` |`pnpm-lock.yaml` não é atualizado |
| `pnpm i --prefer-frozen-lockfile` | quando possível, `pnpm-lock.yaml` não é atualizado |

## store

* Padrão: **~/.pnpm-store**
* Tipo: **caminho**

O local onde todos os pacotes são salvos no disco.

A store deve estar sempre no mesmo disco em que a instalação está acontecendo. Então, haverá um armazenamento por disco.
Se houver um diretório inicial no disco atual, o armazenamento será criado em `<home dir>/.pnpm-store`. Se não há
homedir no disco, a store é criada na raiz. Por exemplo, se a instalação está acontecendo no disco `D`
então a store será criada em `D:\.pnpm-store`.

É possível definir uma store a partir de um disco diferente, mas, nesse caso, o pnpm copia, e não vincula, pacotes da store.
Links rígidos são possíveis somente dentro de um sistema de arquivos.

## offline

* Padrão: **false**
* Tipo: **Boolean**

Se for verdade, o pnpm usará apenas pacotes já disponíveis na store.
Se um pacote não for encontrado localmente, a instalação falhará.

## prefer-offline

Adicionado em: v1.28.0

* Padrão: **false**
* Tipo: **Boolean**

Se for verdadeiro, o staleness verificará se há dados em cache que serão ignorados, mas os dados ausentes serão solicitados ao servidor.
Para forçar o modo offline completo, use `--offline`.

## network-concurrency

* Padrão: **16**
* Tipo: **Número**

Controla o número máximo de solicitações HTTP que podem ser feitas simultaneamente.

## child-concurrency

* Padrão: **5**
* Tipo: **Número**

Controla o número de processos filhos executados paralelamente para construir módulos de nó.

## lock

* Padrão: **true**
* Tipo: **Boolean**

Perigoso! Se falso, a store não está bloqueada. Isso significa que várias instalações usando o mesmo
store pode funcionar simultaneamente.

Pode ser passado através de uma opção CLI. `--no-lock` para configurá-lo para false. Por exemplo: `pnpm install --no-lock`.

> Se você tiver problemas semelhantes aos descritos em [#594](https://github.com/pnpm/pnpm/issues/594), use esta opção para desativar o bloqueio.
> Enquanto isso, tentaremos encontrar uma solução que faça o trabalho de bloqueio para todos.

## ignore-pnpmfile

Adicionado em: v1.25.0

* Padrão: **false**
* Tipo: **Boolean**

`pnpmfile.js` será ignorado. Útil junto com `--ignore-scripts` quando você quer ter certeza de que
nenhum script é executado durante a instalação.

## pnpmfile

Adicionado em: v1.39.0

* Padrão: **pnpmfile.js**
* Tipo: **path**
* Exemplo: **.pnpm/pnpmfile.js**

A localização do arquivo pnpm local.

## global-pnpmfile

Adicionado em: v1.39.0

* Padrão: **null**
* Tipo: **path**
* Exemplo: **~/.pnpm/global_pnpmfile.js****

A localização de um arquivo global pnpm. Um pnpmfile global é usado por todos os projetos durante a instalação.

**NOTA:** Recomenda-se usar arquivos pnpm locais. Use somente um arquivo pnpm global, se você usar o pnpm em projetos
que não usam o pnpm como gerenciador de pacotes principal.

## independent-leaves

* Padrão: **false**
* Tipo: **Boolean**

Se true, as ligações simbólicas dependem diretamente do armazenamento global. Dependências foliares são
pacotes que não possuem dependências próprias. Definir essa configuração como `true` pode interromper alguns pacotes
que dependem da localização, mas dá uma média de **8% de melhoria na velocidade de instalação**.

## verify-store-integrity

Adicionado em: v1.8.0

* Padrão: **true**
* Tipo: **Boolean**

Se false, não verifica se os pacotes na store foram modificados.

## package-import-method

Adicionado em: v1.25.0

* Padrão: **auto**
* Tipo: **auto**, **hardlink**, **copy**, **reflink**

Controla a maneira como os pacotes são importados da store.

* **auto** - tente vincular os pacotes da store. Se falhar, recuar para copiar
* **hardlink** - pacotes de hardlink da store
* **copy** - copie os pacotes da store
* **reflink** - pacotes de reflink (aka copy-on-write) da store

## lockfile

Adicionado em: v1.32.0 (inicialmente chamado `shrinkwrap`)

* Padrão: **true**
* Tipo: **Boolean**

Quando definido como 'false', o pnpm não irá ler ou gerar um arquivo `pnpm-lock.yaml`.

## lockfile-only

Adicionado em: v1.26.0 (inicialmente chamado `shrinkwrap-only`)

* Padrão: **false**
* Tipo: **Boolean**

Quando usado, somente atualiza `pnpm-lock.yaml` e `package.json` em vez de verificar `node_modules` e baixar dependências.

## frozen-lockfile

Adicionado em: v1.37.1 (inicialmente chamado `frozen-shrinkwrap`)

* Padrão: **false**
* Tipo: **Boolean**

Se `true`, o pnpm não gera um arquivo de trava e falha se uma atualização for necessária.

## prefer-frozen-lockfile

Adicionado em: v1.37.1 (inicialmente chamado `prefer-frozen-shrinkwrap`)

* Padrão: **true** (da v1.38.0)
* Tipo: **Boolean**

Quando `true` e o disponível `pnpm-lock.yaml` satisfaz o `package.json`
então uma instalação sem cabeça é executada. Uma instalação sem cabeça é mais rápida que uma instalação normal
porque pula a resolução de dependências e a resolução de pares.

## reporter

* Padrão:
    * Para stdout TTY:  **default**
    * Para stdout não TTY: **append-only**
* Tipo:  **default**, **append-only**, **ndjson**, **silent**

Permite escolher o repórter que imprimirá informações sobre
o progresso da instalação.

* ** silencioso ** - nenhuma saída é registrada no console, exceto erros fatais
*  **default** - o repórter padrão quando o stdout é TTY
* **append-only** (adicionado na v1.29.1) - a saída é sempre anexada ao final. Nenhuma manipulação de cursor é executada
* **ndjson** - o repórter mais detalhado. Imprime todos os registros no formato [ndjson](http://ndjson.org/)

## use-store-server

Adicionado em: v1.30.0

* Padrão: **false**
* Tipo: **Boolean**

Inicia um servidor de armazenamento em segundo plano. O servidor de armazenamento continuará em execução após a conclusão da instalação.
Para parar o servidor da store, execute o comando `pnpm server stop`

## use-running-store-server

Adicionado em: v2.5.0

* Padrão: **false**
* Tipo: **Boolean**

Apenas permite a instalação com um servidor de armazenamento. Se nenhum servidor de armazenamento estiver em execução, a instalação falhará.

## side-effects-cache

Adicionado em: v1.31.0

> Estabilidade: Experimental

* Padrão: **false**
* Tipo: **Boolean**

Use e armazene em cache os resultados dos ganchos de instalação (pré/pós).

## side-effects-cache-readonly

Adicionado em: v1.31.0

> Estabilidade: Experimental

* Padrão: **false**
* Tipo: **Boolean**

Use apenas o cache de efeitos colaterais, se presente, não o crie para novos pacotes.

## shamefully-flatten

Adicionado em: v1.34.0

* Padrão: **false**
* Tipo: **Boolean**

Se for verdade, o pnpm cria um flat node_modules que se parece quase com um node_modules criado por npm ou Yarn.
Por favor use esta opção apenas quando não houver outra maneira de fazer um projeto funcionar com o pnpm.
O estrito `node_modules` criado pelo pnpm deve sempre funcionar, se isso não acontecer, provavelmente uma dependência é
faltando em `package.json`. Use essa configuração apenas como uma correção temporária.

## strict-peer-dependencies

Adicionado em: v2.15.0

* Padrão: **false**
* Tipo: **Boolean**

Se true, os comandos falham em dependências de peer ausentes ou inválidas.