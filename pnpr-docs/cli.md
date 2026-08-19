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
| `-c, --config <path>` | Path to a [YAML config](configuration.md). When omitted, the global `config.yaml` in pnpr's config dir is used if it exists, otherwise the bundled default config. |
| `--listen <addr>` | Address to bind to. Defaults to `127.0.0.1:7677`. |
| `--storage <path>` | Override the [storage](configuration.md) directory from the loaded config — the source of truth for hosted packages. |
| `--cache <path>` | Override the disposable proxy-cache directory (the mirror of upstream registries plus the resolver cache). Defaults to a `.pnpr-cache` subdirectory of the storage path. |
| `--public-url <url>` | URL clients should use to reach the server, used when rewriting `dist.tarball` URLs in served packuments. Defaults to `http://<listen>`. |
| `--packument-ttl-secs <n>` | Seconds before a cached packument is considered stale and refetched. When omitted, the loaded config's value wins. |
| `--osv` | Enable local [OSV](https://osv.dev/) npm vulnerability checks. Requires a local OSV npm database zip at `--osv-db` or `<cache>/osv/npm/all.zip`. |
| `--osv-db <path>` | Path to the local OSV npm database zip or extracted JSON directory. |
| `--disable-registry` | Disable the npm registry surface (packument and tarball reads, publish, unpublish, dist-tags, and search) that is otherwise served whenever the config declares at least one registry. The health and login/token endpoints stay available. |
| `--disable-resolver` | Disable the install-accelerator surface: `GET /-/pnpr`, `POST /-/pnpr/v0/resolve`, and `POST /-/pnpr/v0/verify-lockfile`. Overrides `resolver.enabled`. |
| `-h, --help` | Print help. |
| `-V, --version` | Print version. |

## Logging

The log level is controlled with the standard `RUST_LOG` environment variable,
which always wins over the level set in the config file:

```sh
RUST_LOG=debug pnpr
```

The config `log.level` accepts `trace`, `debug`, `http`, `info`, `warn`, and
`error`. `http` enables one access-log record per request while keeping the
rest of the crate quieter.

## Examples

Bind to all interfaces and tell clients to reach the server through a public
hostname:

```sh
pnpr --listen 0.0.0.0:7677 --public-url https://registry.example.com
```

Run with a custom config and a separate, ephemeral cache volume:

```sh
pnpr -c ./pnpr.yaml --cache /mnt/ephemeral/pnpr-cache
```

Run only the pnpr resolver endpoints, without exposing an npm registry surface:

```sh
pnpr --disable-registry
```
