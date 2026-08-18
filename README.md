# pnpm.io

[![](https://developer.stackblitz.com/img/open_in_codeflow.svg)](https://stackblitz.com/~/github.com/pnpm/pnpm.io)

## Testing locally

```
pnpm install
pnpm start
```

## How to publish

Push to the default branch, the website will be deployed automatically by the
[Deploy workflow](.github/workflows/deploy.yml).

Docusaurus builds one locale after another, and this site has 13 of them, so the
workflow builds each locale in its own job instead: every job downloads only its
own translations from Crowdin and runs `docusaurus build --locale <locale>`. The
resulting trees are stitched back together by `scripts/assemble-site.mjs` and
shipped to Vercel with `vercel deploy --prebuilt`, as a single deployment.

Because of that, Vercel's own git integration is turned off (see
`git.deploymentEnabled` in [vercel.json](vercel.json)) and the workflow needs
these secrets in the `deploy` environment: `VERCEL_TOKEN`, `VERCEL_ORG_ID`,
`VERCEL_PROJECT_ID`, and `CROWDIN_PERSONAL_TOKEN`.

Pull requests get an English-only build test rather than a preview
deployment: deploying from a pull request would mean handing the credentials
of the live site to the code being reviewed. To see a change served, start the
Deploy workflow by hand with the "Publish on pnpm.io" box unticked, which
returns a preview URL instead of publishing.

The locales are listed in [locales.json](locales.json), together with the name
Crowdin uses for each of them. Adding a locale there adds a build job for it.

## Algolia Search

If changes should be done to the search index, submit the changes here to the [docsearch-configs repository](https://github.com/algolia/docsearch-configs/blob/master/configs/pnpm.json).
