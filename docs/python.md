---
id: python
title: Python dependencies
---

Added in: v12.4.0 (pnpm v12 only)

:::warning

Multi-ecosystem support is experimental. The settings and the layout it writes may change.

:::

pnpm can install a project's Python dependencies alongside its npm packages. One `pnpm install` resolves both graphs, uses pnpm's connection budget, and stores every verified wheel in pnpm's content-addressable store, so a wheel fetched for one project is reused by the next.

Turn it on in `pnpm-workspace.yaml`:

```yaml title="pnpm-workspace.yaml"
python:
  enabled: true
```

pnpm reads the project's `pyproject.toml`, writes a [`pylock.toml`](https://packaging.python.org/en/latest/specifications/pylock-toml/), and builds an environment for it.

## Adding a package

Prefix the requirement with `pypi:`:

```sh
pnpm add pypi:httpx
pnpm add pypi:httpx@0.28.1
pnpm add pypi:'httpx>=0.28'
pnpm add -D pypi:pytest
```

A bare `name@version` is written as an exact pin (`httpx==0.28.1`). A requirement that already carries a comparison operator is kept as written, and the full [PEP 508](https://peps.python.org/pep-0508/) grammar is accepted, environment markers and extras included.

## The environment

Each project with a `pyproject.toml` gets a `.venv` in its own directory. It is a symlink into `.pnpm/python-envs/`, and pnpm swaps the link atomically when the environment changes, so a failed install leaves the previous environment in place.

pnpm refuses to touch a `.venv` it did not create, so an existing hand-made virtual environment is never replaced.

[`pnpm run`](./cli/run.md) and [`pnpm exec`](./cli/exec.md) put the environment's script directory (`.venv/bin`, or `.venv/Scripts` on Windows) at the front of `PATH`, so a script can call `pytest` or `ruff` without activating anything.

Python requirement, marker, and lockfile semantics are kept separate from npm's and Cargo's. What is shared is the plumbing below them: the HTTP and authentication budget, artifact verification, and the store.

`--lockfile-only`, `--frozen-lockfile`, and `--offline` apply to Python dependencies too.

## Selecting extras and dependency groups per project

Workspace `python.extras` and `python.groups` are defaults. Each project selects only the names it defines, so members with different extras and groups can install together. For example, `groups: [dev, test]` selects both groups in a project that defines both, and only `dev` in a project that defines just `dev`.

Override either list in the project's `pyproject.toml`:

```toml title="pyproject.toml"
[tool.pnpm.python]
extras = ["cli"]
groups = ["test"]
```

The lists override their workspace defaults independently. Omitting a list keeps its workspace default. An empty list disables that default for the project.

Explicit project selections must exist in that project. Selected groups' `include-group` references must exist and cannot form cycles. Extra names follow Python's normalization rules, so `dev_tools` and `dev-tools` select the same extra. These rules also apply to extras obtained from dynamic build-backend metadata.

Selections participate in locking. `--prod` and `--dev` choose which dependencies to install without changing the complete lockfile. A requirement on another project's extra, such as `library[cli]`, selects that distribution extra independently of `library`'s own installation settings.

## Faster resolution through pnpr

With [`pnprServer`](/pnpr/install-acceleration) set, the server resolves the Python graph, so pnpm does not have to download a wheel to find out what it requires. A server that does not answer for Python makes pnpm fall back to resolving locally.

Python graphs configured with extra indexes, overrides, or constraints resolve locally. pnpr cannot represent these resolution settings.

## Settings

### python.enabled

* Default: **false**
* Type: **Boolean**

Whether `pnpm install` resolves and installs the project's Python dependencies.

### python.executable

* Default: **python3** (**python** on Windows)
* Type: **String**

The interpreter pnpm probes and builds environments with.

### python.indexUrl

* Default: **https://pypi.org/simple/**
* Type: **String**

The [Simple Repository API](https://packaging.python.org/en/latest/specifications/simple-repository-api/) root pnpm resolves against. Indexes must support the Simple JSON API. HTML-only indexes are not supported.

Python index credentials are configured separately from npm registry credentials. Credentials included in an index URL are scoped to that index's URL path and removed from lockfiles. Authenticated index caches are separated by a credential fingerprint. Raw credentials never appear in cache keys.

### python.extraIndexUrls

Added in: v12.5.0

* Default: **[]**
* Type: **String[]**

Additional Simple JSON indexes to search, in listed order before `python.indexUrl`. The first index containing a distribution supplies its versions. pnpm does not combine versions from multiple indexes or try another index when the first one's versions do not satisfy a requirement.

Only a 404 response tries the next index. Authentication errors and other failures stop resolution. Missing index pages are cached for offline resolution.

Each configured index owns authentication for its URL path. An index without credentials is fetched anonymously, even when its path is beneath another authenticated index.

```yaml title="pnpm-workspace.yaml"
python:
  enabled: true
  extraIndexUrls:
    - https://packages.example.org/simple/
```

### python.overrides

Added in: v12.5.0

* Default: **[]**
* Type: **String[]**

[PEP 508 registry requirements](https://packaging.python.org/en/latest/specifications/dependency-specifiers/) that replace matching dependency version requirements throughout the Python graph. Environment markers select where an override applies. An active override replaces the original extras with the extras it requests.

An override does not add a dependency that the graph does not already require. URL requirements cannot be used as overrides. Version rules preserve Git or direct wheel sources already declared for a dependency.

### python.constraints

Added in: v12.5.0

* Default: **[]**
* Type: **String[]**

PEP 508 registry requirements that narrow the permitted versions of matching Python dependencies. Constraints do not add dependencies or replace their version requirements. Environment markers select where a constraint applies, and URL requirements cannot be used as constraints.

Overrides and constraints can be used together:

```yaml title="pnpm-workspace.yaml"
python:
  enabled: true
  overrides: ['urllib3>=2']
  constraints: ['urllib3<3']
```

pnpm also reads `[tool.uv]` `override-dependencies` and `constraint-dependencies` from `pyproject.toml`. In a declared uv workspace, these lists come from the workspace root manifest. Otherwise, they come from each project's manifest. They are combined with the pnpm workspace settings.

These rules apply to project dependencies. They do not apply to isolated build-backend dependencies. Changing the index list, overrides, or constraints invalidates `pylock.toml`, and `--frozen-lockfile` rejects those changes.

### Importing wheel files

Python uses [packageImportMethod](./settings/node-modules.md#packageimportmethod) to import unchanged wheel files into project environments. It uses the same methods and `auto` default as npm packages.

Use `clone-or-copy` for copy-on-write clones with a copy fallback, or `copy` for independent files. `clone` requires filesystem support for cloning.

:::warning

Hardlinked wheel files share writes with the store and other hardlinked environments. The `auto` method can select hardlinks. Use `clone-or-copy` or `copy` if installed files may be modified.

:::

Isolated build environments also use `packageImportMethod`, but replace `auto` and `hardlink` with `clone-or-copy` to keep build backend writes private.

Generated metadata, entry-point scripts, and wheel scripts whose shebangs or permissions need changing remain private in every mode.

```yaml title="pnpm-workspace.yaml"
packageImportMethod: clone-or-copy
python:
  enabled: true
```

### python.extras

* Default: **[]**
* Type: **String[]**

The default [extras](https://packaging.python.org/en/latest/specifications/dependency-specifiers/#extras) to install in each project. Names a project does not define are skipped. `[tool.pnpm.python].extras` in the project's `pyproject.toml` overrides this list.

### python.groups

* Default: **['dev']**
* Type: **String[]**

The default [dependency groups](https://peps.python.org/pep-0735/) to install in each project. Names a project does not define are skipped. `[tool.pnpm.python].groups` in the project's `pyproject.toml` overrides this list.
