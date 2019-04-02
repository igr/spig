# How Spig works

`Spig` consist of two parts: 1) Gulp tasks and 2) Spig operations.

## Site structure

The whole site is defined in `/src` folder:

```
/src
  /css - SASS files
  /filters - filters used in templates
  /images - all the images
  /js - javascript files and modules
  /lambda - Netlify lambdas
  /layouts - page layouts
  /site - all site (markdown) pages and assets
  /static - files that will be simply copied
```  

Configuration `json` files can be founded in `src` folder as well:

+ `site.json` - site configuration
+ `dev.json` - development related configuration

## Gulp tasks

Gulp tasks are defined in `spig/tasks` folder. There is no surprise here: this is just a common gulp tasks you would use any way. The all operate on all the folders except for the `src/site`: 
 

## Spig operations

`Spig` operations are simple JavaScript functions that operate just on _files_ - JSON objects that contains the file and all the metadata. `Spig` operations do whatever it takes to make website content from the source, e.g. Markdown files.

## Two phases

All operations are executed in two phases:

+ PHASE 1 - invokes all `Spig` operations that do NOT modify the content, just the meta-data or collect additional data across the whole source set.
+ PHASE 2 - once when all the meta data is resolved, `Spig` executes operations that actually performs the modification of the content; like converting from Markdown to HTML.

This way we can e.g. perform collection or analysis of all the pages, or even add virtual pages (for tags) and so on.
