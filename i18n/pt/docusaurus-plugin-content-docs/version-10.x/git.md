---
id: git
title: Trabalhando com Git
---

## Lockfiles

You should always commit the lockfile (`pnpm-lock.yaml`). Isso deve ser feito por uma infinidade de razões, as principais sendo:

- permite uma instalação mais rápida para ambientes de Integração Contínua e de produção, por permitir que a resolução do pacote não precise ser feita
- impõe instalações consistentes entre ambientes de desenvolvimento, testagem e produção, significando que os pacotes utilizados durante testes e em produção serão exatamente os mesmos utilizados quando você desenvolveu o projeto

### Conflitos de mesclagem

pnpm can automatically resolve merge conflicts in `pnpm-lock.yaml`.
If you have conflicts, just run `pnpm install` and commit the changes.

Tenha cuidado, no entanto. É recomendado que você reveja as alterações antes de gravar as alterações, pois nós não podemos garantir que pnpm vai escolher corretamente - ao invés disso, ele escolhe as versões mais recentes, que é ideal na maioria dos casos.
