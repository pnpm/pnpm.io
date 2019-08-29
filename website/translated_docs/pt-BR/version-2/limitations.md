---
id: version-2-limits
title: Limitações
original_id: limitações
---

1. `npm-shrinkwrap.json` e `package-lock.json` são ignorados. Ao contrário do pnpm, o npm pode instalar o
mesmo `name@version` várias vezes e com diferentes conjuntos de dependências.
O arquivo shrinkwrap do npm é projetado para refletir o layout `node_modules` criado
por npm. pnpm não pode criar um layout semelhante, por isso não pode respeitar
formato de arquivo de bloqueio do npm. No entanto, consulte [pnpm import](pnpm-import).
2. Você não pode publicar módulos npm com `bundleDependencies` gerenciados pelo pnpm.
3. Binstubs (arquivos em `node_modules/.bin`) são sempre arquivos shell não
links simbólicos para arquivos JS. Os arquivos shell são criados para ajudar aplicativos CLI conectáveis
em encontrar seus plugins na estrutura incomum `node_modules`. Isto é muito
raramente um problema e se você espera que o arquivo seja um arquivo js, ​​basta referenciar
arquivo original, como descrito em [#736](https://github.com/pnpm/pnpm/issues/736).
4. O Node.js não funciona com o sinalizador [--preserve-symlinks](https://nodejs.org/api/cli.html#cli_preserve_symlinks) quando executado em um projeto que usa o pnpm.

Tem uma ideia para soluções alternativas para estes problemas? [Compartilhe-os.](Https://github.com/pnpm/pnpm/issues/new)