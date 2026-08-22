---
id: lockfile
title: Reading `pnpm-lock.yaml`
---

`pnpm-lock.yaml` is a YAML file, but it is not always a **single** YAML
document. Depending on what the project uses, pnpm writes either one document
or two:

| Document | Contents |
| --- | --- |
| The **env lockfile** (first, when present) | [Config dependencies] and the pnpm version resolved for the project, under `configDependencies` and `packageManagerDependencies`, with the `packages` and `snapshots` entries those need |
| The **project lockfile** (last, always present) | The project's own dependency graph: `importers` with their `dependencies`, and the matching `packages` and `snapshots` |

Both documents declare the same `lockfileVersion`. That field describes the
schema of the entries inside a document, not how many documents the file
contains, so it does not change when the env document appears.

This page is for tools that read `pnpm-lock.yaml` — vulnerability scanners,
SBOM generators, dependency graph builders, and dependency update bots. If you
only use pnpm, you don't need to care about any of this.

A two-document lockfile looks like this:

```yaml title="pnpm-lock.yaml"
---
lockfileVersion: '9.0'

importers:

  .:
    configDependencies: {}
    packageManagerDependencies:
      pnpm:
        specifier: 12.0.0-rc.7
        version: 12.0.0-rc.7

packages:
  # pnpm and its platform binaries
snapshots:
  # ...
---
lockfileVersion: '9.0'

settings:
  autoInstallPeers: true

importers:

  .:
    dependencies:
      react:
        specifier: ^19.0.0
        version: 19.0.0

packages:
  # every package in the project's dependency graph
snapshots:
  # ...
```

## Take the last document

Read all documents and use the last one:

```js
import { loadAll } from 'js-yaml'

const lockfile = loadAll(await readFile('pnpm-lock.yaml', 'utf8')).at(-1)
```

This is correct for both shapes, and for every `pnpm-lock.yaml` pnpm has ever
written. Loading the file with a single-document API instead (`load()` in
js-yaml, `yaml.safe_load` in Python, `yaml.Unmarshal` into one value in Go)
either raises an error or silently returns only the first document.

If you need to detect the layout rather than always taking the last document, a
file whose first line is `---` has an env document. pnpm writes that leading
marker only when it writes two documents.

## Why the env document comes first

pnpm has to know which pnpm version to switch to, and which plugins to load,
before it can do anything else — including before it has any reason to parse a
dependency graph that may be several megabytes. Keeping that information in a
small leading document means every command reads a few kilobytes rather than
the whole file.

## When a lockfile has two documents

The env document is written when either of these applies:

- The project has [config dependencies]. Their integrity checksums are project
  content and are always recorded.
- pnpm records the pnpm version it resolved for the project, under
  `packageManagerDependencies`. This happens when the project declares
  [`devEngines.packageManager`], or pins pnpm 12 or newer through the legacy
  `packageManager` field. Setting [`pmOnFail`] to `ignore` turns it off — pnpm
  then doesn't enforce the pinned version, so it has nothing to record.

Two-document lockfiles have existed since config dependencies were introduced.
They became common in pnpm 12, which records the resolved package manager
version by default.

## Scanning for vulnerabilities

:::caution

A tool that reads only the first document of a two-document lockfile does not
fail loudly. The env document is a structurally valid lockfile — it just
describes an importer with no `dependencies`. Such a tool reports that the
project has no dependencies, and therefore no vulnerabilities, and a CI gate
built on it passes.

:::

If you scan pnpm projects:

- **Read both documents and union them.** Config dependencies are real npm
  packages, installed into `node_modules/.pnpm-config`. A tool that reads only
  the project document misses them; a tool that reads only the env document
  misses everything else.
- **Verify your scanner against a two-document lockfile before you trust its
  output.** "It reported something" is not a sufficient check here: the env
  document does contain packages, so a broken reader emits a plausible-looking
  result listing pnpm's own binaries.
- [`pnpm audit`] reads the lockfile correctly in both shapes and needs no
  configuration.

[Config dependencies]: config-dependencies.md
[`devEngines.packageManager`]: package_json.md#devenginespackagemanager
[`pmOnFail`]: settings/cli.md#pmonfail
[`pnpm audit`]: cli/audit.md
