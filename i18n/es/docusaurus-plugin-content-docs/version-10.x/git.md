---
id: git
title: Trabajando con Git
---

## Archivos de bloqueo

You should always commit the lockfile (`pnpm-lock.yaml`). Esto se debe a una multitud de razones, la principal de las cuales es:

- habilita una instalación más rápida para CI y entornos de producción, ya que es capaz de omitir la resolución de paquetes
- impone instalaciones y resoluciones coherentes entre desarrollo y producción, lo que significa que los paquetes utilizados en prueba y producción serán exactamente los mismos que cuando desarrolló su proyecto

### Combinar conflictos

pnpm can automatically resolve merge conflicts in `pnpm-lock.yaml`.
If you have conflicts, just run `pnpm install` and commit the changes.

Tenga cuidado, sin embargo. Se recomienda que revise los cambios antes de realizar un commit, porque no podemos garantizar que elegirá el encabezado correcto - en su lugar se compila con los archivos de bloqueo más actualizados, lo que es ideal en la mayoría los casos.
