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
pnpm sbom --format cyclonedx
pnpm sbom --format spdx
```

## Options

### --format &lt;format\>

The SBOM format to generate. Supported values: `cyclonedx`, `spdx`.
