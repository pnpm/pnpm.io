---
id: production
title: Produção
---

Existem duas maneiras de inicializar seu projeto num ambiente de produção com pnpm. Uma delas é fazer o commit do lockfile. Em seguida, em seu ambiente de produção, execute `pnpm install` - Isso irá construir a árvore de dependências usando o lockfile, o que significa que as versões de dependências serão consistentes com como elas eram quando o lockfile foi commitado. Essa é a maneira mais eficaz (e a que recomendamos) de garantir que sua árvore de dependências persista nos ambientes.

The other method is to commit the lockfile AND copy the package store to your production environment (you can change where with the [store location option][]). Em seguida, você pode executar `pnpm install --offline` e o pnpm usará os pacotes do armazenamento global, portanto, não fará nenhuma requisição ao registro. Isso é recomendado **SOMENTE** para ambientes onde o acesso externo ao registro está indisponível por qualquer motivo.

[store location option]: settings#storeDir
