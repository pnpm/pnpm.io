---
id: releasing-apps-pt-br
title: Releasing apps
---

Existem duas maneiras de liberar um aplicativo com o pnpm. Uma maneira é cometer o `shrinkwrap.yaml` em seu repo.
Qual nós recomendamos fazer de qualquer maneira. E então no prod você terá apenas que executar o `pnpm install`.
Você terá certeza de que as mesmas dependências serão usadas, com as quais você testou seu aplicativo em outros ambientes.

Se você gostaria de copiar pacotes para prod, você terá que cometer `shrinkwrap.yaml` de qualquer maneira. E você terá que
Copie e cole a store global para produção. O local da store global é configurável
através da chave de configuração `store`.
Então você pode executar o `pnpm install --offline` no seu aplicativo e o pnpm estará usando pacotes que já estão no
store global sem fazer qualquer solicitação para o registro npm.

