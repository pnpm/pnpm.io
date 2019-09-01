# pnpm.js.org

## Testing locally

```
cd website
pnpm install
pnpm start
```

## How to publish

```
cd website
USE_SSH=true GIT_USER=zkochan npm run publish-gh-pages
```

## Algolia Search

If changes should be done to the search index, submit the changes here to the [docsearch-configs repository](https://github.com/algolia/docsearch-configs/blob/master/configs/pnpm.json).
