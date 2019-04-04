# Spig v1.0.1

![](src/images/spig.png)

Static website generator lightweight _framework_ using just Gulp and no-surprise JavaScript. `Spig` uses regular Gulp tasks for assets, and provides a developer-friendly extension for the web static generation.

Since `Spig` is a framework, it is very extensible and configurable.

## Try it!

Just clone/download this repo and run:

```shell
yarn install
yarn dev
open localhost:3000
```

## Read more

+ [Develop and Build with Spig](doc/BuildWithSpig.md)
+ [Quick Run](doc/QuickRun.md) - preferred way
+ [Quick Run as subtree](doc/QuickRunSubtree.md)
+ [How Spig Works](doc/HowSpigWorks.md)
+ [File and attributes](doc/FileAndAttributes.md)


## Features

+ javascript minify
+ javascript babel
+ sass compilation
+ sass minification 
+ html minification
+ images size optimization
+ images resizing
+ static copythrough
+ live reload
+ templates in: Markdown, [Nunjucks](https://mozilla.github.io/nunjucks/) (extensible)
+ layouts in [Nunjucks](https://mozilla.github.io/nunjucks/)
+ frontmatter
+ slug
+ making collections from frontmatter attributes (e.g. tags)
+ very extensible
