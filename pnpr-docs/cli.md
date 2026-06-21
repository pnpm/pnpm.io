---
id: cli
title: CLI reference
---

```sh
pnpr [OPTIONS]
```

## Options

| Flag | Description |
| --- | --- |
| `-c, --config <path>` | Path to a [verdaccio-shaped YAML config](configuration.md). When omitted, the global `config.yaml` in pnpr's config dir is used if it exists, otherwise the bundled default config. |
| `--listen <addr>` | Address to bind to. Defaults to `127.0.0.1:4873`. |
| `--storage <path>` | Override the [storage](configuration.md) directory from the loaded config — the source of truth for hosted packages. |
| `--cache <path>` | Override the disposable proxy-cache directory (the mirror of upstream registries plus the resolver cache). Defaults to a `.pnpr-cache` subdirectory of the storage path. |
| `--public-url <url>` | URL clients should use to reach the server, used when rewriting `dist.tarball` URLs in served packuments. Defaults to `http://<listen>`. |
| `--packument-ttl-secs <n>` | Seconds before a cached packument is considered stale and refetched. When omitted, the loaded config's value wins. |
| `--osv` | Enable local [OSV](https://osv.dev/) npm vulnerability checks. Requires a local OSV npm database zip at `--osv-db` or `<cache>/osv/npm/all.zip`. |
| `--osv-db <path>` | Path to the local OSV npm database zip or extracted JSON directory. |
| `-h, --help` | Print help. |
| `-V, --version` | Print version. |

## Logging

The log level is controlled with the standard `RUST_LOG` environment variable,
which always wins over the level set in the config file:

```sh
RUST_LOG=debug pnpr
```

## Examples

Bind to all interfaces and tell clients to reach the server through a public
hostname:

```sh
pnpr --listen 0.0.0.0:4873 --public-url https://registry.example.com
```

Run with a custom config and a separate, ephemeral cache volume:

```sh
pnpr -c ./pnpr.yaml --cache /mnt/ephemeral/pnpr-cache
```
