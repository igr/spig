# Developers FAQ

## Build & Test?

```shell
npm run build
npm run test
```

## Check outdated packages?

```shell
npm outdated
```

## Use examples?

Every example has `link.sh` and `unlink.sh` that links the current build locally.

## Issues to not forget:

+ Update `types/highlight.js.d.ts` manually from [here](https://github.com/highlightjs/highlight.js/tree/main/types). It is NOT fetched automatically.
