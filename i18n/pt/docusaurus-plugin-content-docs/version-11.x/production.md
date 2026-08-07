---
id: production
title: Produção
---

Existem duas maneiras de inicializar seu projeto num ambiente de produção com pnpm. Uma delas é fazer o commit do lockfile. Then, in your production
environment, run `pnpm install` - this will build the dependency tree using the
lockfile, meaning the dependency versions will be consistent with how they were
when the lockfile was committed. Essa é a maneira mais eficaz (e a que recomendamos) de garantir que sua árvore de dependências persista nos ambientes.

The other method is to commit the lockfile AND copy the package store to your
production environment (you can change where with the [store location option]).
Then, you can run `pnpm install --offline` and pnpm will use the packages from
the global store, so it will not make any requests to the registry. This is
recommended **ONLY** for environments where external access to the registry is
unavailable for whatever reason.

[store location option]: settings#storeDir
