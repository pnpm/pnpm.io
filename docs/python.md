---
id: python
title: Python dependencies
---

Added in: v12.4.0 (pnpm v12 only)

:::warning

Multi-ecosystem support is experimental. The settings and the layout it writes may change.

:::

pnpm can install a project's Python dependencies alongside its npm packages. One `pnpm install` resolves both graphs, shares the same connection budget and credentials, and stores every verified wheel in pnpm's content-addressable store, so a wheel fetched for one project is reused by the next.

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

## Faster resolution through pnpr

With [`pnprServer`](/pnpr/install-acceleration) set, the server resolves the Python graph, so pnpm does not have to download a wheel to find out what it requires. A server that does not answer for Python makes pnpm fall back to resolving locally.

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

The [Simple Repository API](https://packaging.python.org/en/latest/specifications/simple-repository-api/) root pnpm resolves against.

### python.extras

* Default: **[]**
* Type: **String[]**

The [extras](https://packaging.python.org/en/latest/specifications/dependency-specifiers/#extras) of the project to install.

### python.groups

* Default: **['dev']**
* Type: **String[]**

The [dependency groups](https://peps.python.org/pep-0735/) to install.
