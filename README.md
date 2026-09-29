# pnpm.io

[![](https://developer.stackblitz.com/img/open_in_codeflow.svg)](https://stackblitz.com/~/github.com/pnpm/pnpm.io)

The blog (`blog/`), website application, translations, and deployment live here.
The v12 documentation is edited in [pnpm/docs](https://github.com/pnpm/pnpm/tree/main/pnpm/docs)
and the v11 documentation in [pnpm11/docs](https://github.com/pnpm/pnpm/tree/main/pnpm11/docs).
The `docs/` and `versioned_docs/version-11.x/` trees, their sidebars, and their
`static/docs-assets/` files here are generated publication copies. Do not edit
those copies directly. V10, archived versions, pnpr docs, and the blog are still
edited here. "Edit this page" points to the repository that owns each page.

The site is made of the components in the [pnpm.website](https://bit.cloud/pnpm/website)
scope on Bit Cloud, installed as npm packages and built with Vite:
`@pnpm/website.pnpm-website` is the app, and the Vite plugin of
`@pnpm/website.docs.docs-builder` turns the Markdown into the pages of every
version and locale (see [vite.config.mjs](vite.config.mjs)).

## Testing locally

```
pnpm install
pnpm dev
```

`pnpm build` builds the whole site into `build/`, and `pnpm preview` serves it.
`pnpm check-urls` checks that the build still serves every URL that the site
served when it was built with Docusaurus (see `scripts/docusaurus-urls.txt`).

Without translations, every locale shows the English pages. To see them
translated, download the translations from Crowdin first:

```
CROWDIN_PERSONAL_TOKEN=<token> pnpm download-translations
```

## Documentation sources and versions

The source repository's release sync imports only the released pnpm version,
builds this site, and pushes the generated changes here. `docs-sync.json` records
which release and source commits each published tree came from. Keep it with the
generated content when reviewing or reverting a sync.

For local previews, run `node scripts/sync-docs.mjs /path/to/pnpm --preview`,
then `pnpm build`. Preview imports replace only the v11 and v12 documentation copies without
changing release state. Do not publish a development preview to production.

See the [source repository's documentation guide](https://github.com/pnpm/pnpm/blob/main/DOCUMENTATION.md)
for release retries, corrections that do not require a package release, and
adding a version. Keep existing Crowdin paths when changing the site layout.
The builder patch supports a separate edit URL per documentation version.
`scripts/docs-sources.mjs` maps the v11 and v12 website versions to their source
directories beside the corresponding implementations.

## How to publish

Push to the default branch, the website will be deployed automatically by the
[Deploy workflow](.github/workflows/deploy.yml).

The workflow downloads the translations from Crowdin, builds the site with all
of its locales, and ships the result to Vercel with `vercel deploy --prebuilt`.
The download is reused for an hour, because Crowdin rate limits how often it
will export a project and the default branch is deployed more often than that.

Because of that, Vercel's own git integration is turned off (see
`git.deploymentEnabled` in [vercel.json](vercel.json)) and the workflow needs
these secrets in the `deploy` environment: `VERCEL_TOKEN`, `VERCEL_ORG_ID`,
`VERCEL_PROJECT_ID`, and `CROWDIN_PERSONAL_TOKEN`.

Pull requests get a build test without the translations rather than a preview
deployment: deploying from a pull request would mean handing the credentials
of the live site to the code being reviewed. To see a change served, start the
Deploy workflow by hand with the "Publish on pnpm.io" box unticked, which
returns a preview URL instead of publishing.

The locales are listed in [locales.json](locales.json), together with the name
Crowdin uses for each of them.

## Translations

Crowdin reads the sources listed in [crowdin.yaml](crowdin.yaml).
`pnpm crowdin-upload` uploads them, including a copy of `docs/` as the latest
version, which is where the build looks for the translations of the latest
docs first.

## Algolia Search

The search box uses the Algolia DocSearch index of pnpm.io. If changes should be
done to the search index, submit the changes here to the
[docsearch-configs repository](https://github.com/algolia/docsearch-configs/blob/master/configs/pnpm.json).
