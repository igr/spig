# How Spig works

`Spig` consist of two parts: 1) Gulp tasks and 2) Spig operations.

## Site structure

The whole site is defined in `/src` folder:

```
/src
  /css - SASS files
  /data - data files in JSON format
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

## Phases

All operations are executed in phases. It does not matter where and when operations are defined, it is guaranteed that new phase does not start until all the operations from previous phase are executed. This way it is possible to fine-tune the generation process.

In one phase, operations on files are executed in parallel. The order of the execution is not guaranteed!

After each phase the `site` is updated - i.e. pages are collected and so on. Phase's end serves as a synchronization point between several `Spig`s.  
  

Common phases may be: 

+ **PREPARE** - invokes all `Spig` operations that do NOT modify the content, just the meta-data or collect additional data across the whole source set.
+ **RENDER** - once when all the meta data is resolved, `Spig` executes operations that actually performs the modification of the content; like converting from Markdown to HTML.
+ **IMG** - operations on images.
