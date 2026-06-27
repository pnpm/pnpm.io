---
id: only-allow-pnpm
title: Permita apenas pnpm
---

Quando você usa pnpm num projeto, você não quer que outros acidentalmente executem `npm install` ou `yarn`. Para evitar que os desenvolvedores utilizes outros gerenciadores de pacote, você pode adicionar o seguinte script `preinstall` em seu `package.json`:

```json
{
    "scripts": {
        "preinstall": "npx only-allow pnpm"
    }
}
```

Agora, sempre que alguem executar `npm install` ou `yarn`, eles irão receber um erro e a instalação não continuará.

Se você utiliza npm v7, use `npx -y` ao invés disso.
