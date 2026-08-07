---
id: production
title: Producción
---

Hay dos formas de iniciar su paquete en un entorno de producción con pnpm. Uno de ellos es hacer commit del archivo de bloqueo. Then, in your production
environment, run `pnpm install` - this will build the dependency tree using the
lockfile, meaning the dependency versions will be consistent with how they were
when the lockfile was committed. Esta es la forma más efectiva (y la que recomendamos) para asegurar que sus persiste árbol de dependencias a través de entornos.

The other method is to commit the lockfile AND copy the package store to your
production environment (you can change where with the [store location option]).
Then, you can run `pnpm install --offline` and pnpm will use the packages from
the global store, so it will not make any requests to the registry. This is
recommended **ONLY** for environments where external access to the registry is
unavailable for whatever reason.

[store location option]: settings#storeDir
