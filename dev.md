# Developers FAQ

## Build & Test?

```shell
npm run build
npm run test
```

## Release?

```shell
npm login
npm run clean
npm run build
np
```

## Check outdated packages?

```shell
npm outdated
```

## Use examples?

Every example has `link.sh` and `unlink.sh` that links the current build locally.

## Issues to not forget:

+ ⚠️ Update `types/highlight.js.d.ts` manually from [here](https://github.com/highlightjs/highlight.js/tree/main/types). It is NOT fetched automatically.
+ ⛔️ TypeScript adds `.default` to a globally defined import. That is a problem between global TS definitions and common modules (something like that.) See [this](https://stackoverflow.com/questions/41148057/why-is-typescript-adding-default-to-a-globally-defined-import). Search for `@ts-ignore DEFAULT-ISSUE`. Unresolved.
