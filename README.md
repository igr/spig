# Spig v2.0.0

![](src/images/spig.png)

Static website generator lightweight _framework_ using just Gulp and no-surprise JavaScript. **Spig** uses regular Gulp tasks for assets and provides a developer-friendly extension for the web static generation.

Since **Spig** is a framework, it is very extensible and configurable.

## Try it out!

Just clone/download this repo and run:

```shell
yarn install
yarn dev
open localhost:3000
```

NOTE: don't run anything in `/spig` folder.

## Documentation

### Intro

+ [Show Cases](doc/ShowCases.md) - real world examples
+ [Install](doc/Install.md)
+ [Develop and Build with Spig](doc/BuildWithSpig.md)

### Details

+ [How Spig Works](doc/HowSpigWorks.md)
+ [File and attributes](doc/FileAndAttributes.md)
+ [Rules and conventions](doc/Rules.md)

## Spig Features

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
