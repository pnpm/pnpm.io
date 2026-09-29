# pnpm.io

[![](https://developer.stackblitz.com/img/open_in_codeflow.svg)](https://stackblitz.com/~/github.com/pnpm/pnpm.io)

The content of pnpm.io lives here: the docs (`docs/` for the latest version,
`versioned_docs/` for older ones), the pnpr registry docs (`pnpr-docs/`), the
blog (`blog/`) and the files served as they are (`static/`). The site around it
is made of the components in the [pnpm.website](https://bit.cloud/pnpm/website)
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

## Adding a docs version

When a new major version of pnpm comes out, the docs of the previous one get
frozen:

1. Copy `docs/` to `versioned_docs/version-<previous>` and `sidebars.json` to
   `versioned_sidebars/version-<previous>-sidebars.json`.
2. Add the new version to the top of [versions.json](versions.json).
3. Replace `version-<previous>` with `version-<new>` in the `copy-docs` script of
   [package.json](package.json) and in [.gitignore](.gitignore). That path is
   the throwaway copy of `docs/` that `pnpm crowdin-upload` makes, and until
   it is changed, the frozen docs of step 1 are ignored by git and overwritten
   by the next upload.

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
