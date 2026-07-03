---
id: storage
title: Storage backends (S3 / R2)
---

pnpr keeps two kinds of data:

- **Hosted** — the source of truth: packages published to this server plus
  anything served in static mode. Lives under `storage`.
- **Cache** — the disposable mirror of upstream registries plus the resolver
  cache, lockfile-verdict cache, and S3 upload staging scratch. Lives under
  `cache` (defaults to `<storage>/.pnpr-cache`).

By default both are local directories. Adding an `s3:` block moves the **hosted**
store into an S3-compatible object store, so the durable data is replicated by
the provider and can be shared by several stateless pnpr replicas. The cache
always stays on local disk — only the hosted package store is pluggable.

Because any S3-compatible endpoint works, this also covers **Cloudflare R2**,
**MinIO**, **Backblaze B2**, **Wasabi**, etc. — point `endpoint` at the right
host.

```yaml
storage: ./storage
# cache: ./cache     # local proxy cache + resolver cache + S3 upload staging

s3:
  bucket: my-pnpr-packages
  region: auto
  # Omit `endpoint` for AWS S3. For R2 use the account endpoint:
  endpoint: https://<account-id>.r2.cloudflarestorage.com
  # Optional key prefix, so one bucket can hold more than the hosted store:
  prefix: packages
  # Credentials. Omit these to fall back to the standard
  # AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY environment variables.
  accessKeyId: ${PNPR_S3_ACCESS_KEY_ID}
  secretAccessKey: ${PNPR_S3_SECRET_ACCESS_KEY}
```

## Options

| Key | Required | Description |
| --- | --- | --- |
| `bucket` | yes | Bucket the hosted packages are stored in. |
| `region` | no | AWS S3 needs a real region (e.g. `us-east-1`); Cloudflare R2 uses `auto`. |
| `endpoint` | no | Custom endpoint for S3-compatible providers. Omit for AWS S3; for R2 it's `https://<account-id>.r2.cloudflarestorage.com`; for MinIO it's e.g. `http://127.0.0.1:9000`. |
| `prefix` | no | Key prefix every object is stored under. |
| `accessKeyId` | no | Access key. Falls back to `AWS_ACCESS_KEY_ID` when unset. |
| `secretAccessKey` | no | Secret key. Falls back to `AWS_SECRET_ACCESS_KEY` when unset. |
| `forcePathStyle` | no | Use path-style addressing (`endpoint/bucket/key`) instead of virtual-hosted (`bucket.endpoint/key`). MinIO typically needs `true`; AWS and R2 work with the default. |
| `allowHttp` | no | Allow plain-HTTP endpoints — needed for a local MinIO over `http://`. Defaults to HTTPS-only. |

## A complete Cloudflare R2 example

```yaml
# pnpr.yaml
storage: ./storage

s3:
  bucket: my-pnpr-packages
  region: auto
  endpoint: https://abc123def456.r2.cloudflarestorage.com

registries:
  local:
    type: hosted
    packages:
      '@mycompany/*':
        publish: $authenticated

  npmjs:
    type: upstream
    url: https://registry.npmjs.org/
    public: true

  main:
    type: router
    sources: [local, npmjs]

defaultRegistry: main
```

```sh
export AWS_ACCESS_KEY_ID="<r2-access-key-id>"
export AWS_SECRET_ACCESS_KEY="<r2-secret-access-key>"
pnpr -c ./pnpr.yaml --listen 0.0.0.0:7677 --public-url https://registry.example.com
```

`--public-url` rewrites the `dist.tarball` URLs in served packuments, so clients
fetch tarballs back through this server rather than the upstream.

## A local MinIO over plain HTTP

MinIO over `http://` needs `forcePathStyle` and `allowHttp`:

```yaml
s3:
  bucket: pnpr
  region: us-east-1
  endpoint: http://127.0.0.1:9000
  forcePathStyle: true
  allowHttp: true
  accessKeyId: minioadmin
  secretAccessKey: minioadmin
```
