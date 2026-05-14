---
id: audit
title: pnpm audit
---

Verifica problemas de seguridad conocidos con respecto a los paquetes instalados.

Si se encuentran problemas de seguridad, intente actualizar sus dependencias vía `pnpm update`. If a simple update does not fix all the issues, use [overrides][] to force versions that are not vulnerable. Por ejemplo, si `lodash@<2.1.0` es vulnerable, usa estas anulaciones para forzar `lodash@^2.1.0`:

```yaml title="pnpm-workspace.yaml"
overrides:
  "lodash@<2.1.0": "^2.1.0"
```

O bien, ejecute `pnpm audit -- fix`.

If you want to tolerate some vulnerabilities as they don't affect your project, you may use the [`auditConfig.ignoreGhsas`][] setting.

Since v11, `pnpm audit` queries the registry's `/-/npm/v1/security/advisories/bulk` endpoint. The response does not include CVE identifiers, so advisories are filtered by GitHub advisory ID (GHSA) instead. If you previously listed CVEs under `auditConfig.ignoreCves`, replace each entry with the corresponding `GHSA-xxxx-xxxx-xxxx` value (shown in the `More info` column of `pnpm audit` output) under `auditConfig.ignoreGhsas`.

## Opciones

### --audit-level &lt;severity\>

* Tipo: **low**, **moderate**, **high**, **critical**
* Por defecto: **low**

Únicamente imprime avisos con gravedad mayor o igual que `<severity>`.

This can also be set via `auditLevel` in `pnpm-workspace.yaml`.

### --fix

Add overrides to the `pnpm-workspace.yaml` file in order to force non-vulnerable versions of the dependencies.

Use `--fix=update` (added in v11.0.0) to fix vulnerabilities by updating packages in the lockfile instead of adding overrides.

When [`minimumReleaseAge`](../settings.md#minimumreleaseage) is set, `--fix` also adds the minimum patched version of each advisory to [`minimumReleaseAgeExclude`](../settings.md#minimumreleaseageexclude) in `pnpm-workspace.yaml`, so the security fix can be installed without waiting for the release age window.

### --interactive, -i

Added in: v11.0.0

Review the advisories selected by `--fix` and pick which ones to apply. Only usable together with `--fix`.

### --json

Muestra el informe de auditoría en formato JSON.

### --dev, -D

Solo audita dependencias de desarrollo.

### --prod, -P

Solo audita las dependencias de producción.

### --no-optional

No audita `optionalDependencies`.

### --ignore-registry-errors

Si el registro responde con un código de estado que no es 200, el proceso debe salir con 0. Por lo tanto, el proceso fallará solo si el registro realmente responde con éxito con las vulnerabilidades encontradas.

### --ignore-unfixable

Added in: v10.11.0

Ignore all advisories with no resolution.

Since v11, unfixable advisories are tracked by GHSA rather than CVE.

### --ignore &lt;vulnerability\>

Added in: v10.11.0

Ignore a vulnerability by its GitHub advisory ID (GHSA). Before v11 this flag accepted CVE identifiers.

## Configuración

### auditConfig

#### auditConfig.ignoreGhsas

A list of GHSA codes that will be ignored by the [`pnpm audit`][] command.

```yaml
auditConfig:
  ignoreGhsas:
    - GHSA-42xw-2xvc-qx8m
    - GHSA-4w2v-q235-vp99
    - GHSA-cph5-m8f7-6c5x
    - GHSA-vh95-rmgr-6w4m
```

Before v11, `auditConfig.ignoreCves` was used to filter advisories by CVE identifier. That setting is no longer recognized.

[overrides]: ../settings.md#overrides
[`auditConfig.ignoreGhsas`]: #auditconfigignoreghsas

[`pnpm audit`]: #
