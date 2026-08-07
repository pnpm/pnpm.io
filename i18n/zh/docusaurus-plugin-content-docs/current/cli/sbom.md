---
id: sbom
title: pnpm sbom
---

添加于：v11.0.0

Generate a Software Bill of Materials (SBOM) for the project.

Supported formats:

- **CycloneDX 1.7** (JSON)
- **SPDX 2.3** (JSON)

## 使用方法

```sh
pnpm sbom --sbom-format cyclonedx
pnpm sbom --sbom-format spdx
pnpm sbom --sbom-format cyclonedx --lockfile-only
pnpm sbom --sbom-format spdx --prod
```

## 配置项

### --sbom-format &lt;cyclonedx|spdx\>

The SBOM output format. This option is required. Supported values: `cyclonedx`, `spdx`.

### --sbom-type &lt;library|application\>

- Default: **library**

The component type for the root package.

### --lockfile-only

Only use lockfile data (skip reading from the store).

### --sbom-authors &lt;names\>

Comma-separated list of SBOM authors. Written to `metadata.authors` in the CycloneDX output.

### --sbom-supplier &lt;name\>

SBOM supplier name. Written to `metadata.supplier` in the CycloneDX output.

### --prod, -P

Only include `dependencies` and `optionalDependencies`.

### --dev, -D

Only include `devDependencies`.

### --no-optional

Don't include `optionalDependencies`.
