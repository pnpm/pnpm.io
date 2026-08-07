---
id: production
title: Producción
---

Hay dos formas de iniciar su paquete en un entorno de producción con pnpm. Uno de ellos es hacer commit del archivo de bloqueo. A continuación, en su entorno de producción, ejecute `pnpm install` -esto construirá el árbol de dependencia utilizando el archivo de bloqueo, lo que significa que las versiones de dependencia serán coherentes con la forma en que fueron cuando se hizo commit del archivo de bloqueo. Esta es la forma más efectiva (y la que recomendamos) para asegurar que sus persiste árbol de dependencias a través de entornos.

The other method is to commit the lockfile AND copy the package store to your production environment (you can change where with the [store location option][]). Luego, puede ejecutar `pnpm install --offline` y pnpm usará los paquetes de la tienda global, por lo que no realizará ninguna solicitud al registro. Esto es recomendado **SOLAMENTE** para entornos donde el acceso externo al registro no está disponible por cualquier motivo.

[store location option]: settings#storeDir
