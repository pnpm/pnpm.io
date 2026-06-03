---
id: sbom
title: pnpm sbom
---

Added in: v11.0.0

Generate a Software Bill of Materials (SBOM) for the project.

Supported formats:

- **CycloneDX 1.7** (JSON)
- **SPDX 2.3** (JSON)

## Usage

```sh
pnpm sbom --sbom-format cyclonedx
pnpm sbom --sbom-format spdx
pnpm sbom --sbom-format cyclonedx --lockfile-only
pnpm sbom --sbom-format spdx --prod
```

## Opções

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
