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
NODE_OPTIONS=--max-old-space-size=10000 USE_SSH=true GIT_USER=zkochan pnpm deploy
```

## Algolia Search

If changes should be done to the search index, submit the changes here to the [docsearch-configs repository](https://github.com/algolia/docsearch-configs/blob/master/configs/pnpm.json).
