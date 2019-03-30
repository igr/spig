# Spig

![](src/images/spig.png)

Static website generator _framework_ using just Gulp and no-surprise JavaScript. `Spig` uses regular Gulp tasks for assets, but has an extension for the web static generation.

## Quick try

Just clone/download this repo and run:

```shell
yarn install
yarn dev
```

## Quick run

`Spig` is a framework, and it is not designed to work out-of-box. 

### 1. Installation

In a project's root, add `Spig`:

```shell
git subtree add --prefix spig https://github.com/igr/spig master --squash
```
Update `Spig` any time with:

```shell
git subtree pull --prefix spig https://github.com/igr/spig master --squash
```

### 2. Project structure

`Spig` finds sources in `src` folder:

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

For faster setup, just copy the example:

```shell
cp -R spig/src src
``` 

### 3. Gulp

Welcome JavaScript:

```
cp spig/package.json .
edit package.json
yarn install
```

Add the initial `gulpfile.js`:

```javascript
"use strict";

const Spig = require('./spig/spig/spig');
const SpigConfig = require('./spig/spig/spig-config');
require('require-dir')('./spig/spig/tasks');

const datetimefmt = require('./src/filters/datetimefmt');

```

Yeah, so many `Spig`s are in use :)

See [gulpfile](gulpfile.js) for an example.

## Working with Spig

Build:

```shell
yarn build
```
or
```
gulp build
```

The output folder is `out`.

Development mode, watch & server on port `9000`:

```shell
yarn dev
```


## Read more

TODO
