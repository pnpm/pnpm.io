---
id: pack
title: pnpm pack
---

Cria um tarball a partir de um pacote.

## Opções

### --recursive, -r

Added in: v10.11.0

Pack all packages from the workspace.

### --out &lt;path\>

Customizes the output path for the tarball. Use `%s` and `%v` to include the package name and version, e.g., `%s.tgz` or `some-dir/%s-%v.tgz`. By default, the tarball is saved in the current working directory with the name `<package-name>-<version>.tgz`.

### --pack-destination &lt;dir\>

Diretório no qual `pnpm pack` salvará os tarballs. O padrão é o diretório de trabalho atual.

### --pack-gzip-level &lt;level\>

Especifica diferentes níveis de compressão.

### --json

Exibe o log de saída no formato JSON.

### --filter &lt;package_selector\>

Added in: v10.11.0

[Leia mais sobre filtragem.](../filtering.md)

### --dry-run

Added in: v10.26.0

Does everything a normal run does, except actually packing the tarball. Useful for verifying the contents of the tarball.

## Scripts de Life Cycle

* `prepack`
* `prepare`
* `postpack`

:::tip

You can also use the [`beforePacking` hook](../pnpmfile.md#hooksbeforepackingpkg-pkg--promisepkg) to programmatically modify the `package.json` contents before the tarball is created. This is useful for removing development-only fields or adding publication metadata without modifying your local `package.json`.

:::

