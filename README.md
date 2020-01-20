# Spig v2.0.0

![](src/images/spig.png)

Lightweight static website generator _framework_ in pure JavaScript.

**Spig** is a framework; very extensible and configurable.

## Try it out!

Just clone/download this repo and run following in root:

```shell
yarn install
yarn dev
open localhost:3000
```

## Documentation

### Intro

+ [Install](doc/Install.md)
+ [Develop and Build with Spig](doc/BuildWithSpig.md)

### Details

+ [How Spig Works](doc/HowSpigWorks.md)
+ [File and attributes](doc/FileAndAttributes.md)
+ [Rules and conventions](doc/Rules.md)

## Spig Features

+ [Show Cases](doc/ShowCases.md) - real world examples

+ node v12
+ javascript minify
+ javascript babel ES6
+ sass compilation
+ sass minification
+ html minification
+ html syntax highlighting
+ images size optimization
+ images resizing
+ static copythrough
+ templates in: Markdown, [Nunjucks](https://mozilla.github.io/nunjucks/)...
+ layouts in [Nunjucks](https://mozilla.github.io/nunjucks/)
+ frontmatter
+ slug
+ permalinks
+ making collections from frontmatter attributes (e.g. tags)
+ data folder
+ static and dynamic attributes
+ summaries
+ reading time
+ configuration in `.js` and/or `.json`
+ build in phases
+ sitmap generator
+ live reload (work in progress)
+ very extensible
+ netlify lambdas (or other)
