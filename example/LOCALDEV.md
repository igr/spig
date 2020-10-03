# Local development

Link `spignite` a.k.a. **Spig**.

```sh
cd ..
npm link
```

Link the Spig to this Example repo:

```sh
cd example
npm link spignite
```

## Build site

```sh
build.sh
```

## Unlink

```sh
cd example
npm unlink --no-save spignite
```
