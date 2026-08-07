---
id: limitations
title: Limitações
---

1. `npm-shrinkwrap.json` e `package-lock.json` são ignorados. Ao contrário do pnpm, o npm pode instalar o mesmo `name@version` várias vezes e com diferentes conjuntos de dependências. O arquivo de bloqueio do npm é projetado para refletir o layout flat `node_modules`, no entanto, como o pnpm cria um layout isolado por padrão, ele não pode respeitar o formato do arquivo de bloqueio do npm. Consulte [pnpm import][] se desejar converter um arquivo de bloqueio para o formato de pnpm.
1. Binstubs (arquivos em `node_modules/.bin`) são sempre arquivos shell, não links simbólicos para arquivos JS. Os arquivos shell são criados para ajudar os aplicativos CLI conectáveis a encontrar seus plug-ins na estrutura incomum `node_modules`. Isso raramente é um problema e se você espera que o arquivo seja um arquivo JS, faça referência ao arquivo original diretamente, conforme descrito em #736 [][].

Tem uma ideia para soluções alternativas para esses problemas? [Compartilhe!](https://github.com/pnpm/pnpm/issues/new)

[pnpm import]: cli/import.md
[2]: https://github.com/pnpm/pnpm/issues/736
[3]: https://github.com/pnpm/pnpm/issues/736
